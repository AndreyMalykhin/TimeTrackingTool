import React from 'react';
import {Provider} from 'react-redux';
import i18n from 'react-native-i18n';
import Bottle from 'bottlejs';
import diConfigurator from '../configs/di-configurator';
import Router from './router';
import en from '../translations/en';
import ru from '../translations/ru';

// const _XHR = GLOBAL.originalXMLHttpRequest ?
//     GLOBAL.originalXMLHttpRequest :
//     GLOBAL.XMLHttpRequest;
// XMLHttpRequest = _XHR;

const di = new Bottle();
diConfigurator(di);
i18n.fallbacks = true;
i18n.translations = {en, ru};

const App = React.createClass({
    render() {
        return <Provider store={di.container.store}><Router/></Provider>;
    }
});
export default App;
