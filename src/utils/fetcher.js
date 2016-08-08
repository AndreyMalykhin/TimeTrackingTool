import EventEmitter2 from 'eventemitter2';

export default class Fetcher {
    constructor(hostUrl) {
        this._hostUrl = hostUrl;
        this.options = {
            headers: {'Accept': 'application/json'}
        };
        this._eventBus = new EventEmitter2();
    }

    fetch(path, options = {}) {
        return fetch(
            `${this._hostUrl}/${path}`,
            Object.assign({}, this.options, options)
        )
        .then((response) => response.json())
        .then((response) => {
            this._eventBus.emit(Event.RESPONSE, response);
            return response;
        })
        .catch((error) => {
            this._eventBus.emit(Event.ERROR, error);
            throw error;
        });
    }

    on(event, listener) {
        this._eventBus.on(event, listener);
    }
}

export const Event = {
    ERROR: 'error',
    RESPONSE: 'response'
};

export const Headers = {
    withMultipart(headers) {
        return Object.assign(
            {},
            headers,
            {'Content-Type': 'multipart/form-data'}
        );
    },

    withUrlencoded(headers) {
        return Object.assign(
            {},
            headers,
            {'Content-Type': 'application/x-www-form-urlencoded'}
        );
    },

    withJson(headers) {
        return Object.assign(
            {},
            headers,
            {'Content-Type': 'application/json'}
        );
    }
};
