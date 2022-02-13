import app from 'flarum/admin/app';

app.initializers.add('clarkwinkelmann-mass-actions', () => {
    app.extensionData
        .for('clarkwinkelmann-mass-actions')
        .registerPermission({
            icon: 'fas fa-stream',
            label: app.translator.trans('clarkwinkelmann-see-past-first-post.admin.permissions.see-past-first-post'),
            permission: 'discussion.seePastFirstPost',
            allowGuest: true,
        }, 'view');
});
