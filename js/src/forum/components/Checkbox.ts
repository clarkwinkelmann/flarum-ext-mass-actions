import Component, {ComponentAttrs} from 'flarum/common/Component';
import icon from 'flarum/common/helpers/icon';

interface CheckboxAttrs extends ComponentAttrs {
    state: boolean
    onchange: () => void,
}

export default class Checkbox extends Component<CheckboxAttrs> {
    view() {
        return m('.MassSelectControl', {
            className: this.attrs.state ? 'checked' : '',
            role: 'checkbox',
            onclick: this.attrs.onchange,
        }, icon(this.attrs.state ? 'fas fa-check-square' : 'far fa-square'));
    }
}
