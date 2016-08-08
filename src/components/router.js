import React, {PropTypes} from 'react';
import {Router as ReactRouter, Scene} from 'react-native-router-flux';
import i18n from 'react-native-i18n';
import {connect} from 'react-redux';
import Login from './login';
import Timesheet from './timesheet';
import Launcher from './launcher';
import {logout} from '../actions/auth-actions';

const Router = React.createClass({
    propTypes: {
        onLogout: PropTypes.func.isRequired
    },

    render() {
        return (
            <ReactRouter getSceneStyle={() => {return {paddingTop: 64, paddingHorizontal: 8}}}>
                <Scene key='root'>
                    <Scene
                        key='launcher'
                        component={Launcher}
                        hideNavBar
                        initial
                    />
                    <Scene
                        key='login'
                        component={Login}
                        title={i18n.t('login.title')}
                    />
                    <Scene
                        key='timesheet'
                        component={Timesheet}
                        title={i18n.t('timesheet.title')}
                        rightButtonTextStyle={{color: '#000', fontSize: 18, top: -3}}
                        rightTitle='Sign out'
                        onRight={this.props.onLogout}
                    />
                </Scene>
            </ReactRouter>
        );
    }
});

function mapDispatchToProps(dispatch) {
    return {
        onLogout() {
            dispatch(logout());
        }
    };
}

export default connect(null, mapDispatchToProps)(Router);
