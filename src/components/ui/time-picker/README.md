# Time Picker Component

A comprehensive and fully-featured time picker component for React applications with support for both 12-hour and 24-hour formats, RTL languages (Arabic), and editable inputs.

## Features

- ✅ **Input with dropdown picker** - Similar to DateCalendar, click input to open picker
- ✅ **12-hour and 24-hour formats** - Switch between formats easily
- ✅ **AM/PM support** - Localized AM/PM labels for 12-hour format
- ✅ **Editable inputs** - Click and type to change hours, minutes, and seconds
- ✅ **RTL support** - Full support for Arabic and other RTL languages
- ✅ **Internationalization** - Built-in i18n support with react-i18next
- ✅ **Keyboard navigation** - Full keyboard support for accessibility
- ✅ **Time restrictions** - Set min/max time limits
- ✅ **Disabled/Read-only states** - Control user interaction
- ✅ **Seconds support** - Optional seconds display and editing
- ✅ **Customizable steps** - Set custom minute/second increments
- ✅ **Form integration** - React Hook Form support with Controller
- ✅ **TypeScript** - Full TypeScript support with comprehensive types
- ✅ **Responsive** - Works on mobile and desktop
- ✅ **Dark mode ready** - Supports dark mode
- ✅ **Similar to DateCalendar** - Consistent design and UX

## Components

### 1. TimePickerInput ⭐ RECOMMENDED

Input field with dropdown time picker - similar to DateCalendarInput.

```tsx
import { TimePickerInput } from '@/components/ui/time-picker';

function MyComponent() {
  const [time, setTime] = useState<TimeValue | null>(null);

  return (
    <TimePickerInput
      label="Select Time"
      value={time}
      onChange={setTime}
      format="12"
      placeholder="Choose a time"
    />
  );
}
```

### 2. TimePicker

Standalone time picker component with visual controls.

```tsx
import TimePicker from '@/components/ui/time-picker';

function MyComponent() {
  const [time, setTime] = useState({ hour: 14, minute: 30 });

  return <TimePicker value={time} onChange={setTime} format="12" />;
}
```

### 3. TimeInput

A text input field for entering time manually.

```tsx
import { TimeInput } from '@/components/ui/time-picker';

function MyComponent() {
  const [time, setTime] = useState({ hour: 14, minute: 30 });

  return (
    <TimeInput
      value={time}
      onChange={setTime}
      format="12"
      placeholder="Enter time"
    />
  );
}
```

## Props

### TimePickerInput Props

| Prop               | Type                                | Default | Description                      |
| ------------------ | ----------------------------------- | ------- | -------------------------------- |
| `value`            | `TimeValue \| null`                 | -       | Current time value               |
| `onChange`         | `(time: TimeValue \| null) => void` | -       | Callback when time changes       |
| `format`           | `'12' \| '24'`                      | `'12'`  | Time format (12-hour or 24-hour) |
| `showSeconds`      | `boolean`                           | `false` | Show seconds in the picker       |
| `disabled`         | `boolean`                           | `false` | Disable the input                |
| `label`            | `string`                            | -       | Floating label text              |
| `error`            | `string`                            | -       | Error message to display         |
| `placeholder`      | `string`                            | -       | Placeholder text                 |
| `minTime`          | `TimeValue`                         | -       | Minimum selectable time          |
| `maxTime`          | `TimeValue`                         | -       | Maximum selectable time          |
| `className`        | `string`                            | -       | Additional CSS class names       |
| `wrapperClassName` | `string`                            | -       | Wrapper div CSS class names      |
| `minuteStep`       | `number`                            | `1`     | Minute increment step            |
| `secondStep`       | `number`                            | `1`     | Second increment step            |
| `control`          | `Control`                           | -       | React Hook Form control          |
| `name`             | `string`                            | -       | Form field name                  |
| `rules`            | `object`                            | -       | Validation rules                 |

### TimePicker Props

| Prop          | Type                        | Default     | Description                      |
| ------------- | --------------------------- | ----------- | -------------------------------- |
| `value`       | `TimeValue`                 | -           | Current time value               |
| `onChange`    | `(time: TimeValue) => void` | -           | Callback when time changes       |
| `format`      | `'12' \| '24'`              | `'12'`      | Time format (12-hour or 24-hour) |
| `showSeconds` | `boolean`                   | `false`     | Show seconds in the picker       |
| `disabled`    | `boolean`                   | `false`     | Disable the picker               |
| `readOnly`    | `boolean`                   | `false`     | Make the picker read-only        |
| `minTime`     | `TimeValue`                 | -           | Minimum selectable time          |
| `maxTime`     | `TimeValue`                 | -           | Maximum selectable time          |
| `className`   | `string`                    | -           | Additional CSS class names       |
| `locale`      | `'en' \| 'ar'`              | Auto-detect | Language locale                  |
| `minuteStep`  | `number`                    | `1`         | Minute increment step            |
| `secondStep`  | `number`                    | `1`         | Second increment step            |

### TimeInput Props

| Prop          | Type                        | Default     | Description                      |
| ------------- | --------------------------- | ----------- | -------------------------------- |
| `value`       | `TimeValue`                 | -           | Current time value               |
| `onChange`    | `(time: TimeValue) => void` | -           | Callback when time changes       |
| `format`      | `'12' \| '24'`              | `'12'`      | Time format (12-hour or 24-hour) |
| `showSeconds` | `boolean`                   | `false`     | Show seconds in the input        |
| `disabled`    | `boolean`                   | `false`     | Disable the input                |
| `readOnly`    | `boolean`                   | `false`     | Make the input read-only         |
| `className`   | `string`                    | -           | Additional CSS class names       |
| `locale`      | `'en' \| 'ar'`              | Auto-detect | Language locale                  |
| `placeholder` | `string`                    | -           | Placeholder text                 |

### TimeValue Type

```typescript
interface TimeValue {
  hour: number; // 0-23 (24-hour format)
  minute: number; // 0-59
  second?: number; // 0-59 (optional)
}
```

## Examples

### Basic Usage (Input with Dropdown)

```tsx
import { useState } from 'react';
import { TimePickerInput } from '@/components/ui/time-picker';

function App() {
  const [time, setTime] = useState<TimeValue | null>(null);

  return (
    <TimePickerInput
      label="Appointment Time"
      value={time}
      onChange={setTime}
      format="12"
      placeholder="Select time"
    />
  );
}
```

### Standalone Picker

```tsx
import { useState } from 'react';
import TimePicker from '@/components/ui/time-picker';

function App() {
  const [time, setTime] = useState({ hour: 14, minute: 30 });

  return <TimePicker value={time} onChange={setTime} format="12" />;
}
```

### With Seconds

```tsx
<TimePickerInput
  label="Precise Time"
  value={{ hour: 10, minute: 30, second: 45 }}
  onChange={setTime}
  format="12"
  showSeconds
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

### RTL (Arabic)

```tsx
<TimePickerInput
  label="اختر الوقت"
  value={time}
  onChange={setTime}
  format="12"
/>
```

### With Time Restrictions

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

### Minute Steps (15-minute intervals)

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

### Disabled State

```tsx
<TimePickerInput
  label="Disabled"
  value={time}
  onChange={setTime}
  format="12"
  disabled
/>
```

### React Hook Form Integration

```tsx
import { useForm } from 'react-hook-form';
import { TimePickerInput } from '@/components/ui/time-picker';

function MyForm() {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TimePickerInput
        name="appointmentTime"
        control={control}
        label="Appointment Time"
        format="12"
        rules={{ required: 'Time is required' }}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Utility Functions

The component exports several utility functions for working with time:

```tsx
import {
  formatTime,
  parseTime,
  getCurrentTime,
  to12Hour,
  to24Hour,
  compareTime,
  isTimeInRange,
  clampTime,
  timeFromDate,
  applyTimeToDate,
} from '@/components/ui/time-picker';

// Format time to string
const formatted = formatTime({ hour: 14, minute: 30 }, '12', false, 'en'); // "02:30 PM"

// Parse time from string
const parsed = parseTime('3:45 PM', '12');
// Returns: { hour: 15, minute: 45 }

// Get current time
const now = getCurrentTime();
// Returns: { hour: 14, minute: 30, second: 45 }

// Convert between formats
const { hour, period } = to12Hour(14); // { hour: 2, period: 'pm' }
const hour24 = to24Hour(2, 'pm'); // 14

// Compare times
const comparison = compareTime(time1, time2);
// Returns: -1 (time1 < time2), 0 (equal), 1 (time1 > time2)

// Check if time is in range
const inRange = isTimeInRange(
  time,
  { hour: 9, minute: 0 },
  { hour: 17, minute: 0 }
);

// Clamp time to range
const clamped = clampTime(
  { hour: 8, minute: 0 },
  { hour: 9, minute: 0 },
  { hour: 17, minute: 0 }
); // Returns: { hour: 9, minute: 0 }

// Convert Date to TimeValue
const timeValue = timeFromDate(new Date());

// Apply time to date
const newDate = applyTimeToDate(new Date('2024-01-01'), {
  hour: 14,
  minute: 30,
});
```

## Keyboard Support

The TimePicker component supports keyboard navigation:

- **Tab**: Move focus between inputs and buttons
- **Enter**: Confirm input changes (in editable fields)
- **Escape**: Cancel input changes and restore previous value
- **Arrow Up/Down**: Increase/decrease values (on buttons)
- **Number keys**: Direct input in editable fields

## Internationalization

The component uses react-i18next for translations. Add these keys to your translation files:

### English (`en/common.json`):

```json
{
  "time": {
    "am": "AM",
    "pm": "PM",
    "hour": "Hour",
    "minute": "Minute",
    "second": "Second",
    "select-time": "Select Time",
    "now": "Now"
  }
}
```

### Arabic (`ar/common.json`):

```json
{
  "time": {
    "am": "صباحاً",
    "pm": "مساءً",
    "hour": "الساعة",
    "minute": "الدقيقة",
    "second": "الثانية",
    "select-time": "اختر الوقت",
    "now": "الآن"
  }
}
```

## Styling

The component comes with default styles in `time-picker.css`. You can customize the appearance by:

1. **Overriding CSS variables**: Add your own CSS to override default styles
2. **Using className prop**: Add custom classes to the component
3. **Modifying the CSS file**: Edit `time-picker.css` directly

### Custom Styling Example

```css
/* Custom primary color */
.time-picker .time-picker-period-btn.active {
  background: #10b981;
  border-color: #10b981;
}

/* Custom font */
.time-picker {
  font-family: 'Inter', sans-serif;
}

/* Custom size */
.time-picker-small {
  min-width: 200px;
}

.time-picker-small .time-picker-display {
  font-size: 1.5rem;
  padding: 1rem;
}
```

## Accessibility

- ARIA labels for all interactive elements
- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- Semantic HTML structure

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

MIT

## Author

Created for Golden Age Project
