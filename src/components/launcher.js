import React, {PropTypes} from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import TimerMixin from 'react-timer-mixin';
import {connect} from 'react-redux';
import {ensureLoggedIn} from '../actions/auth-actions';

const Launcher = React.createClass({
    propTypes: {
        onLaunch: PropTypes.func.isRequired
    },

    mixins: [TimerMixin],

    render() {
        return <ActivityIndicator style={styles.wrapper} size='large'/>;
    },

    componentDidMount() {
        this.setTimeout(this.props.onLaunch, 1000);
    }
});

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    }
});

function mapDispatchToProps(dispatch) {
    return {
        onLaunch() {
            dispatch(ensureLoggedIn());
        }
    };
}

export default connect(null, mapDispatchToProps)(Launcher);
