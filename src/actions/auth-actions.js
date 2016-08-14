import i18n from 'react-native-i18n';
import {startSubmit, stopSubmit} from 'redux-form';
import {Actions, ActionConst} from 'react-native-router-flux';
import {LOGIN} from '../utils/form-type';
import {SESSION} from '../utils/setting-id';
import {addGenericError} from './notification-actions';
import {getUser} from './user-actions';
import {SET_SESSION} from '../utils/action-type';

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

            dispatch(stopSubmit(LOGIN));
            const session = {
                accessTokenType: response.token_type,
                accessToken: response.access_token,
                userId: response.userId,
                expireDate: Date.now() + response.expires_in * 1000
            };
            return db.setItem(SESSION, JSON.stringify(session))
                .then(() => session);
        })
        .then((session) => {
            return session && afterLogin(dispatch, session, fetcher);
        })
        .catch((error) => {
            // TODO
            console.error(error);
            dispatch(addGenericError());
        });
    };
}

export function ensureLoggedIn() {
    return (dispatch, getState, {db, fetcher}) => {
        return db.getItem(SESSION)
        .then((session) => {
            if (session) {
                session = JSON.parse(session);

                if (session.expireDate > Date.now()) {
                    return afterLogin(dispatch, session, fetcher);
                }
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

function afterLogin(dispatch, session, fetcher) {
    const {accessTokenType, accessToken, userId} = session;
    fetcher.options.headers['Authorization'] =
        `${accessTokenType} ${accessToken}`;
    dispatch({type: SET_SESSION, payload: session});
    return dispatch(getUser(userId)).then(() => {
        Actions.timesheet({type: ActionConst.RESET});
    });
}
