import Model from 'flarum/common/Model';
import app from 'flarum/forum/app';

export default class SelectState {
    type: string
    ids: string[] = []

    constructor(type: string) {
        this.type = type;
    }

    private indexOf(model: Model) {
        return this.ids.indexOf(model.id() || '');
    }

    contains(model: Model): boolean {
        return this.indexOf(model) !== -1;
    }

    toggle(model: Model): void {
        if (!model.id()) {
            throw 'Missing ID in model';
        }

        const index = this.indexOf(model);

        if (index === -1) {
            this.ids.push(model.id()!);
        } else {
            this.ids.splice(index, 1);
        }
    }

    add(model: Model): void {
        if (!model.id()) {
            throw 'Missing ID in model';
        }

        if (!this.contains(model)) {
            this.ids.push(model.id()!);
        }
    }

    clear(): void {
        this.ids = [];
    }

    count(): number {
        return this.ids.length;
    }

    private callbackWithModel<T = void>(callback: (model: Model) => T): (id: string) => T {
        return (id: string) => {
            return callback(app.store.getById(this.type, id)!);
        }
    }

    forEach(callback: (model: Model) => void): void {
        this.ids.forEach(this.callbackWithModel(callback));
    }

    forEachPromise(callback: (model: Model) => Promise<any>): Promise<any> {
        return Promise.all(this.ids.map(this.callbackWithModel(callback)));
    }

    some(callback: (model: Model) => boolean): boolean {
        return this.ids.some(this.callbackWithModel<boolean>(callback));
    }

    all(): Model[] {
        return this.ids.map(id => app.store.getById(this.type, id)!);
    }
}
