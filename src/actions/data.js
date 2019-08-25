import { FETCH_PROTECTED_DATA_REQUEST, RECEIVE_PROTECTED_DATA, SET_APP_LOADED, CHANGE_LANG_REQUEST, CHANGE_LANG_SUCCESS, CHANGE_LOCATION_REQUEST, CHANGE_LOCATION_SUCCESS } from '../constants/index';
import { parseJSON } from '../utils/misc';
import { data_about_user, change_lang, change_location } from '../utils/http_functions';
import { logoutAndRedirect } from './auth';

export function receiveProtectedData(data) {
    return {
        type: RECEIVE_PROTECTED_DATA,
        payload: {
            data,
        },
    };
}

export function fetchProtectedDataRequest() {
    return {
        type: FETCH_PROTECTED_DATA_REQUEST,
    };
}

export function setAppLoaded(){
    return {
        type: SET_APP_LOADED,
    };
}

export function changeLangRequest() {
    return {
        type: CHANGE_LANG_REQUEST,
    };
}

export function changeLangSuccess() {
    return {
        type: CHANGE_LANG_SUCCESS,
    };
}

export function changeLocationRequest() {
    return {
        type: CHANGE_LOCATION_REQUEST,
    };
}

export function changeLocationSuccess() {
    return {
        type: CHANGE_LOCATION_SUCCESS,
    };
}

export function fetchProtectedData(token) {
    return (dispatch) => {
        dispatch(fetchProtectedDataRequest());
        data_about_user(token)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveProtectedData(response.result));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
    
}

export function changeLocation(token, location) {
    return (dispatch) => {
        dispatch(changeLocationRequest());
        change_location(token, location)
            .then(parseJSON)
            .then(response => {
                dispatch(changeLocationSuccess(response.result));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}

export function changeLang(token, lang) {
    return (dispatch) => {
        dispatch(changeLangRequest());
        change_lang(token, lang)
            .then(parseJSON)
            .then(response => {
                dispatch(changeLangSuccess(response.result));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}
