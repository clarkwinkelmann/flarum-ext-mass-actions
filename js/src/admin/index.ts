import app from 'flarum/admin/app';

app.initializers.add('mass-actions', () => {
    app.extensionData
        .for('clarkwinkelmann-mass-actions')
        .registerPermission({
            icon: 'fas fa-stream',
            label: app.translator.trans('clarkwinkelmann-mass-actions.admin.permissions.controls'),
            permission: 'mass-actions.controls',
            allowGuest: true,
        }, 'view');
});
