import React from 'react';
import clsx from 'clsx';
import type { MonthGridProps } from './types';
import { getMonthsShort } from './utils';

const MonthGrid: React.FC<MonthGridProps> = ({
  displayYear,
  value,
  onSelect,
  locale = 'en',
  minDate,
  maxDate,
}) => {
  const months = getMonthsShort(locale);
  const currentMonth = value?.getMonth();
  const currentYear = value?.getFullYear();

  const isMonthDisabled = (monthIndex: number): boolean => {
    if (minDate && displayYear === minDate.getFullYear()) {
      if (monthIndex < minDate.getMonth()) return true;
    }
    if (maxDate && displayYear === maxDate.getFullYear()) {
      if (monthIndex > maxDate.getMonth()) return true;
    }
    if (minDate && displayYear < minDate.getFullYear()) return true;
    if (maxDate && displayYear > maxDate.getFullYear()) return true;
    return false;
  };

  const isMonthSelected = (monthIndex: number): boolean => {
    return currentYear === displayYear && currentMonth === monthIndex;
  };

  return (
    <div className="calendar-month-grid">
      {months.map((month, index) => (
        <button
          key={index}
          type="button"
          className={clsx('calendar-month-cell', {
            selected: isMonthSelected(index),
            disabled: isMonthDisabled(index),
          })}
          onClick={() => onSelect(index)}
          disabled={isMonthDisabled(index)}
        >
          {month}
        </button>
      ))}
    </div>
  );
};

export default MonthGrid;
