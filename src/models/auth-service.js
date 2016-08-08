import qs from 'qs';
import {Headers} from '../utils/fetcher';

export default class AuthService {
    constructor(fetcher) {
        this._fetcher = fetcher;
    }

    login(name, password) {
        return this._fetcher.fetch('token', {
            method: 'POST',
            headers: Headers.withUrlencoded(this._fetcher.options.headers),
            body: qs.stringify({
                grant_type: 'password',
                username: name,
                appname: 'digitizeexpenses',
                password
            })
        });
    }
}
