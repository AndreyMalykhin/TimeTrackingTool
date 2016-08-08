import {AsyncStorage} from 'react-native';
import Env from 'react-native-config';
import storeFactory from '../utils/store-factory';
import AuthService from '../models/auth-service';
import Fetcher from '../utils/fetcher';

export default function (di) {
    di.constant('db', AsyncStorage);
    di.factory('store', storeFactory);
    di.factory('fetcher', () => {
        return new Fetcher(Env.TTT_API_URL);
    });
    di.service('authService', AuthService, 'fetcher');
}
