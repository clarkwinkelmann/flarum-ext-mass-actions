import Model from 'flarum/common/Model';

export default class SelectState {
    ids: string[] = []

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
}
