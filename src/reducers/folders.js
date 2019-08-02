import { ADD_FOLDER_SUCCESS, ADD_FOLDER_FAILURE, ADD_FOLDER_REQUEST, RECEIVE_FOLDER_DATA, FETCH_FOLDER_REQUEST, FETCH_FOLDER_FAILURE, DELETE_FOLDER_FAILURE, DELETE_FOLDER_REQUEST, DELETE_FOLDER_SUCCESS } from '../constants/index';
import { createReducer } from '../utils/misc';

const initialState = {
    folders: null,
    uploaded: false,
    folders_loaded: false
};

export default createReducer(initialState, {
    [ADD_FOLDER_SUCCESS]: (state, payload) =>
        Object.assign({}, state, {
            uploaded: true,
        }),
    [RECEIVE_FOLDER_DATA]: (state, payload) =>
        Object.assign({}, state, {
            folders: payload.folders,
            folders_loaded: true,
        }),
    [FETCH_FOLDER_REQUEST]: (state) =>
        Object.assign({}, state, {
            folders: null,
            folders_loaded: false,
        }),
    [ADD_FOLDER_REQUEST]: (state) =>
        Object.assign({}, state, {
            uploaded: false,
        }),
});
