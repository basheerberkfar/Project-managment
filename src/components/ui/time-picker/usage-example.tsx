/**
 * Simple Usage Example for Time Picker Component
 *
 * This file demonstrates the most common use cases.
 * Copy and paste these examples into your components.
 */

import { useState } from 'react';
import TimePicker, { TimeInput } from './index';
import type { TimeValue } from './types';
import { formatTime } from './utils';

/**
 * Example 1: Basic Time Selection
 */
export function BasicTimeSelection() {
  const [time, setTime] = useState<TimeValue>({ hour: 14, minute: 30 });

  return (
    <div>
      <h3>Select a time:</h3>
      <TimePicker value={time} onChange={setTime} format="12" />
      <p>You selected: {formatTime(time, '12', false, 'en')}</p>
    </div>
  );
}

/**
 * Example 2: Time Input in a Form
 */
export function TimeFormExample() {
  const [startTime, setStartTime] = useState<TimeValue>({ hour: 9, minute: 0 });
  const [endTime, setEndTime] = useState<TimeValue>({ hour: 17, minute: 0 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Start time:', startTime);
    console.log('End time:', endTime);
    alert(
      `Scheduled from ${formatTime(startTime, '12', false, 'en')} to ${formatTime(endTime, '12', false, 'en')}`
    );
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Start Time:
        </label>
        <TimeInput value={startTime} onChange={setStartTime} format="12" />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          End Time:
        </label>
        <TimeInput value={endTime} onChange={setEndTime} format="12" />
      </div>

      <button type="submit">Schedule</button>
    </form>
  );
}

/**
 * Example 3: Appointment Scheduler (15-minute intervals)
 */
export function AppointmentScheduler() {
  const [appointmentTime, setAppointmentTime] = useState<TimeValue>({
    hour: 10,
    minute: 0,
  });

  return (
    <div>
      <h3>Schedule Appointment</h3>
      <p>Available slots from 9 AM to 5 PM (15-minute intervals)</p>
      <TimePicker
        value={appointmentTime}
        onChange={setAppointmentTime}
        format="12"
        minTime={{ hour: 9, minute: 0 }}
        maxTime={{ hour: 17, minute: 0 }}
        minuteStep={15}
      />
      <div
        style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#f0f9ff',
          borderRadius: '0.5rem',
        }}
      >
        <strong>Appointment Time:</strong>{' '}
        {formatTime(appointmentTime, '12', false, 'en')}
      </div>
    </div>
  );
}

/**
 * Example 4: Multi-language Time Picker
 */
export function MultiLanguageExample() {
  const [time, setTime] = useState<TimeValue>({ hour: 15, minute: 30 });
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setLanguage('en')}
          style={{ marginRight: '0.5rem' }}
        >
          English
        </button>
        <button onClick={() => setLanguage('ar')}>العربية</button>
      </div>

      <TimePicker
        value={time}
        onChange={setTime}
        format="12"
        locale={language}
      />

      <p
        style={{
          marginTop: '1rem',
          direction: language === 'ar' ? 'rtl' : 'ltr',
        }}
      >
        {language === 'en' ? 'Selected time: ' : 'الوقت المحدد: '}
        {formatTime(time, '12', false, language)}
      </p>
    </div>
  );
}

/**
 * Example 5: Time Range Picker
 */
export function TimeRangePicker() {
  const [startTime, setStartTime] = useState<TimeValue>({ hour: 9, minute: 0 });
  const [endTime, setEndTime] = useState<TimeValue>({ hour: 17, minute: 0 });

  const calculateDuration = () => {
    const startMinutes = startTime.hour * 60 + startTime.minute;
    const endMinutes = endTime.hour * 60 + endTime.minute;
    const diffMinutes = endMinutes - startMinutes;

    if (diffMinutes < 0) {
      return 'Invalid range';
    }

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div>
        <h4>Start Time</h4>
        <TimePicker value={startTime} onChange={setStartTime} format="12" />
      </div>

      <div>
        <h4>End Time</h4>
        <TimePicker value={endTime} onChange={setEndTime} format="12" />
      </div>

      <div
        style={{
          padding: '1rem',
          background: '#f9fafb',
          borderRadius: '0.5rem',
          alignSelf: 'center',
        }}
      >
        <strong>Duration:</strong> {calculateDuration()}
      </div>
    </div>
  );
}

/**
 * Example 6: Alarm Clock
 */
export function AlarmClock() {
  const [alarmTime, setAlarmTime] = useState<TimeValue>({ hour: 7, minute: 0 });
  const [isAlarmSet, setIsAlarmSet] = useState(false);

  const handleSetAlarm = () => {
    setIsAlarmSet(!isAlarmSet);
    if (!isAlarmSet) {
      alert(`Alarm set for ${formatTime(alarmTime, '12', false, 'en')}`);
    } else {
      alert('Alarm cancelled');
    }
  };

  return (
    <div style={{ maxWidth: '400px' }}>
      <h3>⏰ Set Alarm</h3>

      <TimePicker
        value={alarmTime}
        onChange={setAlarmTime}
        format="12"
        disabled={isAlarmSet}
      />

      <button
        onClick={handleSetAlarm}
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          width: '100%',
          background: isAlarmSet ? '#ef4444' : '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {isAlarmSet ? '🔕 Cancel Alarm' : '🔔 Set Alarm'}
      </button>

      {isAlarmSet && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#fef3c7',
            borderRadius: '0.5rem',
            border: '1px solid #fbbf24',
          }}
        >
          ⏰ Alarm set for{' '}
          <strong>{formatTime(alarmTime, '12', false, 'en')}</strong>
        </div>
      )}
    </div>
  );
}

/**
 * All Examples Combined
 */
export default function AllUsageExamples() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Time Picker Usage Examples</h1>

      <section style={{ marginBottom: '3rem' }}>
        <BasicTimeSelection />
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <TimeFormExample />
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <AppointmentScheduler />
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <MultiLanguageExample />
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <TimeRangePicker />
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <AlarmClock />
      </section>
    </div>
  );
}
