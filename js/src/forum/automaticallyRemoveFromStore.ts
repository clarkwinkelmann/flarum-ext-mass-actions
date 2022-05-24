import {override} from 'flarum/common/extend';
import app from 'flarum/forum/app';
import Store from 'flarum/common/Store';

export default function () {
    // Automatically remove a model from the selection if it's disabled from the store
    // This prevents the forEach()/some() methods on the selection to include undefined after a model is permanently deleted
    override(Store.prototype, 'remove', function (original, model) {
        const select = app.current.get('mass-select');

        if (select && select.type === model.data.type) {
            select.remove(model);
        }

        return original(model);
    });
}
