import Immutable from 'immutable';
import {SET_SESSION} from '../utils/action-type';

export default function (state = null, action) {
    switch (action.type) {
    case SET_SESSION: {
        return Immutable.fromJS(action.payload);
    }
    }

    return state;
}
