/**
 * Demo Page for Date Calendar Component
 *
 * This page demonstrates all features of the custom Date Calendar component.
 * Use this as a reference for implementation in your application.
 */

import { useState } from 'react';
import DateCalendar from './index';
import DateCalendarInput from './date-calendar-input';
import type { DateRange } from './types';

const DateCalendarDemo = () => {
  const [singleDate, setSingleDate] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: null,
    to: null,
  });
  const [inputDate, setInputDate] = useState<Date | null>(null);
  const [inputRange, setInputRange] = useState<DateRange>({
    from: null,
    to: null,
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Date Calendar Component Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            A beautiful, fully-featured date calendar with single date and range
            selection
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Single Date Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Single Date Selection
            </h2>
            <DateCalendar
              mode="single"
              value={singleDate}
              onChange={(date) => setSingleDate(date as Date | null)}
            />
            {singleDate && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                  Selected Date:
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {singleDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Date Range Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Date Range Selection
            </h2>
            <DateCalendar
              mode="range"
              rangeValue={dateRange}
              onRangeChange={(range) => setDateRange(range)}
            />
            {(dateRange.from || dateRange.to) && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                {dateRange.from && (
                  <div className="mb-2">
                    <p className="text-sm font-medium text-green-900 dark:text-green-200">
                      From:
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {dateRange.from.toLocaleDateString()}
                    </p>
                  </div>
                )}
                {dateRange.to && (
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-200">
                      To:
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {dateRange.to.toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* With Min/Max Dates */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Current Month Only
            </h2>
            <DateCalendar
              mode="single"
              value={singleDate}
              onChange={(date) => setSingleDate(date as Date | null)}
              minDate={
                new Date(new Date().getFullYear(), new Date().getMonth(), 1)
              }
              maxDate={
                new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
              }
            />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Only current month dates are selectable
            </p>
          </div>

          {/* Arabic Locale */}
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            dir="rtl"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              التقويم العربي
            </h2>
            <DateCalendar
              mode="single"
              value={singleDate}
              onChange={(date) => setSingleDate(date as Date | null)}
              locale="ar"
            />
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              دعم كامل للغة العربية مع RTL
            </p>
          </div>

          {/* Input with Single Date */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Date Input Field
            </h2>
            <DateCalendarInput
              mode="single"
              label="Select Date"
              placeholder="Choose a date"
              value={inputDate}
              onChange={(date) => setInputDate(date as Date | null)}
            />
            {inputDate && (
              <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm font-medium text-purple-900 dark:text-purple-200">
                  Selected:
                </p>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  {inputDate.toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Input with Range */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Range Input Field
            </h2>
            <DateCalendarInput
              mode="range"
              label="Select Date Range"
              placeholder="Choose dates"
              rangeValue={inputRange}
              onRangeChange={(range) => setInputRange(range)}
            />
            {(inputRange.from || inputRange.to) && (
              <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                {inputRange.from && (
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    From: {inputRange.from.toLocaleDateString()}
                  </p>
                )}
                {inputRange.to && (
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    To: {inputRange.to.toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Features List */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              '✅ Single date selection',
              '✅ Date range selection',
              '✅ Multiple views (Day, Month, Year)',
              '✅ Min/Max date constraints',
              '✅ Disabled dates support',
              '✅ Full internationalization (EN/AR)',
              '✅ RTL support for Arabic',
              '✅ Dark mode support',
              '✅ Beautiful gradient UI',
              '✅ Smooth animations',
              '✅ Keyboard navigation',
              '✅ React Hook Form integration',
              '✅ Customizable styling',
              '✅ TypeScript support',
              '✅ Accessible (ARIA labels)',
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Code Example */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Usage Example
          </h2>
          <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto text-sm">
            {`import DateCalendar from '@/components/ui/date-calendar';
import { useState } from 'react';

function MyComponent() {
  const [date, setDate] = useState<Date | null>(null);
  
  return (
    <DateCalendar
      mode="single"
      value={date}
      onChange={(date) => setDate(date)}
    />
  );
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DateCalendarDemo;
