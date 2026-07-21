import React from 'react';
import clsx from 'clsx';
import type { YearGridProps } from './types';
import { generateYearRange } from './utils';

const YearGrid: React.FC<YearGridProps> = ({
  value,
  onSelect,
  minDate,
  maxDate,
}) => {
  const years = generateYearRange(
    minDate?.getFullYear(),
    maxDate?.getFullYear()
  );
  const currentYear = value?.getFullYear();

  const isYearDisabled = (year: number): boolean => {
    if (minDate && year < minDate.getFullYear()) return true;
    if (maxDate && year > maxDate.getFullYear()) return true;
    return false;
  };

  const isYearSelected = (year: number): boolean => {
    return currentYear === year;
  };

  return (
    <div className="calendar-year-grid">
      {years.map((year) => (
        <button
          key={year}
          type="button"
          className={clsx('calendar-year-cell', {
            selected: isYearSelected(year),
            disabled: isYearDisabled(year),
          })}
          onClick={() => onSelect(year)}
          disabled={isYearDisabled(year)}
        >
          {year}
        </button>
      ))}
    </div>
  );
};

export default YearGrid;
