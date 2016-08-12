import React from 'react';
import {StyleSheet} from 'react-native';
import ReactButton from 'apsl-react-native-button';
import {colors} from '../styles/common-styles';

const Button = React.createClass({
    propTypes: {...ReactButton.propTypes},

    render() {
        const {style, textStyle, children, ...restProps} = this.props;
        return (
            <ReactButton
                activityIndicatorColor={colors.secondary14}
                {...restProps}
                style={[styles.wrapper, style]}
                textStyle={[styles.text, textStyle]}
            >
                {children}
            </ReactButton>
        );
    }
});

const styles = StyleSheet.create({
    wrapper: {
        borderColor: colors.secondary10,
        backgroundColor: colors.secondary11
    },
    text: {
        color: '#FFF'
    }
});

export default Button;
