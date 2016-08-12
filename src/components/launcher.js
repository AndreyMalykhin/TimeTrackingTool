import React, {PropTypes} from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import TimerMixin from 'react-timer-mixin';
import {connect} from 'react-redux';
import {ensureLoggedIn} from '../actions/auth-actions';
import {colors} from '../styles/common-styles';

const Launcher = React.createClass({
    propTypes: {
        onLaunch: PropTypes.func.isRequired
    },

    mixins: [TimerMixin],

    render() {
        return (
            <ActivityIndicator
                color={colors.primary0}
                style={styles.loader}
                size='large'
            />
        );
    },

    componentDidMount() {
        this.setTimeout(this.props.onLaunch, 1000);
    }
});

const styles = StyleSheet.create({
    loader: {
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
