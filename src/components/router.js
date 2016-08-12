import React, {PropTypes} from 'react';
import {StyleSheet} from 'react-native';
import {Router as ReactRouter, Scene} from 'react-native-router-flux';
import i18n from 'react-native-i18n';
import {connect} from 'react-redux';
import Login from './login';
import Timesheet from './timesheet';
import Launcher from './launcher';
import DayTimesheet from './day-timesheet';
import TimeEntryEditor from './time-entry-editor';
import {logout} from '../actions/auth-actions';
import {colors} from '../styles/common-styles';

const ReactRouterWithRedux = connect()(ReactRouter);

const Router = React.createClass({
    propTypes: {
        onLogout: PropTypes.func.isRequired
    },

    render() {
        return (
            <ReactRouterWithRedux
                titleStyle={[styles.txt, styles.title]}
                navigationBarStyle={styles.navBar}
                getSceneStyle={() => styles.scene}
            >
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
                        rightButtonTextStyle={[styles.txt, styles.logoutBtn]}
                        rightTitle='Sign out'
                        onRight={this.props.onLogout}
                    />
                    <Scene key='dayTimesheet' component={DayTimesheet}/>
                    <Scene
                        key='editTimeEntry'
                        component={TimeEntryEditor}
                        title={i18n.t('timeEntryEditor.title')}
                    />
                </Scene>
            </ReactRouterWithRedux>
        );
    }
});

const styles = StyleSheet.create({
    navBar: {
        backgroundColor: colors.primary0,
        borderBottomColor: colors.primary3
    },
    scene: {
        paddingTop: 64,
        paddingHorizontal: 8
    },
    logoutBtn: {
        fontSize: 18,
        top: -3
    },
    txt: {
        color: '#FFF'
    },
    title: {
        fontWeight: 'bold'
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
