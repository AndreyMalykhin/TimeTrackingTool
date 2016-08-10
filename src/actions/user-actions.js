import {GET_USER_REQUEST, GET_USER_RESPONSE} from '../utils/action-type';
import {addGenericError} from '../actions/notification-actions';

export function getUser(id) {
    return (dispatch, getState, {userService}) => {
        dispatch({type: GET_USER_REQUEST});
        return userService.get(id)
        .then((response) => {
            dispatch({type: GET_USER_RESPONSE, payload: response});
        })
        .catch((error) => {
            // TODO
            console.error(error);
            dispatch({
                type: GET_USER_RESPONSE,
                payload: error,
                error: true
            });
            dispatch(addGenericError());
        });
    };
}
