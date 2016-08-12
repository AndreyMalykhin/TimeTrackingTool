import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {reduxForm, propTypes as formPropTypes} from 'redux-form';
import i18n from 'react-native-i18n';
import {login} from '../actions/auth-actions';
import {LOGIN} from '../utils/form-type';
import Button from './button';

const Login = React.createClass({
    propTypes: {...formPropTypes},

    render() {
        const {error, fields, submitting, handleSubmit} = this.props;
        const {name, password} = fields;
        const isDisabled = submitting || !name.value || !password.value;
        return (
            <View>
                {error && <Text>{error}</Text>}
                <TextInput
                    value={name.value}
                    onChangeText={name.onChange}
                    keyboardType='email-address'
                    placeholder={i18n.t('login.name')}
                />
                <TextInput
                    value={password.value}
                    onChangeText={password.onChange}
                    secureTextEntry
                    placeholder={i18n.t('login.password')}
                />
                <Button
                    style={styles.submitBtn}
                    isDisabled={isDisabled}
                    isLoading={submitting}
                    onPress={handleSubmit(this._submit)}
                >
                    {i18n.t('login.submit')}
                </Button>
            </View>
        );
    },

    _submit({name, password}, dispatch) {
        dispatch(login(name, password));
    }
});

const styles = StyleSheet.create({
    submitBtn: {
        marginTop: 8
    }
});

export default reduxForm({
    form: LOGIN,
    fields: ['name', 'password']
})(Login);
