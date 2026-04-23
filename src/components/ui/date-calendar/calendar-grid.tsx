import React from 'react';
import clsx from 'clsx';
import type { CalendarGridProps } from './types';
import {
  generateCalendarDays,
  getWeekdaysShort,
  isSameDay,
  isToday,
  isInRange,
  isRangeStart,
  isRangeEnd,
  isDateDisabled,
} from './utils';

const CalendarGrid: React.FC<CalendarGridProps> = ({
  displayMonth,
  mode,
  value,
  rangeValue,
  onSelect,
  disabled,
  minDate,
  maxDate,
  disabledDates,
  locale = 'en',
  hoveredDate,
  onHoverDate,
}) => {
  const year = displayMonth.getFullYear();
  const month = displayMonth.getMonth();
  const days = generateCalendarDays(year, month);
  const weekdays = getWeekdaysShort(locale);

  const handleDayClick = (date: Date) => {
    if (disabled) return;
    if (isDateDisabled(date, minDate, maxDate, disabledDates)) return;
    onSelect(date);
  };

  const getDayClassName = (date: Date | null) => {
    if (!date) return 'calendar-day-empty';

    const classes = ['calendar-day'];
    const isDayDisabled = isDateDisabled(date, minDate, maxDate, disabledDates);
    const isDayToday = isToday(date);

    if (mode === 'single') {
      if (isSameDay(date, value as Date | null)) {
        classes.push('selected');
      }
    } else if (mode === 'range') {
      const { from, to } = rangeValue || { from: null, to: null };

      if (isRangeStart(date, from)) {
        classes.push('range-start');
      }
      if (isRangeEnd(date, to)) {
        classes.push('range-end');
      }
      if (from && to && isInRange(date, from, to)) {
        classes.push('in-range');
      }

      // Preview range while hovering
      if (from && !to && hoveredDate) {
        const previewFrom = from < hoveredDate ? from : hoveredDate;
        const previewTo = from < hoveredDate ? hoveredDate : from;
        if (isInRange(date, previewFrom, previewTo)) {
          classes.push('preview-range');
        }
      }
    }

    if (isDayToday) {
      classes.push('today');
    }

    if (isDayDisabled || disabled) {
      classes.push('disabled');
    }

    return clsx(classes);
  };

  return (
    <div className="calendar-grid">
      {/* Weekday Headers */}
      <div className="calendar-weekdays">
        {weekdays.map((weekday, index) => (
          <div key={index} className="calendar-weekday">
            {weekday}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="calendar-days">
        {days.map((date, index) => (
          <div key={index} className="calendar-day-cell">
            {date ? (
              <button
                type="button"
                className={getDayClassName(date)}
                onClick={() => handleDayClick(date)}
                onMouseEnter={() => onHoverDate?.(date)}
                onMouseLeave={() => onHoverDate?.(null)}
                disabled={
                  disabled ||
                  isDateDisabled(date, minDate, maxDate, disabledDates)
                }
              >
                {date.getDate()}
              </button>
            ) : (
              <div className="calendar-day-empty" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
