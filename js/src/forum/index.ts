import {extend} from 'flarum/common/extend';
import app from 'flarum/forum/app';
import IndexPage from 'flarum/forum/components/IndexPage';
import DiscussionListItem from 'flarum/forum/components/DiscussionListItem';
import Button from 'flarum/common/components/Button';
import Dropdown from 'flarum/common/components/Dropdown';
import ItemList from 'flarum/common/utils/ItemList';
import DiscussionControls from 'flarum/forum/utils/DiscussionControls';
import icon from 'flarum/common/helpers/icon';
import listItems from 'flarum/common/helpers/listItems';
import Checkbox from './components/Checkbox';
import SelectState from './utils/SelectState';
import proxyModels from './utils/proxyModels';

app.initializers.add('clarkwinkelmann-mass-actions', () => {
    function selectAllDiscussions() {
        app.discussions.getPages().forEach(page => {
            page.items.forEach(discussion => {
                app.current.get('mass-select')!.add(discussion);
            });
        });
    }

    extend(IndexPage.prototype, 'viewItems', function (items) {
        const controls = new ItemList();

        let iconName = 'far fa-square';
        const count = app.current.get('mass-select')!.count();

        if (count > 0) {
            if (count === app.discussions.getPages().reduce((total, page) => total + page.items.length, 0)) {
                iconName = 'fas fa-check-square';
            } else {
                iconName = 'fas fa-minus-square';
            }
        }

        controls.add('all', Button.component({
            onclick() {
                selectAllDiscussions();
            },
        }, app.translator.trans('clarkwinkelmann-mass-actions.forum.select.all')));

        controls.add('clear', Button.component({
            onclick() {
                app.current.get('mass-select')!.clear();
            },
        }, app.translator.trans('clarkwinkelmann-mass-actions.forum.select.none')));

        // We don't use Flarum's SplitDropdown because the children of the first button aren't redrawing properly
        items.add('mass-select', m('.ButtonGroup.Dropdown.Dropdown--split.dropdown', {}, [
            Button.component({
                className: 'Button SplitDropdown-button MassSelectControl' + (count > 0 ? ' checked' : ''),
                onclick() {
                    if (app.current.get('mass-select')!.count() === 0) {
                        selectAllDiscussions();
                    } else {
                        app.current.get('mass-select')!.clear();
                    }
                },
            }, icon(iconName)),
            m('button.Dropdown-toggle.Button.Button--icon', {
                'data-toggle': 'dropdown',
            }, icon('fas fa-caret-down', {className: 'Button-caret'})),
            m('ul.Dropdown-menu.dropdown-menu', listItems(controls.toArray())),
        ]), 100);
    });

    extend(IndexPage.prototype, 'actionItems', function (items) {
        const select = app.current.get('mass-select');
        if (!select || select.count() === 0) {
            return;
        }

        // Remove global actions
        items.remove('refresh');
        items.remove('markAllAsRead');

        items.add('mass-markAsRead', Button.component({
            title: app.translator.trans('clarkwinkelmann-mass-actions.forum.actions.markAsRead'),
            icon: 'fas fa-check',
            className: 'Button Button--icon',
            onclick() {
                select.forEachPromise(discussion => {
                    // Same code as in DiscussionListItem
                    if (discussion.isUnread()) {
                        return discussion.save({lastReadPostNumber: discussion.lastPostNumber()});
                    }

                    return Promise.resolve();
                }).then(() => {
                    m.redraw();
                });
            },
        }));

        if (app.forum.attribute('canHideDiscussionsSometime')) {
            const anyHidden = select.some(discussion => {
                return discussion.isHidden();
            });

            items.add('mass-hide', Button.component({
                title: anyHidden ? app.translator.trans('clarkwinkelmann-mass-actions.forum.actions.restore') : app.translator.trans('clarkwinkelmann-mass-actions.forum.actions.hide'),
                icon: anyHidden ? 'fas fa-reply' : 'fas fa-trash-alt',
                className: 'Button Button--icon',
                onclick() {
                    select.forEachPromise(discussion => {
                        if (!discussion.canHide()) {
                            return Promise.resolve();
                        }

                        if (anyHidden) {
                            return DiscussionControls.restoreAction.call(discussion);
                        } else {
                            return DiscussionControls.hideAction.call(discussion);
                        }
                    }).then(() => {
                        m.redraw();
                    });
                },
                disabled: !select.some(discussion => {
                    return discussion.canHide();
                }),
            }));
        }

        if (app.forum.attribute('canLockDiscussionsSometime')) {
            const anyLocked = select.some(discussion => {
                return discussion.attribute('isLocked');
            });

            items.add('mass-lock', Button.component({
                title: anyLocked ? app.translator.trans('clarkwinkelmann-mass-actions.forum.actions.unlock') : app.translator.trans('clarkwinkelmann-mass-actions.forum.actions.lock'),
                icon: anyLocked ? 'fas fa-unlock' : 'fas fa-lock',
                className: 'Button Button--icon',
                onclick() {
                    select.forEachPromise(discussion => {
                        if (!discussion.attribute('canLock')) {
                            return Promise.resolve();
                        }

                        // Re-implement DiscussionControls.lockAction to force lock or unlock instead of toggling
                        return discussion.save({isLocked: !anyLocked});
                    }).then(() => {
                        m.redraw();
                    });
                },
                disabled: !select.some(discussion => {
                    return discussion.attribute('canLock');
                }),
            }));
        }

        items.add('mass-tags', Dropdown.component({
            buttonClassName: 'Button',
            label: app.translator.trans('clarkwinkelmann-mass-actions.forum.actions.tags'),
            disabled: !select.some(discussion => {
                return discussion.attribute('canTag');
            }),
        }, [
            Button.component({
                onclick() {
                    app.modal.show(flarum.core.compat['tags/forum/components/TagDiscussionModal'], {
                        discussion: proxyModels(select.all()),
                    });
                },
            }, app.translator.trans('clarkwinkelmann-mass-actions.forum.actions.tags-edit')),
            app.store.all('tags').map(tag => Button.component({
                onclick() {
                    select.forEachPromise(discussion => {
                        if (!discussion.attribute('canTag')) {
                            return Promise.resolve();
                        }

                        const tags = discussion.tags() || [];

                        // If discussion already has this tag, skip
                        if (tags.some(thisTag => thisTag.id() === tag.id())) {
                            return Promise.resolve();
                        }

                        tags.push(tag);

                        return discussion.save({relationships: {tags}})
                    }).then(() => {
                        m.redraw();
                    });
                },
            }, app.translator.trans('clarkwinkelmann-mass-actions.forum.actions.tags-add', {
                tag: tag.name(),
            }))),
        ]));
    });

    extend(DiscussionListItem.prototype, 'view', function (vdom) {
        // Only add the checkboxes on the index page, not the drawer
        if (!app.current.matches(IndexPage)) {
            return;
        }

        vdom.children.forEach(vdom => {
            if (vdom && vdom.attrs && vdom.attrs.className && vdom.attrs.className.indexOf('DiscussionListItem-content') !== -1) {
                const state = app.current.get('mass-select')!;

                vdom.children.unshift(m('.DiscussionListItem-select', Checkbox.component({
                    state: state.contains(this.attrs.discussion),
                    onchange: () => {
                        state.toggle(this.attrs.discussion);
                    },
                })));
            }
        });
    });

    extend(DiscussionListItem.prototype, 'oninit', function () {
        this.subtree!.check(() => app.current.get('mass-select')?.contains(this.attrs.discussion));
    });

    extend(DiscussionListItem.prototype, 'elementAttrs', function (attrs) {
        if (app.current.get('mass-select')?.contains(this.attrs.discussion)) {
            attrs.className += ' DiscussionListItem--selected';
        }
    });

    extend(IndexPage.prototype, 'oninit', function () {
        app.current.set('mass-select', new SelectState('discussions'));
    });
});
