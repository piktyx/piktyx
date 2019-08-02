import { ADD_PICTURE_FOLDER_SUCCESS, ADD_PICTURE_FOLDER_FAILURE, ADD_PICTURE_FOLDER_REQUEST, DELETE_PICTURE_FOLDER_SUCCESS, DELETE_PICTURE_FOLDER_FAILURE, DELETE_PICTURE_FOLDER_REQUEST, ADD_FOLDER_SUCCESS, ADD_FOLDER_FAILURE, ADD_FOLDER_REQUEST, RECEIVE_FOLDER_DATA, FETCH_FOLDER_REQUEST, FETCH_FOLDER_FAILURE, DELETE_FOLDER_FAILURE, DELETE_FOLDER_REQUEST, DELETE_FOLDER_SUCCESS } from '../constants/index';
import { parseJSON } from '../utils/misc';
import { add_folder, fetch_folders, delete_folder, add_picture_folder, delete_picture_folder } from '../utils/http_functions';

export function addPictureSuccess(data) {
    return {
        type: ADD_PICTURE_FOLDER_SUCCESS,
    };
}

export function addPictureFailure(error) {
    return {
        type: ADD_PICTURE_FOLDER_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText,
        },
    };
}

export function deletePictureRequest() {
    return {
        type: DELETE_PICTURE_FOLDER_REQUEST,
    };
}

export function deletePictureSuccess(data) {
    return {
        type: DELETE_PICTURE_FOLDER_SUCCESS,
    };
}

export function deletePictureFailure(error) {
    return {
        type: DELETE_PICTURE_FOLDER_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText,
        },
    };
}

export function addPictureRequest() {
    return {
        type: ADD_PICTURE_FOLDER_REQUEST,
    };
}

export function folderUploadSuccess(data) {
    return {
        type: ADD_FOLDER_SUCCESS,
    };
}

export function folderFetchSuccess(data) {
    return {
        type: RECEIVE_FOLDER_DATA,
        payload: {
            folders: data
        },
    };
}

export function folderFetchFailure(error) {
    return {
        type: FETCH_FOLDER_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText,
        },
    };
}

export function folderUploadFailure(error) {
    return {
        type: ADD_FOLDER_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText,
        },
    };
}


export function folderUploadRequest() {
    return {
        type: ADD_FOLDER_REQUEST,
    };
}


export function folderFetchRequest() {
    return {
        type: FETCH_FOLDER_REQUEST,
    };
}

export function folderDeleteSuccess(success) {
    return {
        type: DELETE_FOLDER_SUCCESS,
    };
}


export function folderDeleteFailure(error) {
    return {
        type: DELETE_FOLDER_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText,
        },
    };
}


export function folderDeleteRequest() {
    return {
        type: DELETE_FOLDER_REQUEST,
    };
}

export function addFolder(folder, tags, token) {
    return function (dispatch) {
        dispatch(folderUploadRequest());
        return add_folder(folder, tags, token)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(folderUploadSuccess(response));
                } catch (e) {
                    alert(e);
                    dispatch(folderUploadFailure({
                        response: {
                            status: 403,
                            statusText: 'Upload failed',
                        },
                    }));
                }
            })
            .catch(error => {
                dispatch(folderUploadFailure({
                    response: {
                        status: 403,
                        statusText: 'Upload failed',
                    },
                }));
            });
    };
}

export function addPictureFolder(pic, folders, token) {
    return function (dispatch) {
        dispatch(addPictureRequest());
        return add_picture_folder(pic, folders, token)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(addPictureSuccess(response));
                } catch (e) {
                    alert(e);
                    dispatch(addPictureFailure({
                        response: {
                            status: 403,
                            statusText: 'Add failed',
                        },
                    }));
                }
            })
            .catch(error => {
                dispatch(addPictureFailure({
                    response: {
                        status: 403,
                        statusText: 'Add failed',
                    },
                }));
            });
    };
}

export function deletePictureFolder(pic, folder, token) {
    return function (dispatch) {
        dispatch(deletePictureRequest());
        return delete_picture_folder(pic, folder, token)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(deletePictureSuccess(response));
                } catch (e) {
                    alert(e);
                    dispatch(deletePictureFailure({
                        response: {
                            status: 403,
                            statusText: 'Add failed',
                        },
                    }));
                }
            })
            .catch(error => {
                dispatch(deletePictureFailure({
                    response: {
                        status: 403,
                        statusText: 'Add failed',
                    },
                }));
            });
    };
}

export function fetchFolders(token) {
    return function (dispatch) {
        dispatch(folderFetchRequest());
        return fetch_folders(token)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(folderFetchSuccess(response));
                } catch (e) {
                    alert(e);
                    dispatch(folderFetchFailure({
                        response: {
                            status: 403,
                            statusText: 'Fetch failed',
                        },
                    }));
                }
            })
            .catch(error => {
                dispatch(folderFetchFailure({
                    response: {
                        status: 403,
                        statusText: 'Fetch failed',
                    },
                }));
            });
    };
}

export function deleteFolder(token, id) {
    return function (dispatch) {
        dispatch(folderDeleteRequest());
        return delete_folder(token, id)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(folderDeleteSuccess(response));
                } catch (e) {
                    dispatch(folderDeleteFailure({
                        response: {
                            status: 403,
                            statusText: 'Delete failed',
                        },
                    }));
                }
            })
            .catch(error => {
                dispatch(folderDeleteFailure({
                    response: {
                        status: 403,
                        statusText: 'Delete failed',
                    },
                }));
            });
    };
}
