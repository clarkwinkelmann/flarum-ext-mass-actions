import {extend} from 'flarum/common/extend';
import Dropdown from 'flarum/common/components/Dropdown';

export default function () {
    // Flarum's Dropdown component doesn't support disabled state out of the box
    extend(Dropdown.prototype, 'getButton', function (vnode) {
        // @ts-ignore
        vnode.attrs.disabled = this.attrs.disabled;
    });
}
