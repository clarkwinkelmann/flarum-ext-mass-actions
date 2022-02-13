import app from 'flarum/forum/app';
import patchCoreComponents from './patchCoreComponents';
import addDiscussionControls from './addDiscussionControls';
import addDiscussionActions from './addDiscussionActions';

app.initializers.add('mass-actions', () => {
    patchCoreComponents();
    addDiscussionControls();
    addDiscussionActions();
});
