import Model from 'flarum/common/Model';
import app from 'flarum/forum/app';

export default class SelectState {
    type: string
    ids: string[] = []
    rangeStartId: string | null = null

    constructor(type: string) {
        this.type = type;
    }

    private indexOf(model: Model) {
        return this.ids.indexOf(model.id() || '');
    }

    contains(model: Model): boolean {
        return this.indexOf(model) !== -1;
    }

    toggle(model: Model, shift: boolean = false): void {
        if (!model.id()) {
            throw 'Missing ID in model';
        }

        if (shift && this.rangeStartId) {
            const candidates = this.allCandidates();
            const startModel = app.store.getById(this.type, this.rangeStartId)!;

            let startIndex = candidates.indexOf(startModel);
            let endIndex = candidates.indexOf(model);

            if (startIndex >= 0 && endIndex >= 0 && this.contains(startModel) !== this.contains(model)) {
                // Allow selection in both directions, switch indexes for use in slice() below
                if (startIndex > endIndex) {
                    [startIndex, endIndex] = [endIndex, startIndex];
                }

                candidates.slice(startIndex, endIndex + 1).forEach((this.contains(model) ? this.remove : this.add).bind(this));

                return;
            }
        }

        const index = this.indexOf(model);

        if (index === -1) {
            this.ids.push(model.id()!);
        } else {
            this.ids.splice(index, 1);
        }

        this.rangeStartId = model.id()!;
    }

    add(model: Model): void {
        if (!model.id()) {
            throw 'Missing ID in model';
        }

        if (!this.contains(model)) {
            this.ids.push(model.id()!);
        }
    }

    remove(model: Model): void {
        if (!model.id()) {
            throw 'Missing ID in model';
        }

        const index = this.indexOf(model);

        if (index !== -1) {
            this.ids.splice(index, 1);
        }
    }

    private allCandidates(): Model[] {
        const items: Model[] = [];

        app.discussions.getPages().forEach(page => {
            items.push(...page.items);
        });

        return items;
    }

    addAll(filter: (model: Model) => boolean = () => true): void {
        this.allCandidates().forEach(model => {
            if (filter(model)) {
                this.add(model);
            }
        });
        this.rangeStartId = null;
    }

    clear(): void {
        this.ids = [];
        this.rangeStartId = null;
    }

    count(): number {
        return this.ids.length;
    }

    private callbackWithModel<M extends Model = Model, T = void>(callback: (model: M) => T): (id: string) => T {
        return (id: string) => {
            return callback(app.store.getById(this.type, id)!);
        }
    }

    forEach(callback: (model: Model) => void): void {
        this.ids.forEach(this.callbackWithModel(callback));
    }

    forEachPromise<M extends Model = Model>(callback: (model: M) => Promise<any>): Promise<any> {
        return Promise.all(this.ids.map(this.callbackWithModel<M>(callback)));
    }

    some<M extends Model = Model>(callback: (model: M) => boolean): boolean {
        return this.ids.some(this.callbackWithModel<M, boolean>(callback));
    }

    all(): Model[] {
        return this.ids.map(id => app.store.getById(this.type, id)!);
    }
}
