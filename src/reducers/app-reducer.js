import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import userReducer from './user-reducer';
import authReducer from './auth-reducer';
import timeEntryReducer from './time-entry-reducer';

export default combineReducers({
    auth: authReducer,
    users: userReducer,
    timeEntries: timeEntryReducer,
    form: formReducer
});
