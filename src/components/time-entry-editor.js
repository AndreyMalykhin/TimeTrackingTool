import React, {PropTypes} from 'react';
import {View, TextInput, Slider, Text, StyleSheet} from 'react-native';
import {reduxForm, propTypes as formPropTypes} from 'redux-form';
import i18n from 'react-native-i18n';
import Immutable from 'immutable';
import Button from './button';
import {TIME_ENTRY} from '../utils/form-type';
import {saveTimeEntry} from '../actions/time-entry-actions';

const TimeEntryEditor = React.createClass({
    propTypes: {
        entry: PropTypes.instanceOf(Immutable.Map).isRequired,
        ...formPropTypes
    },

    render() {
        const {fields, submitting, handleSubmit} = this.props;
        const {description, hours} = fields;
        return (
            <View>
                <TextInput
                    style={styles.control}
                    value={description.value}
                    onChangeText={description.onChange}
                    placeholder={i18n.t('timeEntryEditor.description')}
                />
                <View style={[styles.control, styles.hoursControl]}>
                    <Slider
                        style={styles.hoursInput}
                        value={hours.value}
                        minimumValue={1}
                        maximumValue={24}
                        step={1}
                        onSlidingComplete={hours.onChange}
                    />
                    <Text style={styles.hours}>
                        {i18n.t('timeEntryEditor.hours', {value: hours.value})}
                    </Text>
                </View>
                <Button
                    style={[styles.control, styles.saveBtn]}
                    isLoading={submitting}
                    isDisabled={submitting || !description.value}
                    onPress={handleSubmit(this._save)}
                >
                    {i18n.t('timeEntryEditor.save')}
                </Button>
            </View>
        );
    },

    _save({description, hours}, dispatch) {
        const {entry} = this.props;
        dispatch(saveTimeEntry({
            id: entry.get('id'),
            date: entry.get('date'),
            description,
            hours
        }));
    }
});

const styles = StyleSheet.create({
    control: {
        marginVertical: 8
    },
    hoursControl: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    hoursInput: {
        flex: 1,
        paddingVertical: 16
    },
    hours: {
        width: 64,
        textAlign: 'center'
    }
});

function mapStateToProps(state, ownProps) {
    const {entry} = ownProps;
    return {
        initialValues: {
            description: entry.get('description'),
            hours: entry.get('hours')
        }
    };
}

export default reduxForm({
    form: TIME_ENTRY,
    fields: ['description', 'hours']
}, mapStateToProps)(TimeEntryEditor);
