import React, {PropTypes} from 'react';
import {Text, ScrollView, View, StyleSheet, TouchableOpacity} from
    'react-native';
import {connect} from 'react-redux';
import i18n from 'react-native-i18n';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Immutable from 'immutable';
import {isSameDay} from '../utils/date-utils';
import {colors} from '../styles/common-styles';

const DayTimesheet = React.createClass({
    propTypes: {
        onEditEntry: PropTypes.func.isRequired,
        onAddEntry: PropTypes.func.isRequired,
        date: PropTypes.instanceOf(Date).isRequired,
        entries: PropTypes.instanceOf(Immutable.List).isRequired,
        userId: PropTypes.number.isRequired
    },

    render() {
        const {entries, onEditEntry} = this.props;
        const entryCount = entries.size;
        let list;

        if (entryCount) {
            const entryViews = [];

            entries.forEach((entry, i) => {
                const style =
                    [styles.row, i == entryCount - 1 && styles.lastRow];
                entryViews.push(
                    <TouchableOpacity
                        onPress={onEditEntry.bind(this, entry)}
                        style={style}
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

            list = (
                <View style={styles.list}>
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
        } else {
            list = (
                <Text style={styles.emptyMsg}>
                    {i18n.t('dayTimesheet.empty')}
                </Text>
            );
        }

        return (
            <View style={styles.wrapper}>
                {list}
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={this._onAddEntry}
                >
                    <Icon
                        name='add-circle'
                        size={64}
                        color={colors.secondary11}
                    />
                </TouchableOpacity>
            </View>
        );
    },

    _onAddEntry() {
        const {userId, onAddEntry} = this.props;
        onAddEntry(userId);
    }
});

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center'
    },
    list: {
        flex: 1
    },
    body: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        backgroundColor: colors.complement0
    },
    headerColumn: {
        paddingVertical: 8,
        fontWeight: 'bold',
        textAlign: 'left',
        color: '#FFF'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: colors.complement1
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
    },
    addBtn: {
        position: 'absolute',
        bottom: 8,
        right: 0,
        borderWidth: 0
    },
    emptyMsg: {
        textAlign: 'center'
    }
});

function mapStateToProps(state, ownProps) {
    const {timeEntries, users, auth} = state;
    return {
        userId: users.get('entities').get(auth.get('userId')).get('id'),
        entries: timeEntries.get('entities').filter(
            (entry) => isSameDay(ownProps.date, new Date(entry.get('date'))))
    };
}

function mapDispatchToProps(dispatch, {date}) {
    return {
        onEditEntry(entry) {
            Actions.editTimeEntry({entry});
        },
        onAddEntry(userId) {
            Actions.editTimeEntry({
                entry: Immutable.fromJS({
                    user: userId,
                    date: date.toISOString(),
                    isNew: true
                })
            });
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DayTimesheet);
