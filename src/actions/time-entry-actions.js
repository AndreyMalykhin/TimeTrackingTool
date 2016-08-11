import {Actions} from 'react-native-router-flux';
import {startSubmit, stopSubmit} from 'redux-form';
import i18n from 'react-native-i18n';
import {
    GET_TIME_ENTRIES_REQUEST,
    GET_TIME_ENTRIES_RESPONSE,
    SAVE_TIME_ENTRY
} from '../utils/action-type';
import {addGenericError} from './notification-actions';
import {TIME_ENTRY} from '../utils/form-type';

export function getTimeEntriesByPeriod(userId, startDate, endDate) {
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

export function saveTimeEntry(entry) {
    return (dispatch, getState, {timeEntryService}) => {
        dispatch(startSubmit(TIME_ENTRY));
        return timeEntryService.save(entry)
        .then((response) => {
            if (response.error) {
                const msg = response.error_description ||
                    i18n.t('common.genericError');
                dispatch(stopSubmit(TIME_ENTRY, {_error: msg}));
                return;
            }

            dispatch(stopSubmit(TIME_ENTRY));
            dispatch({type: SAVE_TIME_ENTRY, payload: response});
            Actions.pop();
        })
        .catch((error) => {
            // TODO
            console.error(error);
            dispatch(stopSubmit(
                TIME_ENTRY, {_error: i18n.t('common.genericError')}));
        });
    };
}
