/* global __DEV__ */

import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import reducer from '../reducers/app-reducer';

export default function (diContainer) {
    const initialState = {};
    let middlewares = [
        thunk.withExtraArgument(diContainer)
    ];

    if (__DEV__) {
        middlewares.push(createLogger());
    }

    return createStore(reducer, initialState, applyMiddleware(...middlewares));
}
