import React, { useState } from 'react';
import { TimePickerInput } from './index';
import type { TimeValue } from './types';
import { formatTime } from './utils';

/**
 * Demo Page for TimePickerInput Component
 * Similar to DateCalendarInput
 */
const TimePickerInputDemo: React.FC = () => {
  const [time1, setTime1] = useState<TimeValue | null>({
    hour: 14,
    minute: 30,
  });
  const [time2, setTime2] = useState<TimeValue | null>(null);
  const [time3, setTime3] = useState<TimeValue | null>({ hour: 9, minute: 0 });
  const [time4, setTime4] = useState<TimeValue | null>({
    hour: 15,
    minute: 45,
  });
  const [time5, setTime5] = useState<TimeValue | null>({
    hour: 10,
    minute: 30,
    second: 45,
  });
  const [time6, setTime6] = useState<TimeValue | null>({ hour: 10, minute: 0 });

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1
          style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#111827' }}
        >
          TimePickerInput Component Demo
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          Time picker with input field and dropdown - similar to DateCalendar
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
        }}
      >
        {/* Basic Usage */}
        <section style={cardStyle}>
          <h2 style={headingStyle}>Basic Usage (12-hour)</h2>
          <p style={descStyle}>
            Click on the input to open the time picker dropdown.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <TimePickerInput
              label="Select Time"
              value={time1 as TimeValue | undefined}
              onChange={(time) => setTime1(time as TimeValue | null)}
              format="12"
              placeholder="Choose a time"
            />
          </div>
          <div style={infoBoxStyle}>
            <strong>Selected:</strong>{' '}
            {time1 ? formatTime(time1, '12', false, 'en') : 'None'}
          </div>
        </section>

        {/* 24-Hour Format */}
        <section style={cardStyle}>
          <h2 style={headingStyle}>24-Hour Format</h2>
          <p style={descStyle}>Military time format without AM/PM.</p>
          <div style={{ marginTop: '1rem' }}>
            <TimePickerInput
              label="Appointment Time"
              value={time2 as TimeValue | undefined}
              onChange={(time) => setTime2(time as TimeValue | null)}
              format="24"
              placeholder="Select time"
            />
          </div>
          <div style={infoBoxStyle}>
            <strong>Selected:</strong>{' '}
            {time2 ? formatTime(time2, '24', false, 'en') : 'None'}
          </div>
        </section>

        {/* With Time Restrictions */}
        <section style={cardStyle}>
          <h2 style={headingStyle}>Business Hours (9 AM - 5 PM)</h2>
          <p style={descStyle}>Time selection limited to working hours.</p>
          <div style={{ marginTop: '1rem' }}>
            <TimePickerInput
              label="Meeting Time"
              value={time3 as TimeValue | undefined}
              onChange={(time) => setTime3(time as TimeValue | null)}
              format="12"
              minTime={{ hour: 9, minute: 0 }}
              maxTime={{ hour: 17, minute: 0 }}
              placeholder="Select meeting time"
            />
          </div>
          <div style={infoBoxStyle}>
            <strong>Selected:</strong>{' '}
            {time3 ? formatTime(time3, '12', false, 'en') : 'None'}
            <br />
            <small style={{ color: '#6b7280' }}>Range: 9:00 AM - 5:00 PM</small>
          </div>
        </section>

        {/* RTL (Arabic) */}
        <section style={cardStyle}>
          <h2 style={headingStyle}>RTL Support (Arabic)</h2>
          <p style={descStyle}>Full right-to-left language support.</p>
          <div style={{ marginTop: '1rem', direction: 'rtl' }}>
            <TimePickerInput
              label="اختر الوقت"
              value={time4 as TimeValue | undefined}
              onChange={(time) => setTime4(time as TimeValue | null)}
              format="12"
              placeholder="اختر وقتاً"
            />
          </div>
          <div style={{ ...infoBoxStyle, direction: 'rtl' }}>
            <strong>الوقت المحدد:</strong>{' '}
            {time4 ? formatTime(time4, '12', false, 'ar') : 'لا يوجد'}
          </div>
        </section>

        {/* With Seconds */}
        <section style={cardStyle}>
          <h2 style={headingStyle}>With Seconds</h2>
          <p style={descStyle}>Precise time selection including seconds.</p>
          <div style={{ marginTop: '1rem' }}>
            <TimePickerInput
              label="Precise Time"
              value={time5 as TimeValue | undefined}
              onChange={(time) => setTime5(time as TimeValue | null)}
              format="12"
              showSeconds
              placeholder="Select precise time"
            />
          </div>
          <div style={infoBoxStyle}>
            <strong>Selected:</strong>{' '}
            {time5 ? formatTime(time5, '12', true, 'en') : 'None'}
          </div>
        </section>

        {/* 15-Minute Steps */}
        <section style={cardStyle}>
          <h2 style={headingStyle}>15-Minute Intervals</h2>
          <p style={descStyle}>Minutes increment in 15-minute steps.</p>
          <div style={{ marginTop: '1rem' }}>
            <TimePickerInput
              label="Appointment Slot"
              value={time6 as TimeValue | undefined}
              onChange={(time) => setTime6(time as TimeValue | null)}
              format="12"
              minuteStep={15}
              placeholder="Select appointment"
            />
          </div>
          <div style={infoBoxStyle}>
            <strong>Selected:</strong>{' '}
            {time6 ? formatTime(time6, '12', false, 'en') : 'None'}
            <br />
            <small style={{ color: '#6b7280' }}>Step: 15 minutes</small>
          </div>
        </section>

        {/* With Error */}
        <section style={cardStyle}>
          <h2 style={headingStyle}>With Error State</h2>
          <p style={descStyle}>Input with validation error message.</p>
          <div style={{ marginTop: '1rem' }}>
            <TimePickerInput
              label="Required Time"
              value={undefined as unknown as TimeValue | undefined}
              onChange={() => {}}
              format="12"
              error="Please select a time"
              placeholder="Select time"
            />
          </div>
        </section>

        {/* Disabled */}
        <section style={cardStyle}>
          <h2 style={headingStyle}>Disabled State</h2>
          <p style={descStyle}>Non-interactive disabled input.</p>
          <div style={{ marginTop: '1rem' }}>
            <TimePickerInput
              label="Disabled Time"
              value={{ hour: 10, minute: 30 }}
              onChange={() => {}}
              format="12"
              disabled
              placeholder="Select time"
            />
          </div>
        </section>

        {/* Without Label */}
        <section style={cardStyle}>
          <h2 style={headingStyle}>Without Label</h2>
          <p style={descStyle}>Input without floating label.</p>
          <div style={{ marginTop: '1rem' }}>
            <TimePickerInput
              value={undefined as unknown as TimeValue | undefined}
              onChange={() => {}}
              format="12"
              placeholder="Select time"
            />
          </div>
        </section>
      </div>

      {/* Form Example */}
      <section style={{ marginTop: '4rem' }}>
        <h2
          style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#111827' }}
        >
          Form Integration Example
        </h2>
        <FormExample />
      </section>

      {/* Usage Code */}
      <section style={{ marginTop: '4rem' }}>
        <h2
          style={{
            fontSize: '2rem',
            marginBottom: '1.5rem',
            color: '#111827',
            textAlign: 'center',
          }}
        >
          Usage Example
        </h2>
        <div
          style={{
            background: '#1f2937',
            color: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            overflow: 'auto',
          }}
        >
          <pre style={{ margin: 0 }}>{`import { useState } from 'react';
import { TimePickerInput } from '@/components/ui/time-picker';
import type { TimeValue } from '@/components/ui/time-picker';

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
}`}</pre>
        </div>
      </section>
    </div>
  );
};

// Form Example Component
const FormExample: React.FC = () => {
  const [startTime, setStartTime] = useState<TimeValue | null>({
    hour: 9,
    minute: 0,
  });
  const [endTime, setEndTime] = useState<TimeValue | null>({
    hour: 17,
    minute: 0,
  });
  const [breakTime, setBreakTime] = useState<TimeValue | null>({
    hour: 12,
    minute: 0,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      startTime,
      endTime,
      breakTime,
    };
    console.log('Form data:', data);
    alert('Form submitted! Check console for data.');
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2rem',
        background: 'white',
        borderRadius: '0.75rem',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}
    >
      <h3
        style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}
      >
        Work Schedule
      </h3>

      <div style={{ marginBottom: '1.5rem' }}>
        <TimePickerInput
          label="Start Time"
          value={startTime as TimeValue | undefined}
          onChange={(time) => setStartTime(time as TimeValue | null)}
          format="12"
          placeholder="Work starts at"
          minTime={{ hour: 6, minute: 0 }}
          maxTime={{ hour: 12, minute: 0 }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <TimePickerInput
          label="Break Time"
          value={breakTime as TimeValue | undefined}
          onChange={(time) => setBreakTime(time as TimeValue | null)}
          format="12"
          placeholder="Break time"
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <TimePickerInput
          label="End Time"
          value={endTime as TimeValue | undefined}
          onChange={(time) => setEndTime(time as TimeValue | null)}
          format="12"
          placeholder="Work ends at"
          minTime={{ hour: 12, minute: 0 }}
          maxTime={{ hour: 22, minute: 0 }}
        />
      </div>

      <button
        type="submit"
        style={{
          width: '100%',
          padding: '0.75rem',
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        Submit Schedule
      </button>
    </form>
  );
};

// Styles
const cardStyle: React.CSSProperties = {
  padding: '1.5rem',
  background: 'white',
  borderRadius: '0.75rem',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  border: '1px solid #e5e7eb',
};

const headingStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 600,
  marginBottom: '0.5rem',
  color: '#111827',
};

const descStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#6b7280',
  lineHeight: 1.5,
};

const infoBoxStyle: React.CSSProperties = {
  marginTop: '1rem',
  padding: '0.75rem',
  background: '#f0f9ff',
  borderRadius: '0.5rem',
  fontSize: '0.875rem',
  borderLeft: '3px solid #3b82f6',
};

export default TimePickerInputDemo;
