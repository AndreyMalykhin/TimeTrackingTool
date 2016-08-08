import i18n from 'react-native-i18n';
import {startSubmit, stopSubmit} from 'redux-form';
import {Actions, ActionConst} from 'react-native-router-flux';
import {LOGIN} from '../utils/form-type';
import {SESSION} from '../utils/setting-id';
import {addGenericError} from '../actions/notification-actions';

export function login(name, password) {
    return (dispatch, getState, {authService, fetcher, db}) => {
        dispatch(startSubmit(LOGIN));
        return authService.login(name, password)
        .then((response) => {
            if (!response.access_token) {
                const msg = response.error_description ||
                    i18n.t('common.genericError');
                dispatch(stopSubmit(LOGIN, {_error: msg}));
                return;
            }

            fetcher.options.headers['Authorization'] =
                `${response.token_type} ${response.access_token}`;
            dispatch(stopSubmit(LOGIN));
            Actions.timesheet({type: ActionConst.RESET});
            return db.setItem(SESSION, JSON.stringify({
                accessTokenType: response.token_type,
                accessToken: response.access_token,
                userId: response.userId,
                expireDate: Date.now() + response.expires_in * 1000
            }));
        })
        .catch((error) => {
            // TODO
            console.error(error);
            dispatch(addGenericError());
        });
    };
}

export function ensureLoggedIn() {
    return (dispatch, getState, {db}) => {
        return db.getItem(SESSION)
        .then((session) => {
            if (session && JSON.parse(session).expireDate > Date.now()) {
                Actions.timesheet({type: ActionConst.RESET});
                return;
            }

            Actions.login({type: ActionConst.RESET});
        })
        .catch((error) => {
            // TODO
            console.error(error);
            dispatch(addGenericError());
        });
    };
}

export function logout() {
    return (dispatch, getState, {db}) => {
        return db.removeItem(SESSION)
        .then(() => {
            Actions.login({type: ActionConst.RESET});
        })
        .catch((error) => {
            // TODO
            console.error(error);
            dispatch(addGenericError());
        });
    };
}
