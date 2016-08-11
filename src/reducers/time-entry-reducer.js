import Immutable from 'immutable';
import {
    GET_TIME_ENTRIES_REQUEST,
    GET_TIME_ENTRIES_RESPONSE,
    SAVE_TIME_ENTRY
} from '../utils/action-type';

const initialState = Immutable.fromJS({entities: [], isLoading: false});

export default function (state = initialState, action) {
    switch (action.type) {
    case GET_TIME_ENTRIES_REQUEST: {
        return state.set('isLoading', true);
    }
    case GET_TIME_ENTRIES_RESPONSE: {
        const {error, payload} = action;

        if (error || payload.error) {
            return state.set('isLoading', false);
        }

        return state.merge({
            isLoading: false,
            entities: Immutable.fromJS(payload)
        });
    }
    case SAVE_TIME_ENTRY: {
        const id = action.payload.id;
        return state.update('entities', (entities) => {
            return entities.map((entity) => {
                return id == entity.get('id') ? entity.merge(action.payload) :
                    entity;
            });
        });
    }
    }

    return state;
}
