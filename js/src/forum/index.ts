import app from 'flarum/forum/app';
import patchCoreComponents from './patchCoreComponents';
import addDiscussionControls from './addDiscussionControls';
import addDiscussionActions from './addDiscussionActions';
import automaticallyRemoveFromStore from './automaticallyRemoveFromStore';

app.initializers.add('mass-actions', () => {
    patchCoreComponents();
    addDiscussionControls();
    addDiscussionActions();
    automaticallyRemoveFromStore();
});
