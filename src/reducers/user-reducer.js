import Immutable from 'immutable';
import {GET_USER_REQUEST, GET_USER_RESPONSE} from '../utils/action-type';

const initialState = Immutable.fromJS({entities: {}, isLoading: false});

export default function (state = initialState, action) {
    switch(action.type) {
    case GET_USER_REQUEST: {
        return state.set('isLoading', true);
    }
    case GET_USER_RESPONSE: {
        const {payload, error} = action;

        if (error || payload.error) {
            return state.set('isLoading', false);
        }

        return state.mergeDeep({
            isLoading: false,
            entities: {[payload.id]: payload}
        });
    }
    }

    return state;
}
