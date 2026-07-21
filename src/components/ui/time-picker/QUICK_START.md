# Time Picker - Quick Start Guide

Get started with the Time Picker component in under 5 minutes!

## Installation

The component is already included in your project. No additional installation needed.

## Components Overview

There are **3 components** available:

1. **TimePickerInput** ⭐ **RECOMMENDED** - Input field with dropdown picker (like DateCalendar)
2. **TimePicker** - Standalone picker component
3. **TimeInput** - Simple text input for manual entry

## Basic Usage

### 1. Import the Component

```tsx
// Recommended: Input with dropdown picker
import { TimePickerInput } from '@/components/ui/time-picker';

// Alternative: Standalone picker
import TimePicker from '@/components/ui/time-picker';

// Alternative: Text input only
import { TimeInput } from '@/components/ui/time-picker';
```

### 2. Add State

```tsx
import { useState } from 'react';
import type { TimeValue } from '@/components/ui/time-picker';

function MyComponent() {
  const [time, setTime] = useState<TimeValue>({ hour: 14, minute: 30 });

  // ...
}
```

### 3. Render the Component

**Option A: Input with Dropdown (Recommended)**

```tsx
return (
  <TimePickerInput
    label="Select Time"
    value={time}
    onChange={setTime}
    format="12"
    placeholder="Choose a time"
  />
);
```

**Option B: Standalone Picker**

```tsx
return <TimePicker value={time} onChange={setTime} format="12" />;
```

## Complete Example

### Using TimePickerInput (Recommended)

```tsx
import { useState } from 'react';
import { TimePickerInput } from '@/components/ui/time-picker';
import type { TimeValue } from '@/components/ui/time-picker';

function TimeSelector() {
  const [time, setTime] = useState<TimeValue | null>(null);

  return (
    <div>
      <TimePickerInput
        label="Appointment Time"
        value={time}
        onChange={setTime}
        format="12"
        placeholder="Select time"
      />
      {time && (
        <p>
          Selected: {time.hour}:{String(time.minute).padStart(2, '0')}
        </p>
      )}
    </div>
  );
}
```

### Using TimePicker (Standalone)

```tsx
import { useState } from 'react';
import TimePicker from '@/components/ui/time-picker';
import type { TimeValue } from '@/components/ui/time-picker';

function TimeSelector() {
  const [time, setTime] = useState<TimeValue>({
    hour: 14,
    minute: 30,
  });

  return (
    <div>
      <h2>Select Time</h2>
      <TimePicker value={time} onChange={setTime} format="12" />
      <p>
        Selected: {time.hour}:{String(time.minute).padStart(2, '0')}
      </p>
    </div>
  );
}
```

## Common Scenarios

### 12-Hour Format with AM/PM

```tsx
<TimePickerInput
  label="Select Time"
  value={time}
  onChange={setTime}
  format="12"
/>
```

### 24-Hour Format

```tsx
<TimePickerInput
  label="Military Time"
  value={time}
  onChange={setTime}
  format="24"
/>
```

### With Seconds

```tsx
<TimePickerInput
  label="Precise Time"
  value={time}
  onChange={setTime}
  format="12"
  showSeconds
/>
```

### Arabic (RTL)

```tsx
<TimePickerInput
  label="اختر الوقت"
  value={time}
  onChange={setTime}
  format="12"
/>
```

### Business Hours Only (9 AM - 5 PM)

```tsx
<TimePickerInput
  label="Meeting Time"
  value={time}
  onChange={setTime}
  format="12"
  minTime={{ hour: 9, minute: 0 }}
  maxTime={{ hour: 17, minute: 0 }}
/>
```

### 15-Minute Intervals

```tsx
<TimePickerInput
  label="Appointment"
  value={time}
  onChange={setTime}
  format="12"
  minuteStep={15}
/>
```

### With Validation Error

```tsx
<TimePickerInput
  label="Required Time"
  value={time}
  onChange={setTime}
  format="12"
  error="Please select a time"
/>
```

### Form Integration

```tsx
function MyForm() {
  const [time, setTime] = useState<TimeValue | null>(null);

  return (
    <form>
      <TimePickerInput
        label="Appointment Time"
        value={time}
        onChange={setTime}
        format="12"
        placeholder="Select time"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## TimeValue Object

The time is represented as an object:

```typescript
interface TimeValue {
  hour: number; // 0-23 (always in 24-hour format)
  minute: number; // 0-59
  second?: number; // 0-59 (optional)
}
```

**Example:**

```tsx
const morningTime: TimeValue = { hour: 9, minute: 30 }; // 9:30 AM
const afternoonTime: TimeValue = { hour: 14, minute: 45 }; // 2:45 PM
const withSeconds: TimeValue = { hour: 10, minute: 30, second: 15 }; // 10:30:15 AM
```

## Formatting Time for Display

Use the included utility function:

```tsx
import { formatTime } from '@/components/ui/time-picker';

const time: TimeValue = { hour: 14, minute: 30 };

// 12-hour format
const formatted12 = formatTime(time, '12', false, 'en');
// Result: "02:30 PM"

// 24-hour format
const formatted24 = formatTime(time, '24', false, 'en');
// Result: "14:30"

// With seconds
const withSeconds = formatTime(
  { hour: 14, minute: 30, second: 45 },
  '12',
  true,
  'en'
);
// Result: "02:30:45 PM"

// Arabic
const formattedAr = formatTime(time, '12', false, 'ar');
// Result: "02:30 مساءً"
```

## Parsing Time from String

```tsx
import { parseTime } from '@/components/ui/time-picker';

// Parse various formats
const time1 = parseTime('3:45 PM', '12');
// Result: { hour: 15, minute: 45 }

const time2 = parseTime('14:30', '24');
// Result: { hour: 14, minute: 30 }

const time3 = parseTime('11:30:45 AM', '12');
// Result: { hour: 11, minute: 30, second: 45 }
```

## Getting Current Time

```tsx
import { getCurrentTime } from '@/components/ui/time-picker';

const now = getCurrentTime();
// Returns current time as TimeValue
// Example: { hour: 14, minute: 30, second: 45 }
```

## Working with Dates

Convert between Date objects and TimeValue:

```tsx
import { timeFromDate, applyTimeToDate } from '@/components/ui/time-picker';

// Extract time from Date
const date = new Date();
const timeValue = timeFromDate(date);

// Apply time to a date
const targetDate = new Date('2024-01-15');
const timeToApply: TimeValue = { hour: 14, minute: 30 };
const newDate = applyTimeToDate(targetDate, timeToApply);
// Result: 2024-01-15 14:30:00
```

## Styling

Add custom styles with the `className` prop:

```tsx
<TimePicker
  value={time}
  onChange={setTime}
  format="12"
  className="my-custom-time-picker"
/>
```

Then in your CSS:

```css
.my-custom-time-picker {
  /* Your custom styles */
}
```

## Props Quick Reference

### Essential Props

| Prop       | Type           | Description              |
| ---------- | -------------- | ------------------------ |
| `value`    | `TimeValue`    | Current time             |
| `onChange` | `function`     | Called when time changes |
| `format`   | `'12' \| '24'` | Time format              |

### Optional Props

| Prop          | Type           | Default | Description      |
| ------------- | -------------- | ------- | ---------------- |
| `showSeconds` | `boolean`      | `false` | Show seconds     |
| `disabled`    | `boolean`      | `false` | Disable picker   |
| `readOnly`    | `boolean`      | `false` | Read-only mode   |
| `minTime`     | `TimeValue`    | -       | Minimum time     |
| `maxTime`     | `TimeValue`    | -       | Maximum time     |
| `locale`      | `'en' \| 'ar'` | Auto    | Language         |
| `minuteStep`  | `number`       | `1`     | Minute increment |
| `secondStep`  | `number`       | `1`     | Second increment |
| `className`   | `string`       | -       | CSS class        |

## Tips & Best Practices

### 1. Always Use 24-Hour Format Internally

The `TimeValue` object uses 24-hour format (0-23) internally, even when displaying in 12-hour format:

```tsx
// 2:30 PM is stored as:
const time: TimeValue = { hour: 14, minute: 30 };
```

### 2. Handle Undefined Values

Time can be undefined, so handle it gracefully:

```tsx
<TimePicker
  value={time}
  onChange={(newTime) => {
    if (newTime) {
      setTime(newTime);
    }
  }}
  format="12"
/>
```

### 3. Use TimeInput for Forms

For form inputs, use `TimeInput` instead of `TimePicker`:

```tsx
<form>
  <label>Appointment Time</label>
  <TimeInput
    value={time}
    onChange={setTime}
    format="12"
    placeholder="Enter time"
  />
</form>
```

### 4. Combine with Date Picker

For complete date-time selection:

```tsx
import DateCalendar from '@/components/ui/date-calendar';
import TimePicker from '@/components/ui/time-picker';

function DateTimePicker() {
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<TimeValue>({ hour: 14, minute: 30 });

  const getCombinedDateTime = () => {
    const combined = new Date(date);
    combined.setHours(time.hour);
    combined.setMinutes(time.minute);
    return combined;
  };

  return (
    <div>
      <DateCalendar value={date} onChange={setDate} />
      <TimePicker value={time} onChange={setTime} format="12" />
      <p>Selected: {getCombinedDateTime().toLocaleString()}</p>
    </div>
  );
}
```

### 5. Validate Time Ranges

Always validate time is within acceptable range:

```tsx
import { isTimeInRange } from '@/components/ui/time-picker';

const isValid = isTimeInRange(
  selectedTime,
  { hour: 9, minute: 0 }, // min
  { hour: 17, minute: 0 } // max
);

if (!isValid) {
  alert('Please select a time between 9 AM and 5 PM');
}
```

## Troubleshooting

### Time Not Updating

Make sure you're passing both `value` and `onChange`:

```tsx
// ❌ Wrong - missing onChange
<TimePicker value={time} format="12" />

// ✅ Correct
<TimePicker value={time} onChange={setTime} format="12" />
```

### RTL Not Working

Ensure you set the locale prop:

```tsx
// ❌ Wrong - missing locale
<TimePicker value={time} onChange={setTime} format="12" />

// ✅ Correct
<TimePicker value={time} onChange={setTime} format="12" locale="ar" />
```

### Styling Not Applied

Import the CSS file:

```tsx
import TimePicker from '@/components/ui/time-picker';
// CSS is automatically imported with the component
```

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Check [examples.tsx](./examples.tsx) for more usage examples
- Try the [demo.tsx](./demo.tsx) for an interactive experience

## Need Help?

- Review the TypeScript types in [types.ts](./types.ts)
- Check utility functions in [utils.ts](./utils.ts)
- Look at component implementation in [index.tsx](./index.tsx)

---

**Happy coding! 🎉**
