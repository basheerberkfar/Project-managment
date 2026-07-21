/* eslint-disable react-refresh/only-export-components -- file exports component and shared types */
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import CalendarHeader from './calendar-header';
import CalendarGrid from './calendar-grid';
import MonthGrid from './month-grid';
import YearGrid from './year-grid';
import type { CalendarProps, CalendarView, DateRange } from './types';
import { addMonths, addYears } from './utils';
import './calendar.css';

const DateCalendar: React.FC<CalendarProps> = ({
  mode = 'single',
  value,
  rangeValue,
  onChange,
  onRangeChange,
  disabled = false,
  readOnly = false,
  minDate,
  maxDate,
  disabledDates,
  className,
  views = ['day', 'month', 'year'],
  defaultView = 'day',
  locale,
}) => {
  const { i18n } = useTranslation();
  const currentLocale = (locale || i18n.language) as 'en' | 'ar';

  const [displayMonth, setDisplayMonth] = useState<Date>(
    value || rangeValue?.from || new Date()
  );
  const [view, setView] = useState<CalendarView>(defaultView);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [tempRangeStart, setTempRangeStart] = useState<Date | null>(
    rangeValue?.from || null
  );

  // Sync display month from controlled value when it changes (required for controlled usage)
  /* eslint-disable react-hooks/set-state-in-effect -- syncing controlled display month from props */
  useEffect(() => {
    if (value) {
      setDisplayMonth(value);
    } else if (rangeValue?.from) {
      setDisplayMonth(rangeValue.from);
    }
  }, [value, rangeValue]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handlePrevious = () => {
    if (view === 'year') {
      setDisplayMonth(addYears(displayMonth, -12));
    } else if (view === 'month') {
      setDisplayMonth(addYears(displayMonth, -1));
    } else {
      setDisplayMonth(addMonths(displayMonth, -1));
    }
  };

  const handleNext = () => {
    if (view === 'year') {
      setDisplayMonth(addYears(displayMonth, 12));
    } else if (view === 'month') {
      setDisplayMonth(addYears(displayMonth, 1));
    } else {
      setDisplayMonth(addMonths(displayMonth, 1));
    }
  };

  const handleDaySelect = (date: Date) => {
    if (disabled || readOnly) return;

    if (mode === 'single') {
      onChange?.(date);
    } else if (mode === 'range') {
      if (!tempRangeStart) {
        // First date selected
        setTempRangeStart(date);
        onRangeChange?.({ from: date, to: null });
      } else {
        // Second date selected
        const from = tempRangeStart < date ? tempRangeStart : date;
        const to = tempRangeStart < date ? date : tempRangeStart;
        onRangeChange?.({ from, to });
        setTempRangeStart(null);
      }
    }
  };

  const handleMonthSelect = (month: number) => {
    const newDate = new Date(displayMonth);
    newDate.setMonth(month);
    setDisplayMonth(newDate);
    setView('day');
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(displayMonth);
    newDate.setFullYear(year);
    setDisplayMonth(newDate);

    if (views.includes('month')) {
      setView('month');
    } else {
      setView('day');
    }
  };

  const handleViewChange = (newView: CalendarView) => {
    if (views.includes(newView)) {
      setView(newView);
    }
  };

  const effectiveRangeValue: DateRange = {
    from: tempRangeStart || rangeValue?.from || null,
    to: rangeValue?.to || null,
  };

  return (
    <div
      className={clsx('date-calendar', className, {
        'date-calendar-disabled': disabled,
        'date-calendar-readonly': readOnly,
        'date-calendar-rtl': currentLocale === 'ar',
      })}
    >
      <CalendarHeader
        displayMonth={displayMonth}
        view={view}
        onViewChange={handleViewChange}
        onMonthChange={setDisplayMonth}
        onPrevious={handlePrevious}
        onNext={handleNext}
        locale={currentLocale}
        minDate={minDate}
        maxDate={maxDate}
      />

      {view === 'day' && (
        <CalendarGrid
          displayMonth={displayMonth}
          mode={mode}
          value={value}
          rangeValue={effectiveRangeValue}
          onSelect={handleDaySelect}
          disabled={disabled || readOnly}
          minDate={minDate}
          maxDate={maxDate}
          disabledDates={disabledDates}
          locale={currentLocale}
          hoveredDate={hoveredDate}
          onHoverDate={setHoveredDate}
        />
      )}

      {view === 'month' && (
        <MonthGrid
          displayYear={displayMonth.getFullYear()}
          value={value || rangeValue?.from || undefined}
          onSelect={handleMonthSelect}
          locale={currentLocale}
          minDate={minDate}
          maxDate={maxDate}
        />
      )}

      {view === 'year' && (
        <YearGrid
          value={value || rangeValue?.from || undefined}
          onSelect={handleYearSelect}
          minDate={minDate}
          maxDate={maxDate}
        />
      )}
    </div>
  );
};

// Export main component as default
export default DateCalendar;

// Export all types
export type {
  CalendarProps,
  DateRange,
  DateValue,
  CalendarMode,
  CalendarView,
  CalendarHeaderProps,
  CalendarGridProps,
  MonthGridProps,
  YearGridProps,
} from './types';

// Export utility functions
export {
  formatDate,
  formatDateRange,
  isSameDay,
  isSameMonth,
  isToday,
  isInRange,
  isRangeStart,
  isRangeEnd,
  isDateDisabled,
  getDaysInMonth,
  getFirstDayOfMonth,
  generateCalendarDays,
  addMonths,
  addYears,
  startOfMonth,
  endOfMonth,
  generateYearRange,
  getMonths,
  getMonthsShort,
  getWeekdays,
  getWeekdaysShort,
} from './utils';

// Export sub-components if needed
export { default as CalendarHeader } from './calendar-header';
export { default as CalendarGrid } from './calendar-grid';
export { default as MonthGrid } from './month-grid';
export { default as YearGrid } from './year-grid';
export { default as DateCalendarInput } from './date-calendar-input';
