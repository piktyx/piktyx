import { UPLOAD_PICTURE_SUCCESS, UPLOAD_PICTURE_FAILURE, UPLOAD_PICTURE_REQUEST, RECEIVE_PICTURE_DATA, FETCH_PICTURE_REQUEST, FETCH_PICTURE_FAILURE, DELETE_PICTURE_FAILURE, DELETE_PICTURE_REQUEST, DELETE_PICTURE_SUCCESS } from '../constants/index';
import { createReducer } from '../utils/misc';

const initialState = {
    files: null,
    uploaded: false,
    pictures_loaded: false
};

export default createReducer(initialState, {
    [UPLOAD_PICTURE_SUCCESS]: (state, payload) =>
        Object.assign({}, state, {
            files: payload.files,
            uploaded: true,
        }),
    [RECEIVE_PICTURE_DATA]: (state, payload) =>
        Object.assign({}, state, {
            files: payload.files,
            pictures_loaded: true,
        }),
    [FETCH_PICTURE_REQUEST]: (state) =>
        Object.assign({}, state, {
            files: null,
            pictures_loaded: false,
        }),
    [UPLOAD_PICTURE_REQUEST]: (state) =>
        Object.assign({}, state, {
            files: null,
            uploaded: false,
        }),
});
