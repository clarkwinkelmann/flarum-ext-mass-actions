import app from 'flarum/forum/app';
import Button from 'flarum/common/components/Button';
import Dropdown from 'flarum/common/components/Dropdown';
import DiscussionControls from 'flarum/forum/utils/DiscussionControls';
import Discussion from 'flarum/common/models/Discussion';
import extractText from 'flarum/common/utils/extractText';
import ItemList from 'flarum/common/utils/ItemList';
import proxyModels from './proxyModels';
import IconButton from '../components/IconButton';

export default function (items: ItemList<any>): ItemList<any> {
    const select = app.current.get('mass-select');
    if (!select || select.count() === 0) {
        return items;
    }

    // Remove global actions
    items.remove('refresh');
    items.remove('markAllAsRead');

    items.add('mass-markAsRead', m(IconButton, {
        title: app.translator.trans('clarkwinkelmann-mass-actions.forum.actions.markAsRead'),
        icon: 'fas fa-check',
        onclick() {
            select.forEachPromise<Discussion>(discussion => {
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

    const anyHidden = select.some<Discussion>(discussion => {
        return discussion.isHidden();
    });

    if (app.forum.attribute('canHideDiscussionsSometime')) {
        items.add('mass-hide', m(IconButton, {
            title: anyHidden ? app.translator.trans('clarkwinkelmann-mass-actions.forum.actions.restore') : app.translator.trans('clarkwinkelmann-mass-actions.forum.actions.hide'),
            icon: anyHidden ? 'fas fa-reply' : 'fas fa-trash-alt',
            onclick() {
                select.forEachPromise<Discussion>(discussion => {
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
            disabled: !select.some<Discussion>(discussion => {
                return !!discussion.canHide();
            }),
        }));
    }

    if (app.forum.attribute('canDeleteDiscussionsSometime') && anyHidden) {
        // Make a more accurate count of what exactly we will attempt to delete
        // so the confirmation message is not misleading
        const count = select.all<Discussion>().filter(discussion => discussion.canDelete() && discussion.isHidden()).length;

        items.add('mass-delete', m(IconButton, {
            title: app.translator.trans('clarkwinkelmann-mass-actions.forum.actions.delete'),
            icon: 'fas fa-times',
            onclick() {
                // We can't call DiscussionControls.deleteAction as it would show a confirmation message for every selected discussion
                // Instead we manually do the same thing with a single confirmation
                if (!confirm(extractText(app.translator.trans('clarkwinkelmann-mass-actions.forum.actions.deleteConfirmation', {
                    count,
                })))) {
                    return;
                }

                select.forEachPromise<Discussion>(discussion => {
                    if (!discussion.canDelete() || !discussion.isHidden()) {
                        return Promise.resolve();
                    }

                    return discussion.delete().then(() => app.discussions.removeDiscussion(discussion));
                }).then(() => {
                    m.redraw();
                });
            },
            disabled: count === 0,
        }));
    }

    if (app.forum.attribute('canLockDiscussionsSometime')) {
        const anyLocked = select.some(discussion => {
            return discussion.attribute('isLocked');
        });

        items.add('mass-lock', m(IconButton, {
            title: anyLocked ? app.translator.trans('clarkwinkelmann-mass-actions.forum.actions.unlock') : app.translator.trans('clarkwinkelmann-mass-actions.forum.actions.lock'),
            icon: anyLocked ? 'fas fa-unlock' : 'fas fa-lock',
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

    if (app.forum.attribute('canStickyDiscussionsSometime')) {
        const anySticky = select.some(discussion => {
            return discussion.attribute('isSticky');
        });

        items.add('mass-sticky', m(IconButton, {
            title: anySticky ? app.translator.trans('clarkwinkelmann-mass-actions.forum.actions.unsticky') : app.translator.trans('clarkwinkelmann-mass-actions.forum.actions.sticky'),
            icon: 'fas fa-thumbtack', // Unfortunately, there is no good alternate icon for on/off
            onclick() {
                select.forEachPromise(discussion => {
                    if (!discussion.attribute('canSticky')) {
                        return Promise.resolve();
                    }

                    return discussion.save({isSticky: !anySticky});
                }).then(() => {
                    m.redraw();
                });
            },
            disabled: !select.some(discussion => {
                return discussion.attribute('canSticky');
            }),
        }));
    }

    if (app.forum.attribute('canTagDiscussionsSometime')) {
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
    }

    return items;
}
