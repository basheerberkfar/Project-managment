import React, { useState } from 'react';
import DateCalendar from './index';
import type { DateRange } from './types';

/**
 * Example 1: Single Date Selection
 */
export const SingleDateExample = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Single Date Selection</h3>
      <DateCalendar
        mode="single"
        value={selectedDate}
        onChange={(date) => setSelectedDate(date as Date | null)}
      />
      {selectedDate && (
        <p className="text-sm text-gray-600">
          Selected: {selectedDate.toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

/**
 * Example 2: Date Range Selection
 */
export const DateRangeExample = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: null,
    to: null,
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Date Range Selection</h3>
      <DateCalendar
        mode="range"
        rangeValue={dateRange}
        onRangeChange={(range) => setDateRange(range)}
      />
      {dateRange.from && dateRange.to && (
        <div className="text-sm text-gray-600">
          <p>From: {dateRange.from.toLocaleDateString()}</p>
          <p>To: {dateRange.to.toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
};

/**
 * Example 3: With Min/Max Dates
 */
export const MinMaxDateExample = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const today = new Date();
  const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Current Month Only</h3>
      <DateCalendar
        mode="single"
        value={selectedDate}
        onChange={(date) => setSelectedDate(date as Date | null)}
        minDate={minDate}
        maxDate={maxDate}
      />
      <p className="text-sm text-gray-600">
        You can only select dates in the current month
      </p>
    </div>
  );
};

/**
 * Example 4: With Disabled Dates
 */
export const DisabledDatesExample = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Disable weekends
  const disabledDates = React.useMemo(() => {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = -30; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (date.getDay() === 0 || date.getDay() === 6) {
        dates.push(date);
      }
    }
    return dates;
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Weekdays Only</h3>
      <DateCalendar
        mode="single"
        value={selectedDate}
        onChange={(date) => setSelectedDate(date as Date | null)}
        disabledDates={disabledDates}
      />
      <p className="text-sm text-gray-600">Weekends are disabled</p>
    </div>
  );
};

/**
 * Example 5: Month and Year Views Only
 */
export const MonthYearViewExample = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Month & Year Views</h3>
      <DateCalendar
        mode="single"
        value={selectedDate}
        onChange={(date) => setSelectedDate(date as Date | null)}
        views={['month', 'year']}
        defaultView="month"
      />
      <p className="text-sm text-gray-600">
        Only month and year selection available
      </p>
    </div>
  );
};

/**
 * Example 6: Read-Only Calendar
 */
export const ReadOnlyExample = () => {
  const selectedDate = new Date();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Read-Only Calendar</h3>
      <DateCalendar mode="single" value={selectedDate} readOnly />
      <p className="text-sm text-gray-600">This calendar is read-only</p>
    </div>
  );
};

/**
 * Example 7: Disabled Calendar
 */
export const DisabledExample = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Disabled Calendar</h3>
      <DateCalendar
        mode="single"
        value={selectedDate}
        onChange={(date) => setSelectedDate(date as Date | null)}
        disabled
      />
      <p className="text-sm text-gray-600">This calendar is disabled</p>
    </div>
  );
};

/**
 * Example 8: Arabic Locale
 */
export const ArabicLocaleExample = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="space-y-4" dir="rtl">
      <h3 className="text-lg font-semibold">التقويم العربي</h3>
      <DateCalendar
        mode="single"
        value={selectedDate}
        onChange={(date) => setSelectedDate(date as Date | null)}
        locale="ar"
      />
      {selectedDate && (
        <p className="text-sm text-gray-600">
          التاريخ المختار: {selectedDate.toLocaleDateString('ar')}
        </p>
      )}
    </div>
  );
};

/**
 * Example 9: Date Range with Min Days
 */
export const MinDaysRangeExample = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: null,
    to: null,
  });

  const handleRangeChange = (range: DateRange) => {
    // Ensure minimum 3 days selection
    if (range.from && range.to) {
      const diffTime = Math.abs(range.to.getTime() - range.from.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 3) {
        alert('Please select at least 3 days');
        return;
      }
    }
    setDateRange(range);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Range Selection (Minimum 3 Days)
      </h3>
      <DateCalendar
        mode="range"
        rangeValue={dateRange}
        onRangeChange={handleRangeChange}
      />
      {dateRange.from && dateRange.to && (
        <div className="text-sm text-gray-600">
          <p>From: {dateRange.from.toLocaleDateString()}</p>
          <p>To: {dateRange.to.toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
};

/**
 * Example 10: All Examples Combined
 */
export const AllExamples = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
      <SingleDateExample />
      <DateRangeExample />
      <MinMaxDateExample />
      <DisabledDatesExample />
      <MonthYearViewExample />
      <ReadOnlyExample />
      <DisabledExample />
      <ArabicLocaleExample />
      <MinDaysRangeExample />
    </div>
  );
};

export default AllExamples;
