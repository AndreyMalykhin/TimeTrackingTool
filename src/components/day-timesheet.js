import React, {PropTypes} from 'react';
import {Text, ScrollView, View, StyleSheet, TouchableOpacity} from
    'react-native';
import {connect} from 'react-redux';
import i18n from 'react-native-i18n';
import {Actions} from 'react-native-router-flux';
import Immutable from 'immutable';
import {isSameDay} from '../utils/date-utils';

const DayTimesheet = React.createClass({
    propTypes: {
        date: PropTypes.instanceOf(Date).isRequired,
        entries: PropTypes.instanceOf(Immutable.List).isRequired
    },

    render() {
        const {entries} = this.props;
        const entryCount = entries.size;

        if (!entryCount) {
            return <Text>{i18n.t('dayTimesheet.empty')}</Text>;
        }

        const entryViews = [];

        entries.forEach((entry, i) => {
            entryViews.push(
                <TouchableOpacity
                    onPress={this._onEditEntry.bind(this, entry)}
                    style={[styles.row, i == entryCount - 1 && styles.lastRow]}
                    key={entry.get('id')}
                >
                    <Text style={styles.descriptionColumn}>
                        {entry.get('description')}
                    </Text>
                    <Text style={styles.hoursColumn}>
                        {entry.get('hours')}
                    </Text>
                </TouchableOpacity>
            );
        });

        return (
            <View style={styles.wrapper}>
                <View style={styles.header}>
                    <Text
                        style={[styles.descriptionColumn, styles.headerColumn]}
                    >
                        {i18n.t('dayTimesheet.description')}
                    </Text>
                    <Text style={[styles.hoursColumn, styles.headerColumn]}>
                        {i18n.t('dayTimesheet.hours')}
                    </Text>
                </View>
                <ScrollView style={styles.body}>{entryViews}</ScrollView>
            </View>
        );
    },

    _onEditEntry(entry) {
        Actions.editTimeEntry({entry});
    }
});

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    body: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#CCC'
    },
    headerColumn: {
        paddingVertical: 8,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#CCC'
    },
    lastRow: {
        borderBottomWidth: 0
    },
    descriptionColumn: {
        flex: 1,
        padding: 16
    },
    hoursColumn: {
        width: 80,
        padding: 16,
        textAlign: 'left'
    }
});

function mapStateToProps(state, ownProps) {
    const {timeEntries} = state;
    return {
        entries: timeEntries.get('entities').filter(
            (entry) => isSameDay(ownProps.date, new Date(entry.get('date'))))
    };
}

export default connect(mapStateToProps)(DayTimesheet);
