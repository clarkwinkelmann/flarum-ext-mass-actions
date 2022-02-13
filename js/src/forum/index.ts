import {extend, override} from 'flarum/common/extend';
import app from 'flarum/forum/app';
import IndexPage from 'flarum/forum/components/IndexPage';
import DiscussionListItem from 'flarum/forum/components/DiscussionListItem';
import Button from 'flarum/common/components/Button';
import SplitDropdown from 'flarum/common/components/SplitDropdown';
import ItemList from 'flarum/common/utils/ItemList';
import Tooltip from 'flarum/common/components/Tooltip';
import icon from 'flarum/common/helpers/icon';
import listItems from 'flarum/common/helpers/listItems';
import Checkbox from './components/Checkbox';
import SelectState from './utils/SelectState';
import Discussion from 'flarum/common/models/Discussion';

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
        }, 'Select all'));

        controls.add('clear', Button.component({
            onclick() {
                app.current.get('mass-select')!.clear();
            },
        }, 'Unselect all'));

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
        app.current.set('mass-select', new SelectState());
    });
});
