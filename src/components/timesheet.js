import React, {PropTypes} from 'react';
import {View, Text, ListView, ActivityIndicator, StyleSheet, TouchableOpacity}
    from 'react-native';
import i18n from 'react-native-i18n';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {getTimeEntriesByPeriod} from '../actions/time-entry-actions';
import {isSameDay} from '../utils/date-utils';

const Timesheet = React.createClass({
    propTypes: {
        onLoad: PropTypes.func.isRequired,
        isLoading: PropTypes.bool.isRequired,
        dataSource: PropTypes.instanceOf(ListView.DataSource).isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        userId: PropTypes.number.isRequired
    },

    render() {
        const {dataSource, isLoading} = this.props;

        if (isLoading) {
            return <ActivityIndicator size='large' style={styles.loader}/>;
        }

        const daysOfWeek = [];

        for (let i = 0; i < 7; ++i) {
            daysOfWeek.push(
                <Text key={i} style={[styles.dayColumn, styles.headerColumn]}>
                    {i18n.t(`dayOfWeek.${i}`)}
                </Text>
            );
        }

        return (
            <View style={styles.gridWrapper}>
                <View style={styles.header}>{daysOfWeek}</View>
                <ListView
                    style={styles.grid}
                    dataSource={dataSource}
                    renderRow={this._renderRow}
                    enableEmptySections
                />
            </View>
        );
    },

    componentDidMount() {
        const {onLoad, startDate, endDate, userId} = this.props;
        onLoad(userId, startDate, endDate);
    },

    _renderRow(row) {
        const {days, weekStartDate, weekEndDate} = row;
        const dayViews = days.map((day, i) => {
            const {date, hours} = day;
            const onPress = this._onViewDay.bind(this, date);
            const style = [
                styles.dayColumn,
                this._isCurrentDay(date) && styles.currentDayColumn
            ];
            return (
                <TouchableOpacity style={style} key={i} onPress={onPress}>
                    <Text>{hours}</Text>
                </TouchableOpacity>
            );
        });

        return (
            <View style={styles.row}>
                <Text style={styles.weekRow}>
                    {this._formatDate(weekStartDate)}
                    {' - '}
                    {this._formatDate(weekEndDate)}
                </Text>
                <View style={styles.daysRow}>{dayViews}</View>
            </View>
        );
    },

    _formatDate(date) {
        return `${i18n.t(`month.${date.getMonth()}`)} ${date.getDate()}`;
    },

    _isCurrentDay(date) {
        return isSameDay(new Date(), date);
    },

    _onViewDay(date) {
        const title =
            `${i18n.t(`month.${date.getMonth()}`)} ${date.getDate()}`;
        Actions.dayTimesheet({title, date});
    }
});

const styles = StyleSheet.create({
    loader: {
        flex: 1
    },
    gridWrapper: {
        flex: 1
    },
    grid: {},
    row: {},
    weekRow: {
        paddingVertical: 8,
        backgroundColor: '#CCC',
        textAlign: 'center'
    },
    dayColumn: {
        flex: 1,
        paddingVertical: 16,
        marginHorizontal: 4,
        borderWidth: 1,
        alignItems: 'center',
        borderColor: '#CCC'
    },
    currentDayColumn: {
        backgroundColor: '#FDD'
    },
    daysRow: {
        flexDirection: 'row',
        paddingVertical: 16
    },
    header: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#CCC'
    },
    headerColumn: {
        paddingTop: 0,
        paddingBottom: 8,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});

function mapStateToProps(state) {
    const {timeEntries, users, auth} = state;
    const user = users.get('entities').get(auth.get('userId'));
    let endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    endDate = endDate.toISOString();
    return {
        isLoading: timeEntries.get('isLoading'),
        userId: user.get('id'),
        startDate: user.get('startDate'),
        endDate,
        dataSource: fillDataSource(dataSource, timeEntries.get('entities'))
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onLoad(userId, startDate, endDate) {
            dispatch(getTimeEntriesByPeriod(userId, startDate, endDate));
        }
    };
}

let oldTimeEntries;
const dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 != row2
});

function fillDataSource(dataSource, timeEntries) {
    if (oldTimeEntries && oldTimeEntries.equals(timeEntries)) {
        return dataSource;
    }

    oldTimeEntries = timeEntries;
    let rows;

    if (timeEntries.size) {
        const millisecondsPerWeek = 60 * 60 * 24 * 7 * 1000;
        const firstWeekStartDate =
            getStartDateOfWeek(timeEntries.first().get('date'));
        const lastWeekStartDate = getStartDateOfWeek(Date.now());
        const currentWeekStartDate = new Date(firstWeekStartDate.getTime());
        const weekCount = ((lastWeekStartDate - currentWeekStartDate) /
            millisecondsPerWeek) + 1;
        rows = new Array(weekCount);
        const currentDay = new Date(firstWeekStartDate.getTime());

        for (let week = 0; week < weekCount; ++week) {
            const days = new Array(7);

            for (let dayOfWeek = 0; dayOfWeek < 7; ++dayOfWeek) {
                days[dayOfWeek] = {
                    hours: 0,
                    date: new Date(currentDay.getTime())
                };
                currentDay.setDate(currentDay.getDate() + 1);
            }

            rows[week] = {
                weekStartDate: new Date(currentWeekStartDate.getTime()),
                weekEndDate: new Date(currentWeekStartDate.getTime() +
                    millisecondsPerWeek - 1000),
                days
            };
            currentWeekStartDate.setDate(currentWeekStartDate.getDate() + 7);
        }

        timeEntries.forEach((timeEntry) => {
            const date = new Date(timeEntry.get('date'));
            const week =
                Math.floor((date - firstWeekStartDate) / millisecondsPerWeek);
            rows[week].days[getDayOfWeek(date)].hours += timeEntry.get('hours');
        });
        rows.reverse();
    } else {
        rows = [];
    }

    return dataSource.cloneWithRows(rows);
}

function getStartDateOfWeek(date) {
    date = new Date(date);
    date.setDate(date.getDate() - getDayOfWeek(date));
    date.setHours(0, 0, 0, 0);
    return date;
}

function getDayOfWeek(date) {
    let dayOfWeek = date.getDay();
    return dayOfWeek == 0 ? 6 : --dayOfWeek;
}

export default connect(mapStateToProps, mapDispatchToProps)(Timesheet);
