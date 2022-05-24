import PageState from 'flarum/common/states/PageState';
import SelectState from './src/forum/utils/SelectState';

declare module 'flarum/common/states/PageState' {
    export default interface PageState {
        get(key: 'mass-select'): SelectState | undefined
    }
}
