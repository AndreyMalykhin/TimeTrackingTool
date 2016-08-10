/* global __DEV__ */

import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import Immutable from 'immutable';
import reducer from '../reducers/app-reducer';

export default function (diContainer) {
    const initialState = {};
    let middlewares = [
        thunk.withExtraArgument(diContainer)
    ];

    if (__DEV__) {
        middlewares.push(createLogger({
            stateTransformer: (state) => {
                let newState = {};

                for (let i of Object.keys(state)) {
                    if (Immutable.Iterable.isIterable(state[i])) {
                        newState[i] = state[i].toJS();
                    } else {
                        newState[i] = state[i];
                    }
                }

                return newState;
            }
        }));
    }

    return createStore(reducer, initialState, applyMiddleware(...middlewares));
}
