import Model from 'flarum/common/Model';

export default function proxyModels(models: Model[]) {
    return new Proxy(models[0], {
        get(target, prop, receiver) {
            if (prop === 'save') {
                return (attributes: any, options = {}) => {
                    return Promise.all(models.map(model => model.save({...attributes}, {...options})));
                };
            }

            return Reflect.get(target, prop, receiver);
        },
    });
}
