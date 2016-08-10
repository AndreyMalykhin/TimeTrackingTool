export default class UserService {
    constructor(fetcher) {
        this._fetcher = fetcher;
    }

    get(id) {
        return this._fetcher.fetch(
            `1/objects/users/${id}?deep=&exclude=metadata&level=3`);
    }
}
