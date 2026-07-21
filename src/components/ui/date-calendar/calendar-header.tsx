import React, { useEffect, useRef, useState } from 'react';
import { CaretDown, CaretLeft, CaretRight } from '@phosphor-icons/react';
import clsx from 'clsx';
import type { CalendarHeaderProps } from './types';
import { generateYearRange, getMonths } from './utils';

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  displayMonth,
  view,
  onViewChange,
  onMonthChange,
  onPrevious,
  onNext,
  locale = 'en',
  minDate,
  maxDate,
}) => {
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const activeMonthRef = useRef<HTMLButtonElement>(null);
  const activeYearRef = useRef<HTMLButtonElement>(null);

  const currentMonth = displayMonth.getMonth();
  const currentYear = displayMonth.getFullYear();
  const months = getMonths(locale);
  const years = generateYearRange(
    minDate?.getFullYear(),
    maxDate?.getFullYear()
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        monthRef.current &&
        !monthRef.current.contains(event.target as Node)
      ) {
        setIsMonthOpen(false);
      }

      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setIsYearOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMonthOpen && activeMonthRef.current) {
      activeMonthRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [isMonthOpen]);

  useEffect(() => {
    if (isYearOpen && activeYearRef.current) {
      activeYearRef.current.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
    }
  }, [isYearOpen]);

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(displayMonth);
    newDate.setMonth(monthIndex);
    onMonthChange(newDate);
    setIsMonthOpen(false);
    onViewChange('day');
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(displayMonth);
    newDate.setFullYear(year);
    onMonthChange(newDate);
    setIsYearOpen(false);
    onViewChange('day');
  };

  const getHeaderText = () => {
    if (view === 'year') {
      const startYear = Math.floor(currentYear / 12) * 12;
      const endYear = startYear + 11;
      return `${startYear} - ${endYear}`;
    }

    if (view === 'month') {
      return currentYear.toString();
    }

    return `${months[currentMonth]} ${currentYear}`;
  };

  const canGoPrevious = () => {
    if (!minDate) return true;

    if (view === 'year') {
      const startYear = Math.floor(currentYear / 12) * 12;
      return startYear > minDate.getFullYear();
    }

    if (view === 'month') {
      return currentYear > minDate.getFullYear();
    }

    return (
      currentYear > minDate.getFullYear() ||
      (currentYear === minDate.getFullYear() &&
        currentMonth > minDate.getMonth())
    );
  };

  const canGoNext = () => {
    if (!maxDate) return true;

    if (view === 'year') {
      const endYear = Math.floor(currentYear / 12) * 12 + 11;
      return endYear < maxDate.getFullYear();
    }

    if (view === 'month') {
      return currentYear < maxDate.getFullYear();
    }

    return (
      currentYear < maxDate.getFullYear() ||
      (currentYear === maxDate.getFullYear() &&
        currentMonth < maxDate.getMonth())
    );
  };

  const previousIcon =
    locale === 'ar' ? (
      <CaretRight size={18} weight="bold" />
    ) : (
      <CaretLeft size={18} weight="bold" />
    );

  const nextIcon =
    locale === 'ar' ? (
      <CaretLeft size={18} weight="bold" />
    ) : (
      <CaretRight size={18} weight="bold" />
    );

  const monthSelector = (
    <div className="calendar-selector-container" ref={monthRef}>
      <button
        type="button"
        className="calendar-selector-trigger"
        onClick={() => setIsMonthOpen((value) => !value)}
      >
        <span>{months[currentMonth]}</span>
        <CaretDown
          size={16}
          weight="bold"
          className={clsx('calendar-selector-icon', {
            open: isMonthOpen,
          })}
        />
      </button>
      {isMonthOpen && (
        <div className="calendar-selector-dropdown">
          <div className="calendar-selector-dropdown-header">
            {locale === 'ar' ? 'اختر الشهر' : 'Select Month'}
          </div>
          <div className="calendar-selector-dropdown-content">
            {months.map((month, index) => (
              <button
                key={month}
                type="button"
                ref={index === currentMonth ? activeMonthRef : null}
                className={clsx('calendar-selector-option', {
                  active: index === currentMonth,
                })}
                onClick={() => handleMonthSelect(index)}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const yearSelector = (
    <div className="calendar-selector-container" ref={yearRef}>
      <button
        type="button"
        className="calendar-selector-trigger"
        onClick={() => setIsYearOpen((value) => !value)}
      >
        <span>{currentYear}</span>
        <CaretDown
          size={16}
          weight="bold"
          className={clsx('calendar-selector-icon', {
            open: isYearOpen,
          })}
        />
      </button>
      {isYearOpen && (
        <div className="calendar-selector-dropdown">
          <div className="calendar-selector-dropdown-header">
            {locale === 'ar' ? 'اختر السنة' : 'Select Year'}
          </div>
          <div className="calendar-selector-dropdown-content">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                ref={year === currentYear ? activeYearRef : null}
                className={clsx('calendar-selector-option', {
                  active: year === currentYear,
                })}
                onClick={() => handleYearSelect(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="calendar-header">
      <button
        type="button"
        className="calendar-nav-button"
        onClick={onPrevious}
        disabled={!canGoPrevious()}
        aria-label={locale === 'ar' ? 'السابق' : 'Previous'}
      >
        {previousIcon}
      </button>

      <div className="calendar-selectors">
        {view === 'day' && (
          <>
            {locale === 'ar' ? (
              <>
                {yearSelector}
                {monthSelector}
              </>
            ) : (
              <>
                {monthSelector}
                {yearSelector}
              </>
            )}
          </>
        )}

        {view !== 'day' && (
          <button
            type="button"
            className="calendar-view-title"
            onClick={() => onViewChange('day')}
          >
            {getHeaderText()}
          </button>
        )}
      </div>

      <button
        type="button"
        className="calendar-nav-button"
        onClick={onNext}
        disabled={!canGoNext()}
        aria-label={locale === 'ar' ? 'التالي' : 'Next'}
      >
        {nextIcon}
      </button>
    </div>
  );
};

export default CalendarHeader;
