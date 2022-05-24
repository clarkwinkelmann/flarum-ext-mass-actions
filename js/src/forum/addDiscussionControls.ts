import {extend} from 'flarum/common/extend';
import app from 'flarum/forum/app';
import listItems from 'flarum/common/helpers/listItems';
import ItemList from 'flarum/common/utils/ItemList';
import IndexPage from 'flarum/forum/components/IndexPage';
import DiscussionListItem from 'flarum/forum/components/DiscussionListItem';
import DiscussionsUserPage from 'flarum/forum/components/DiscussionsUserPage';
import Checkbox, {CheckboxAttrs} from './components/Checkbox';
import SelectState from './utils/SelectState';
import discussionActionControls from './utils/discussionActionControls';
import discussionViewControls from './utils/discussionViewControls';

export default function () {
    extend(IndexPage.prototype, 'oninit', function () {
        app.current.set('mass-select', new SelectState('discussions'));
    });

    extend(IndexPage.prototype, 'viewItems', function (items) {
        if (!app.forum.attribute('massControls')) {
            return;
        }

        discussionViewControls(items);
    });

    extend(IndexPage.prototype, 'actionItems', function (items) {
        if (!app.forum.attribute('massControls')) {
            return;
        }

        discussionActionControls(items);
    });

    extend(DiscussionsUserPage.prototype, 'show', function () {
        app.current.set('mass-select', new SelectState('discussions'));
        app.current.get('mass-select')!.setListState(this.state!);
    });

    extend(DiscussionsUserPage.prototype, 'content', function (vdom) {
        if (!app.forum.attribute('massControls')) {
            return;
        }

        vdom.children.unshift(m('.IndexPage-toolbar', [
            m('.IndexPage-toolbar-view', listItems(discussionViewControls(new ItemList()).toArray())),
            m('.IndexPage-toolbar-action', listItems(discussionActionControls(new ItemList()).toArray())),
        ]));
    });

    extend(DiscussionListItem.prototype, 'view', function (vdom) {
        // Only add the checkboxes on the index+user pages, not the drawer
        if (!(app.current.matches(IndexPage) || app.current.matches(DiscussionsUserPage)) || !app.forum.attribute('massControls')) {
            return;
        }

        vdom.children.forEach(vdom => {
            if (vdom && vdom.attrs && vdom.attrs.className && vdom.attrs.className.indexOf('DiscussionListItem-content') !== -1) {
                const state = app.current.get('mass-select')!;

                vdom.children.unshift(m('.DiscussionListItem-select', Checkbox.component<CheckboxAttrs>({
                    state: state.contains(this.attrs.discussion),
                    onchange: event => {
                        state.toggle(this.attrs.discussion, event.shiftKey);
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
}
