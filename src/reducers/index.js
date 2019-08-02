import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import auth from './auth';
import data from './data';
import pictures from './pictures';
import folders from './folders';

const rootReducer = (history) => combineReducers({
    router: connectRouter(history),
    /* your reducers */
    auth,
    pictures,
    folders,
    data,
});

export default rootReducer;
