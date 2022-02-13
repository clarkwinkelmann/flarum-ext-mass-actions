import {extend} from 'flarum/common/extend';
import app from 'flarum/forum/app';
import IndexPage from 'flarum/forum/components/IndexPage';
import Button from 'flarum/common/components/Button';
import Dropdown from 'flarum/common/components/Dropdown';
import DiscussionControls from 'flarum/forum/utils/DiscussionControls';
import proxyModels from './utils/proxyModels';
import IconButton from './components/IconButton';

export default function () {
    extend(IndexPage.prototype, 'actionItems', function (items) {
        const select = app.current.get('mass-select');
        if (!select || select.count() === 0) {
            return;
        }

        // Remove global actions
        items.remove('refresh');
        items.remove('markAllAsRead');

        items.add('mass-markAsRead', m(IconButton, {
            title: app.translator.trans('clarkwinkelmann-mass-actions.forum.actions.markAsRead'),
            icon: 'fas fa-check',
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

            items.add('mass-hide', m(IconButton, {
                title: anyHidden ? app.translator.trans('clarkwinkelmann-mass-actions.forum.actions.restore') : app.translator.trans('clarkwinkelmann-mass-actions.forum.actions.hide'),
                icon: anyHidden ? 'fas fa-reply' : 'fas fa-trash-alt',
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
    });
}
