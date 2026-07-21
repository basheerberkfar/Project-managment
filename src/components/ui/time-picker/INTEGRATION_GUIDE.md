# Integration Guide - Time Picker with Date Calendar

This guide shows how to integrate the TimePicker component with the DateCalendar component to create a complete DateTime picker.

## Complete DateTime Picker

### Basic DateTime Picker

```tsx
import { useState } from 'react';
import DateCalendar from '@/components/ui/date-calendar';
import TimePicker, {
  applyTimeToDate,
  timeFromDate,
} from '@/components/ui/time-picker';
import type { TimeValue } from '@/components/ui/time-picker';

function DateTimePicker() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<TimeValue>(
    timeFromDate(new Date())
  );

  // Combine date and time
  const getDateTime = () => {
    return applyTimeToDate(selectedDate, selectedTime);
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div>
        <h3>Select Date</h3>
        <DateCalendar
          value={selectedDate}
          onChange={setSelectedDate}
          mode="single"
        />
      </div>

      <div>
        <h3>Select Time</h3>
        <TimePicker
          value={selectedTime}
          onChange={setSelectedTime}
          format="12"
        />
      </div>

      <div>
        <h3>Selected DateTime</h3>
        <p>{getDateTime().toLocaleString()}</p>
      </div>
    </div>
  );
}
```

## Form Integration

### Appointment Booking Form

```tsx
import { useState } from 'react';
import { DateCalendarInput } from '@/components/ui/date-calendar';
import { TimeInput } from '@/components/ui/time-picker';
import type { TimeValue } from '@/components/ui/time-picker';

function AppointmentForm() {
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<TimeValue>({ hour: 10, minute: 0 });
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      alert('Please select a date');
      return;
    }

    const appointmentDateTime = applyTimeToDate(date, time);

    const appointment = {
      name,
      dateTime: appointmentDateTime,
      notes,
    };

    console.log('Booking appointment:', appointment);
    alert(`Appointment booked for ${appointmentDateTime.toLocaleString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ maxWidth: '500px', padding: '2rem' }}
    >
      <h2>Book an Appointment</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label
          style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}
        >
          Full Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label
          style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}
        >
          Appointment Date *
        </label>
        <DateCalendarInput
          value={date}
          onChange={setDate}
          placeholder="Select date"
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label
          style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}
        >
          Appointment Time *
        </label>
        <TimeInput
          value={time}
          onChange={setTime}
          format="12"
          placeholder="Select time"
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label
          style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}
        >
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontFamily: 'inherit',
          }}
        />
      </div>

      <button
        type="submit"
        style={{
          width: '100%',
          padding: '0.75rem',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Book Appointment
      </button>
    </form>
  );
}
```

## Event Scheduler

### Start & End DateTime

```tsx
import { useState } from 'react';
import DateCalendar from '@/components/ui/date-calendar';
import TimePicker, {
  applyTimeToDate,
  formatTime,
  compareTime,
} from '@/components/ui/time-picker';
import type { TimeValue } from '@/components/ui/time-picker';

function EventScheduler() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<TimeValue>({ hour: 9, minute: 0 });

  const [endDate, setEndDate] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<TimeValue>({ hour: 10, minute: 0 });

  const getStartDateTime = () => applyTimeToDate(startDate, startTime);
  const getEndDateTime = () => applyTimeToDate(endDate, endTime);

  const getDuration = () => {
    const start = getStartDateTime().getTime();
    const end = getEndDateTime().getTime();
    const diff = end - start;

    if (diff < 0) return 'Invalid';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  const isValid = getEndDateTime() > getStartDateTime();

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Schedule Event</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          marginTop: '1.5rem',
        }}
      >
        {/* Start DateTime */}
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Start</h3>
          <div style={{ marginBottom: '1rem' }}>
            <DateCalendar
              value={startDate}
              onChange={setStartDate}
              mode="single"
            />
          </div>
          <TimePicker value={startTime} onChange={setStartTime} format="12" />
          <div
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem',
              background: '#f0f9ff',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
          >
            {getStartDateTime().toLocaleString()}
          </div>
        </div>

        {/* End DateTime */}
        <div>
          <h3 style={{ marginBottom: '1rem' }}>End</h3>
          <div style={{ marginBottom: '1rem' }}>
            <DateCalendar value={endDate} onChange={setEndDate} mode="single" />
          </div>
          <TimePicker value={endTime} onChange={setEndTime} format="12" />
          <div
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem',
              background: '#f0f9ff',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
          >
            {getEndDateTime().toLocaleString()}
          </div>
        </div>
      </div>

      {/* Duration Summary */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: isValid ? '#f0fdf4' : '#fef2f2',
          border: `2px solid ${isValid ? '#10b981' : '#ef4444'}`,
          borderRadius: '0.5rem',
        }}
      >
        <h3 style={{ marginBottom: '0.5rem' }}>
          {isValid ? '✓ Duration' : '✗ Invalid Date Range'}
        </h3>
        <p style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
          {isValid ? getDuration() : 'End time must be after start time'}
        </p>
      </div>
    </div>
  );
}
```

## Calendar with Time Slots

### Daily Schedule View

```tsx
import { useState } from 'react';
import DateCalendar from '@/components/ui/date-calendar';
import TimePicker, { formatTime } from '@/components/ui/time-picker';
import type { TimeValue } from '@/components/ui/time-picker';

interface TimeSlot {
  id: string;
  time: TimeValue;
  title: string;
  description: string;
}

function DailySchedule() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: '1',
      time: { hour: 9, minute: 0 },
      title: 'Team Meeting',
      description: 'Weekly standup',
    },
    {
      id: '2',
      time: { hour: 14, minute: 30 },
      title: 'Client Call',
      description: 'Project review',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSlotTime, setNewSlotTime] = useState<TimeValue>({
    hour: 10,
    minute: 0,
  });
  const [newSlotTitle, setNewSlotTitle] = useState('');

  const handleAddSlot = () => {
    if (!newSlotTitle.trim()) return;

    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      time: newSlotTime,
      title: newSlotTitle,
      description: '',
    };

    setTimeSlots(
      [...timeSlots, newSlot].sort((a, b) => compareTime(a.time, b.time))
    );

    setNewSlotTitle('');
    setShowAddForm(false);
  };

  const handleDeleteSlot = (id: string) => {
    setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Daily Schedule</h2>

      <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
        {/* Date Selector */}
        <div>
          <DateCalendar
            value={selectedDate}
            onChange={setSelectedDate}
            mode="single"
          />
        </div>

        {/* Time Slots */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h3>Schedule for {selectedDate.toDateString()}</h3>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                padding: '0.5rem 1rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
              }}
            >
              + Add Slot
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
              }}
            >
              <h4>Add Time Slot</h4>
              <div style={{ marginBottom: '0.5rem' }}>
                <TimePicker
                  value={newSlotTime}
                  onChange={setNewSlotTime}
                  format="12"
                  minuteStep={15}
                />
              </div>
              <input
                type="text"
                placeholder="Title"
                value={newSlotTitle}
                onChange={(e) => setNewSlotTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  marginBottom: '0.5rem',
                }}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleAddSlot}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                  }}
                >
                  Add
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Time Slots List */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            {timeSlots.length === 0 ? (
              <div
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#6b7280',
                  background: '#f9fafb',
                  borderRadius: '0.5rem',
                }}
              >
                No time slots scheduled
              </div>
            ) : (
              timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  style={{
                    padding: '1rem',
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#eff6ff',
                        borderRadius: '0.375rem',
                        fontWeight: 600,
                        color: '#3b82f6',
                        minWidth: '100px',
                        textAlign: 'center',
                      }}
                    >
                      {formatTime(slot.time, '12', false, 'en')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{slot.title}</div>
                      {slot.description && (
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {slot.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteSlot(slot.id)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      background: '#fee2e2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Tips for Integration

### 1. Synchronize Date and Time

When user selects a date, you might want to update the time constraints:

```tsx
const handleDateChange = (newDate: Date) => {
  setSelectedDate(newDate);

  // If date is today, don't allow past times
  if (isSameDay(newDate, new Date())) {
    const now = getCurrentTime();
    if (compareTime(selectedTime, now) < 0) {
      setSelectedTime(now);
    }
  }
};
```

### 2. Business Hours Validation

```tsx
const businessHours = {
  start: { hour: 9, minute: 0 },
  end: { hour: 17, minute: 0 },
};

const isBusinessHours = (time: TimeValue) => {
  return isTimeInRange(time, businessHours.start, businessHours.end);
};
```

### 3. Weekend Handling

```tsx
const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

// Disable weekends in DateCalendar
<DateCalendar
  value={date}
  onChange={setDate}
  disabledDates={(date) => isWeekend(date)}
/>;
```

### 4. Multi-language Support

```tsx
const { i18n } = useTranslation();
const currentLang = i18n.language as 'en' | 'ar';

<DateCalendar locale={currentLang} />
<TimePicker locale={currentLang} />
```

## Common Patterns

### Pattern 1: Inline DateTime

```tsx
<div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
  <DateCalendarInput value={date} onChange={setDate} />
  <span>at</span>
  <TimeInput value={time} onChange={setTime} format="12" />
</div>
```

### Pattern 2: Modal DateTime Picker

```tsx
<Modal>
  <DateCalendar ... />
  <TimePicker ... />
  <Button onClick={handleConfirm}>Confirm</Button>
</Modal>
```

### Pattern 3: Quick Presets

```tsx
const presets = {
  now: { date: new Date(), time: getCurrentTime() },
  tomorrow9am: {
    date: addDays(new Date(), 1),
    time: { hour: 9, minute: 0 },
  },
  nextWeek: {
    date: addDays(new Date(), 7),
    time: { hour: 9, minute: 0 },
  },
};
```

## Best Practices

1. **Always validate date-time combinations**
2. **Handle timezone considerations**
3. **Provide clear error messages**
4. **Use appropriate time steps (15min for appointments)**
5. **Consider business rules (hours, holidays)**
6. **Test with different locales**
7. **Make it mobile-friendly**
8. **Provide keyboard shortcuts**
9. **Save state in URL or localStorage**
10. **Test edge cases (midnight, date boundaries)**

---

For more examples, see:

- [Time Picker Examples](./examples.tsx)
- [Date Calendar Examples](../date-calendar/examples.tsx)
