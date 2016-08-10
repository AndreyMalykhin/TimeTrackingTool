import {GET_TIME_ENTRIES_REQUEST, GET_TIME_ENTRIES_RESPONSE} from
    '../utils/action-type';
import {addGenericError} from './notification-actions';

export function getTimeEntries(userId, startDate, endDate) {
    return (dispatch, getState, {timeEntryService}) => {
        dispatch({type: GET_TIME_ENTRIES_REQUEST});
        return timeEntryService.getByUser(userId, startDate, endDate)
        .then((response) => {
            dispatch({type: GET_TIME_ENTRIES_RESPONSE, payload: response});
        })
        .catch((error) => {
            // TODO
            console.error(error);
            dispatch({
                type: GET_TIME_ENTRIES_RESPONSE,
                payload: error,
                error: true
            });
            dispatch(addGenericError());
        });
    };
}
