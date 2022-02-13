import {ClassComponent, Vnode} from 'mithril';
import Tooltip from 'flarum/common/components/Tooltip';
import Button from 'flarum/common/components/Button';

interface IconButtonAttrs {
    title: any
    icon: string
    onclick: () => void
    disabled?: boolean
}

/**
 * Since every one of our buttons will need a tooltip and same class name, a re-usable component makes sense
 * Particularly because the title text needs to be injected in 2 places
 */
export default class IconButton implements ClassComponent<IconButtonAttrs> {
    view(vnode: Vnode<IconButtonAttrs, this>) {
        return Tooltip.component({
            text: vnode.attrs.title,
        }, Button.component({
            'aria-label': vnode.attrs.title,
            icon: vnode.attrs.icon,
            className: 'Button Button--icon',
            onclick: vnode.attrs.onclick,
            disabled: vnode.attrs.disabled,
        }));
    }
}
