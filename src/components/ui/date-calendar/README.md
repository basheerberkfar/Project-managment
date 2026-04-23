# Date Calendar Component

A custom, fully-featured date calendar component with support for single date selection and date range selection. Built with React, TypeScript, and full RTL support.

## Features

- ✅ **Single Date Selection**: Select individual dates
- ✅ **Date Range Selection**: Select a range of dates (from-to)
- ✅ **Multiple Views**: Day, Month, and Year views
- ✅ **Internationalization**: Full support for English and Arabic
- ✅ **RTL Support**: Automatic right-to-left layout for Arabic
- ✅ **Dark Mode**: Full dark mode support
- ✅ **Customizable**: Min/max dates, disabled dates, and more
- ✅ **Accessible**: Keyboard navigation and ARIA labels
- ✅ **Beautiful Design**: Modern gradient UI with smooth animations

## Installation

The component is already part of your project. No additional installation needed.

## Basic Usage

### Single Date Selection

```tsx
import DateCalendar from '@/components/ui/date-calendar';
import { useState } from 'react';

function MyComponent() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <DateCalendar
      mode="single"
      value={selectedDate}
      onChange={(date) => setSelectedDate(date)}
    />
  );
}
```

### Date Range Selection

```tsx
import DateCalendar, { DateRange } from '@/components/ui/date-calendar';
import { useState } from 'react';

function MyComponent() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: null,
    to: null,
  });

  return (
    <DateCalendar
      mode="range"
      rangeValue={dateRange}
      onRangeChange={(range) => setDateRange(range)}
    />
  );
}
```

## Props

### CalendarProps

| Prop            | Type                           | Default                    | Description                              |
| --------------- | ------------------------------ | -------------------------- | ---------------------------------------- |
| `mode`          | `'single' \| 'range'`          | `'single'`                 | Selection mode                           |
| `value`         | `Date \| null`                 | -                          | Selected date (for single mode)          |
| `rangeValue`    | `DateRange`                    | -                          | Selected date range (for range mode)     |
| `onChange`      | `(date: Date \| null) => void` | -                          | Callback for single date selection       |
| `onRangeChange` | `(range: DateRange) => void`   | -                          | Callback for range selection             |
| `disabled`      | `boolean`                      | `false`                    | Disable the entire calendar              |
| `readOnly`      | `boolean`                      | `false`                    | Make calendar read-only                  |
| `minDate`       | `Date`                         | -                          | Minimum selectable date                  |
| `maxDate`       | `Date`                         | -                          | Maximum selectable date                  |
| `disabledDates` | `Date[]`                       | -                          | Array of disabled dates                  |
| `className`     | `string`                       | -                          | Additional CSS classes                   |
| `views`         | `CalendarView[]`               | `['day', 'month', 'year']` | Available views                          |
| `defaultView`   | `CalendarView`                 | `'day'`                    | Initial view                             |
| `locale`        | `'en' \| 'ar'`                 | -                          | Force specific locale (defaults to i18n) |

### DateRange

```typescript
interface DateRange {
  from: Date | null;
  to: Date | null;
}
```

## Advanced Examples

### With Min/Max Dates

```tsx
<DateCalendar
  mode="single"
  value={selectedDate}
  onChange={setSelectedDate}
  minDate={new Date(2024, 0, 1)}
  maxDate={new Date(2024, 11, 31)}
/>
```

### With Disabled Dates

```tsx
const disabledDates = [
  new Date(2024, 5, 15),
  new Date(2024, 5, 20),
  new Date(2024, 5, 25),
];

<DateCalendar
  mode="single"
  value={selectedDate}
  onChange={setSelectedDate}
  disabledDates={disabledDates}
/>;
```

### Custom Views

```tsx
<DateCalendar
  mode="single"
  value={selectedDate}
  onChange={setSelectedDate}
  views={['day', 'month']} // Only day and month views
  defaultView="month" // Start with month view
/>
```

### Read-Only Calendar

```tsx
<DateCalendar mode="single" value={selectedDate} readOnly />
```

### Range Selection with Preview

When in range mode, hover over dates to see a preview of the range before confirming the second date.

```tsx
<DateCalendar
  mode="range"
  rangeValue={dateRange}
  onRangeChange={(range) => {
    setDateRange(range);
    if (range.from && range.to) {
      console.log(`Selected range: ${range.from} to ${range.to}`);
    }
  }}
/>
```

## Styling

The component uses CSS custom properties for theming. You can customize colors by overriding these variables:

```css
:root {
  --color-primary-light-300: #a5b4fc;
  --color-primary-light-400: #818cf8;
  --color-primary-light-500: #6366f1;
  --color-gray-light-100: #f3f4f6;
  --color-gray-light-200: #e5e7eb;
  /* ... more variables */
}
```

## Integration with Date Picker

You can integrate this calendar with the existing DatePicker component by replacing the DayPicker with DateCalendar:

```tsx
// In your date picker component
<DateCalendar
  mode="single"
  value={selectedDate}
  onChange={handleSelect}
  locale={currentLocale}
/>
```

## Utility Functions

The component exports several utility functions for date manipulation:

```typescript
import {
  formatDate,
  formatDateRange,
  isSameDay,
  isToday,
  isInRange,
  generateCalendarDays,
} from '@/components/ui/date-calendar/utils';

// Format a date
const formatted = formatDate(new Date(), 'en'); // "January 15, 2024"

// Format a date range
const rangeFormatted = formatDateRange(startDate, endDate, 'ar');

// Check if two dates are the same day
const same = isSameDay(date1, date2);

// Check if date is today
const today = isToday(someDate);

// Check if date is in range
const inRange = isInRange(date, startDate, endDate);
```

## Accessibility

- Full keyboard navigation support
- ARIA labels for screen readers
- Focus management for dropdowns
- Semantic HTML structure

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

When contributing to this component, please ensure:

1. All translations are added for both English and Arabic
2. Dark mode styles are included
3. RTL layout works correctly
4. Accessibility features are maintained
5. Component remains performant with large date ranges
