import React from 'react';
import {StyleSheet} from 'react-native';
import ReactButton from 'apsl-react-native-button';

const Button = React.createClass({
    propTypes: {...ReactButton.propTypes},

    render() {
        const {style, children, ...restProps} = this.props;
        return (
            <ReactButton {...restProps} style={[styles.wrapper, style]}>
                {children}
            </ReactButton>
        );
    }
});

const styles = StyleSheet.create({
    wrapper: {}
});

export default Button;
