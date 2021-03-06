import React, {PropTypes} from 'react';
import uuid from 'uuid';
import {
  View,
  Text,
} from 'react-native';
import Day from './Day';
import EmptyDay from './EmptyDay';
import {Utils} from './Utils';

export default function DaysGridView(props) {
  const {
    month,
    year,
    styles,
    onPressDay,
    startFromMonday,
    selectedStartDate,
    selectedEndDate,
    allowRangeSelection,
    textStyle,
    minDate,
    maxDate,
    toDateTextStyle,
    dayOfPreviousMonthStyle,

    showDayOfPreviousMonth,
    onPressDayOfPreviousMonth,
    onPressDayOfNextMonth,
    eventDates
  } = props;
  const today = new Date();
  // let's get the total of days in this month, we need the year as well, since
  // leap years have different amount of days in February
  const totalDays = Utils.getDaysInMonth(month, year);
  // Let's create a date for day one of the current given month and year
  const firstDayOfMonth = startFromMonday ? new Date(year, month, 0) : new Date(year, month, 1);
  // The getDay() method returns the day of the week (from 0 to 6) for the specified date.
  // Note: Sunday is 0, Monday is 1, and so on. We will need this to know what
  // day of the week to show day 1
  const firstWeekDay = firstDayOfMonth.getDay();
  // fill up an array of days with the amount of days in the current month
  const days = Array.apply(null, {length: totalDays}).map(Number.call, Number);
  const guideArray = [0, 1, 2, 3, 4, 5, 6];

  let firstWeekDayOfNextMonth = startFromMonday ? new Date(year, month + 1, 0).getDay() : new Date(year, month + 1, 1).getDay();
  let startDay = 0;

  function checkEventDate(day, month, year) {
    return eventDates && eventDates.length && eventDates.filter((obj, idx) => {
        let eventDay = obj.getDate();
        let eventMonth = obj.getMonth();
        let eventYear = obj.getFullYear();

        return day === eventDay && month === eventMonth && year === eventYear;
      }).length > 0;
  }

  function generateColumns(i) {
    const column = guideArray.map(index => {
      if (i === 0) { // for first row, let's start showing the days on the correct weekday
        let calendarStart = new Date(year, month, 1);

        calendarStart.setDate(calendarStart.getDate() - firstWeekDay);

        let firstEmptyDate = calendarStart.getDate();

        if (index >= firstWeekDay) {
          if (days.length > 0) {
            const day = days.shift() + 1;

            // Check event day
            let isEvent = checkEventDate(day, month, year);
            return (
              <Day
                key={day}
                day={day}
                month={month}
                year={year}
                styles={styles}
                onPressDay={onPressDay}
                selectedStartDate={selectedStartDate}
                selectedEndDate={selectedEndDate}
                allowRangeSelection={allowRangeSelection}
                minDate={minDate}
                maxDate={maxDate}
                textStyle={textStyle}
                toDateTextStyle={toDateTextStyle}
                isEventDay={isEvent}
              />
            );
          }
        } else {
          return (
            <EmptyDay
              dayOfPreviousMonthStyle={dayOfPreviousMonthStyle}
              showDayOfPreviousMonth={showDayOfPreviousMonth}
              key={uuid()}
              styles={styles}
              day={firstEmptyDate + index}
              onPressDay={onPressDayOfPreviousMonth}
            />
          );
        }
      } else {
        if (days.length > 0) {
          const day = days.shift() + 1;

          // Check event day
          let isEvent = checkEventDate(day, month, year);

          return (
            <Day
              key={day}
              day={day}
              month={month}
              year={year}
              styles={styles}
              onPressDay={onPressDay}
              selectedStartDate={selectedStartDate}
              selectedEndDate={selectedEndDate}
              allowRangeSelection={allowRangeSelection}
              minDate={minDate}
              maxDate={maxDate}
              textStyle={textStyle}
              toDateTextStyle={toDateTextStyle}
              isEventDay={isEvent}
            />
          );
        } else {
          if (firstWeekDayOfNextMonth > 0 && firstWeekDayOfNextMonth < guideArray.length) {
            firstWeekDayOfNextMonth = firstWeekDayOfNextMonth + 1;
            startDay = startDay + 1;
            return (
              <EmptyDay
                dayOfPreviousMonthStyle={dayOfPreviousMonthStyle}
                showDayOfPreviousMonth={showDayOfPreviousMonth}
                key={uuid()}
                styles={styles}
                day={startDay}
                onPressDay={onPressDayOfNextMonth}
              />
            );
          }
        }
      }
    });
    return column;
  }

  return (
    <View style={styles.daysWrapper}>
      { guideArray.map(index => (
        <View key={index} style={styles.weekRow}>
          { generateColumns(index) }
        </View>
      ))
      }
    </View>
  );
}

DaysGridView.propTypes = {
  styles: PropTypes.shape(),
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  onPressDay: PropTypes.func,
  startFromMonday: PropTypes.bool,
}
