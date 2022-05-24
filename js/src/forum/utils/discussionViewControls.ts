import app from 'flarum/forum/app';
import Button from 'flarum/common/components/Button';
import ItemList from 'flarum/common/utils/ItemList';
import icon from 'flarum/common/helpers/icon';
import listItems from 'flarum/common/helpers/listItems';
import Discussion from 'flarum/common/models/Discussion';

export default function (items: ItemList<any>): ItemList<any> {
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
            app.current.get('mass-select')!.addAll();
        },
    }, app.translator.trans('clarkwinkelmann-mass-actions.forum.select.all')));

    controls.add('clear', Button.component({
        onclick() {
            app.current.get('mass-select')!.clear();
        },
    }, app.translator.trans('clarkwinkelmann-mass-actions.forum.select.none')));

    controls.add('read', Button.component({
        onclick() {
            app.current.get('mass-select')!.clear();
            app.current.get('mass-select')!.addAll(model => {
                return (model as Discussion).isRead();
            });
        },
    }, app.translator.trans('clarkwinkelmann-mass-actions.forum.select.read')));

    controls.add('unread', Button.component({
        onclick() {
            app.current.get('mass-select')!.clear();
            app.current.get('mass-select')!.addAll(model => {
                return (model as Discussion).isUnread();
            });
        },
    }, app.translator.trans('clarkwinkelmann-mass-actions.forum.select.unread')));

    controls.add('visible', Button.component({
        onclick() {
            app.current.get('mass-select')!.clear();
            app.current.get('mass-select')!.addAll(model => {
                return !(model as Discussion).isHidden();
            });
        },
    }, app.translator.trans('clarkwinkelmann-mass-actions.forum.select.visible')));

    controls.add('hidden', Button.component({
        onclick() {
            app.current.get('mass-select')!.clear();
            app.current.get('mass-select')!.addAll(model => {
                return (model as Discussion).isHidden();
            });
        },
    }, app.translator.trans('clarkwinkelmann-mass-actions.forum.select.hidden')));

    if ('flarum-lock' in flarum.extensions) {
        controls.add('locked', Button.component({
            onclick() {
                app.current.get('mass-select')!.clear();
                app.current.get('mass-select')!.addAll(model => {
                    return model.attribute('isLocked');
                });
            },
        }, app.translator.trans('clarkwinkelmann-mass-actions.forum.select.locked')));

        controls.add('unlocked', Button.component({
            onclick() {
                app.current.get('mass-select')!.clear();
                app.current.get('mass-select')!.addAll(model => {
                    return !model.attribute('isLocked');
                });
            },
        }, app.translator.trans('clarkwinkelmann-mass-actions.forum.select.unlocked')));
    }

    // We don't use Flarum's SplitDropdown because the children of the first button aren't redrawing properly
    items.add('mass-select', m('.ButtonGroup.Dropdown.Dropdown--split.dropdown', {}, [
        Button.component({
            className: 'Button SplitDropdown-button MassSelectControl' + (count > 0 ? ' checked' : ''),
            onclick() {
                if (app.current.get('mass-select')!.count() === 0) {
                    app.current.get('mass-select')!.addAll();
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

    return items;
}
