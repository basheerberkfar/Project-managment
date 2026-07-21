# Time Picker Components - Comparison Guide

This guide helps you choose the right component for your use case.

## Available Components

### 1. TimePickerInput ⭐ RECOMMENDED

**Input field with dropdown time picker** - Similar to DateCalendarInput

```tsx
import { TimePickerInput } from '@/components/ui/time-picker';

<TimePickerInput
  label="Select Time"
  value={time}
  onChange={setTime}
  format="12"
  placeholder="Choose a time"
/>;
```

**When to use:**

- ✅ Form inputs
- ✅ Need floating label
- ✅ Need error display
- ✅ React Hook Form integration
- ✅ Want consistent UX with DateCalendar
- ✅ Space-saving UI (dropdown opens on click)

**Features:**

- Floating label animation
- Error message display
- Click input to open dropdown
- Auto-positioning (top/bottom)
- Clear button (X)
- Clock icon
- "Now" and "Done" buttons
- React Hook Form support
- Validation support

---

### 2. TimePicker

**Standalone time picker component** - Always visible picker

```tsx
import TimePicker from '@/components/ui/time-picker';

<TimePicker value={time} onChange={setTime} format="12" />;
```

**When to use:**

- ✅ Custom layouts
- ✅ Always-visible picker
- ✅ Embedded in modals/sidebars
- ✅ No input field needed
- ✅ Custom styling requirements

**Features:**

- Full-featured time picker
- Editable hour/minute/second fields
- AM/PM toggle buttons
- Increment/decrement arrows
- "Now" button
- Time restrictions (min/max)
- Minute/second steps

---

### 3. TimeInput

**Simple text input** - Manual entry only

```tsx
import { TimeInput } from '@/components/ui/time-picker';

<TimeInput
  value={time}
  onChange={setTime}
  format="12"
  placeholder="Enter time"
/>;
```

**When to use:**

- ✅ Simple text entry
- ✅ No visual picker needed
- ✅ Keyboard-heavy workflows
- ✅ Minimal UI

**Features:**

- Text input only
- Parse various formats
- Keyboard shortcuts (Enter, Escape)
- Auto-formatting on blur
- Validation

---

## Comparison Table

| Feature              | TimePickerInput ⭐ | TimePicker           | TimeInput          |
| -------------------- | ------------------ | -------------------- | ------------------ |
| **Input Field**      | ✅ Yes             | ❌ No                | ✅ Yes             |
| **Dropdown Picker**  | ✅ Yes             | N/A (always visible) | ❌ No              |
| **Floating Label**   | ✅ Yes             | ❌ No                | ❌ No              |
| **Error Display**    | ✅ Yes             | ❌ No                | ❌ No              |
| **React Hook Form**  | ✅ Yes             | ❌ No                | ❌ No              |
| **Visual Picker**    | ✅ Yes (dropdown)  | ✅ Yes (inline)      | ❌ No              |
| **Manual Entry**     | ✅ Yes (in picker) | ✅ Yes (in picker)   | ✅ Yes             |
| **Auto-positioning** | ✅ Yes             | N/A                  | N/A                |
| **Clear Button**     | ✅ Yes             | ❌ No                | ❌ No              |
| **Icon**             | ✅ Clock           | ❌ No                | ❌ No              |
| **Space Required**   | Small (input only) | Large (full picker)  | Small (input only) |
| **Best For**         | Forms, general use | Custom layouts       | Keyboard users     |

---

## Usage Examples by Scenario

### Scenario 1: Form with Multiple Fields

**Use: TimePickerInput**

```tsx
function AppointmentForm() {
  const [time, setTime] = useState<TimeValue | null>(null);

  return (
    <form>
      <TimePickerInput
        label="Appointment Time"
        value={time}
        onChange={setTime}
        format="12"
        error={errors.time?.message}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

### Scenario 2: Modal/Dialog with Time Selection

**Use: TimePicker (standalone)**

```tsx
function TimeSelectionModal({ isOpen, onClose }) {
  const [time, setTime] = useState<TimeValue>({ hour: 14, minute: 30 });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Select Time</h2>
      <TimePicker value={time} onChange={setTime} format="12" />
      <button onClick={() => onClose(time)}>Confirm</button>
    </Modal>
  );
}
```

---

### Scenario 3: Quick Time Entry (Keyboard-heavy)

**Use: TimeInput**

```tsx
function QuickTimeEntry() {
  const [time, setTime] = useState<TimeValue | null>(null);

  return (
    <div>
      <label>Time:</label>
      <TimeInput
        value={time}
        onChange={setTime}
        format="12"
        placeholder="Type time (e.g., 3:45 PM)"
      />
    </div>
  );
}
```

---

### Scenario 4: Dashboard Widget

**Use: TimePicker (standalone)**

```tsx
function TimeWidget() {
  const [time, setTime] = useState<TimeValue>(getCurrentTime());

  return (
    <div className="widget">
      <h3>Set Alarm</h3>
      <TimePicker value={time} onChange={setTime} format="12" minuteStep={15} />
    </div>
  );
}
```

---

### Scenario 5: React Hook Form

**Use: TimePickerInput**

```tsx
function FormWithValidation() {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TimePickerInput
        name="meetingTime"
        control={control}
        label="Meeting Time"
        format="12"
        rules={{
          required: 'Time is required',
          validate: (value) => {
            // Custom validation
            return value.hour >= 9 || 'Meetings start at 9 AM';
          },
        }}
      />
    </form>
  );
}
```

---

## Migration Guide

### From TimeInput to TimePickerInput

**Before:**

```tsx
<TimeInput
  value={time}
  onChange={setTime}
  format="12"
  placeholder="Enter time"
/>
```

**After:**

```tsx
<TimePickerInput
  label="Select Time"
  value={time}
  onChange={setTime}
  format="12"
  placeholder="Enter time"
/>
```

**Changes:**

- Add `label` prop
- Value can now be `null`
- Gets dropdown picker automatically
- Can add `error` prop for validation

---

### From TimePicker to TimePickerInput

**Before:**

```tsx
<div>
  <label>Select Time</label>
  <TimePicker value={time} onChange={setTime} format="12" />
</div>
```

**After:**

```tsx
<TimePickerInput
  label="Select Time"
  value={time}
  onChange={setTime}
  format="12"
/>
```

**Benefits:**

- Less code
- Consistent with DateCalendar
- Built-in label and error handling
- Better mobile experience

---

## Recommendations

### ✅ DO

- Use **TimePickerInput** for most form inputs
- Use **TimePicker** for always-visible pickers or custom layouts
- Use **TimeInput** for keyboard-heavy workflows

### ❌ DON'T

- Don't use TimePicker in tight spaces (use TimePickerInput)
- Don't use TimeInput if users need visual assistance
- Don't mix different components for similar use cases (be consistent)

---

## Props Compatibility

Most props are compatible across components:

**Common Props:**

- `value` - TimeValue
- `onChange` - Callback
- `format` - '12' | '24'
- `showSeconds` - boolean
- `disabled` - boolean
- `minTime` - TimeValue
- `maxTime` - TimeValue
- `minuteStep` - number
- `secondStep` - number

**TimePickerInput Only:**

- `label` - Floating label
- `error` - Error message
- `placeholder` - Input placeholder
- `control` - React Hook Form control
- `name` - Form field name
- `rules` - Validation rules
- `wrapperClassName` - Wrapper styles

---

## Quick Decision Tree

```
Do you need form integration?
├─ Yes → Use TimePickerInput
└─ No → Do you need always-visible picker?
    ├─ Yes → Use TimePicker
    └─ No → Do you prefer text entry?
        ├─ Yes → Use TimeInput
        └─ No → Use TimePickerInput
```

---

## Summary

- **TimePickerInput** ⭐ - Your go-to component for 90% of use cases
- **TimePicker** - For special layouts and always-visible pickers
- **TimeInput** - For minimalist keyboard-first interfaces

**When in doubt, use TimePickerInput!**
