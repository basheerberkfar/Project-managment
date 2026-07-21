import React, { useState } from 'react';
import TimePicker from './index';
import TimeInput from './time-input';
import type { TimeValue } from './types';
import { formatTime, getCurrentTime } from './utils';

/**
 * Example 1: Basic Time Picker (12-hour format)
 */
export const BasicTimePicker: React.FC = () => {
  const [time, setTime] = useState<TimeValue>(getCurrentTime());

  return (
    <div style={{ padding: '2rem' }}>
      <h3>Basic Time Picker (12-hour)</h3>
      <TimePicker value={time} onChange={setTime} format="12" />
      <p style={{ marginTop: '1rem' }}>
        Selected time: {formatTime(time, '12', false, 'en')}
      </p>
    </div>
  );
};

/**
 * Example 2: 24-hour Format
 */
export const TimePicker24Hour: React.FC = () => {
  const [time, setTime] = useState<TimeValue>({ hour: 14, minute: 30 });

  return (
    <div style={{ padding: '2rem' }}>
      <h3>24-hour Format</h3>
      <TimePicker value={time} onChange={setTime} format="24" />
      <p style={{ marginTop: '1rem' }}>
        Selected time: {formatTime(time, '24', false, 'en')}
      </p>
    </div>
  );
};

/**
 * Example 3: With Seconds
 */
export const TimePickerWithSeconds: React.FC = () => {
  const [time, setTime] = useState<TimeValue>({
    hour: 10,
    minute: 30,
    second: 45,
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h3>With Seconds</h3>
      <TimePicker value={time} onChange={setTime} format="12" showSeconds />
      <p style={{ marginTop: '1rem' }}>
        Selected time: {formatTime(time, '12', true, 'en')}
      </p>
    </div>
  );
};

/**
 * Example 4: RTL (Arabic)
 */
export const TimePickerRTL: React.FC = () => {
  const [time, setTime] = useState<TimeValue>({ hour: 15, minute: 45 });

  return (
    <div style={{ padding: '2rem' }}>
      <h3>RTL (Arabic)</h3>
      <TimePicker value={time} onChange={setTime} format="12" locale="ar" />
      <p style={{ marginTop: '1rem', direction: 'rtl' }}>
        الوقت المحدد: {formatTime(time, '12', false, 'ar')}
      </p>
    </div>
  );
};

/**
 * Example 5: With Time Restrictions
 */
export const TimePickerWithRestrictions: React.FC = () => {
  const [time, setTime] = useState<TimeValue>({ hour: 12, minute: 0 });

  return (
    <div style={{ padding: '2rem' }}>
      <h3>With Time Restrictions (9 AM - 5 PM)</h3>
      <TimePicker
        value={time}
        onChange={setTime}
        format="12"
        minTime={{ hour: 9, minute: 0 }}
        maxTime={{ hour: 17, minute: 0 }}
      />
      <p style={{ marginTop: '1rem' }}>
        Selected time: {formatTime(time, '12', false, 'en')}
      </p>
    </div>
  );
};

/**
 * Example 6: Disabled State
 */
export const TimePickerDisabled: React.FC = () => {
  const [time] = useState<TimeValue>({ hour: 10, minute: 30 });

  return (
    <div style={{ padding: '2rem' }}>
      <h3>Disabled</h3>
      <TimePicker value={time} format="12" disabled />
    </div>
  );
};

/**
 * Example 7: Read-Only State
 */
export const TimePickerReadOnly: React.FC = () => {
  const [time] = useState<TimeValue>({ hour: 10, minute: 30 });

  return (
    <div style={{ padding: '2rem' }}>
      <h3>Read-Only</h3>
      <TimePicker value={time} format="12" readOnly />
    </div>
  );
};

/**
 * Example 8: Time Input Field
 */
export const BasicTimeInput: React.FC = () => {
  const [time, setTime] = useState<TimeValue>({ hour: 14, minute: 30 });

  return (
    <div style={{ padding: '2rem' }}>
      <h3>Time Input Field</h3>
      <TimeInput value={time} onChange={setTime} format="12" />
      <p style={{ marginTop: '1rem' }}>
        Selected time: {time ? formatTime(time, '12', false, 'en') : 'None'}
      </p>
      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
        Try typing: "3:45 PM" or "03:45 PM"
      </p>
    </div>
  );
};

/**
 * Example 9: Time Input with 24-hour Format
 */
export const TimeInput24Hour: React.FC = () => {
  const [time, setTime] = useState<TimeValue>({ hour: 14, minute: 30 });

  return (
    <div style={{ padding: '2rem' }}>
      <h3>Time Input (24-hour)</h3>
      <TimeInput value={time} onChange={setTime} format="24" />
      <p style={{ marginTop: '1rem' }}>
        Selected time: {time ? formatTime(time, '24', false, 'en') : 'None'}
      </p>
      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
        Try typing: "15:45" or "3:45"
      </p>
    </div>
  );
};

/**
 * Example 10: Time Input with Seconds
 */
export const TimeInputWithSeconds: React.FC = () => {
  const [time, setTime] = useState<TimeValue>({
    hour: 14,
    minute: 30,
    second: 15,
  });

  return (
    <div style={{ padding: '2rem' }}>
      <h3>Time Input with Seconds</h3>
      <TimeInput value={time} onChange={setTime} format="12" showSeconds />
      <p style={{ marginTop: '1rem' }}>
        Selected time: {time ? formatTime(time, '12', true, 'en') : 'None'}
      </p>
      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
        Try typing: "3:45:30 PM"
      </p>
    </div>
  );
};

/**
 * Example 11: Minute Step
 */
export const TimePickerMinuteStep: React.FC = () => {
  const [time, setTime] = useState<TimeValue>({ hour: 10, minute: 0 });

  return (
    <div style={{ padding: '2rem' }}>
      <h3>Minute Step (15 minutes)</h3>
      <TimePicker value={time} onChange={setTime} format="12" minuteStep={15} />
      <p style={{ marginTop: '1rem' }}>
        Selected time: {formatTime(time, '12', false, 'en')}
      </p>
    </div>
  );
};

/**
 * Example 12: Complete Demo with Both Components
 */
export const CompleteDemo: React.FC = () => {
  const [time, setTime] = useState<TimeValue>({ hour: 14, minute: 30 });
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div style={{ padding: '2rem' }}>
      <h3>Complete Time Selection Demo</h3>

      <div style={{ marginBottom: '1rem' }}>
        <label
          style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}
        >
          Select Time:
        </label>
        <TimeInput
          value={time}
          onChange={setTime}
          format="12"
          placeholder="Click to select time"
        />
      </div>

      <button
        onClick={() => setShowPicker(!showPicker)}
        style={{
          padding: '0.5rem 1rem',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          marginBottom: '1rem',
        }}
      >
        {showPicker ? 'Hide Picker' : 'Show Picker'}
      </button>

      {showPicker && (
        <div style={{ marginTop: '1rem' }}>
          <TimePicker
            value={time}
            onChange={(newTime) => {
              setTime(newTime);
            }}
            format="12"
          />
        </div>
      )}

      <div
        style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#f9fafb',
          borderRadius: '0.375rem',
        }}
      >
        <strong>Selected Time:</strong>
        <p style={{ margin: '0.5rem 0 0 0' }}>
          12-hour: {formatTime(time, '12', false, 'en')}
        </p>
        <p style={{ margin: '0.5rem 0 0 0' }}>
          24-hour: {formatTime(time, '24', false, 'en')}
        </p>
        <p style={{ margin: '0.5rem 0 0 0' }}>Object: {JSON.stringify(time)}</p>
      </div>
    </div>
  );
};

/**
 * Example 13: All Examples Combined
 */
export const AllExamples: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
        padding: '2rem',
      }}
    >
      <BasicTimePicker />
      <TimePicker24Hour />
      <TimePickerWithSeconds />
      <TimePickerRTL />
      <TimePickerWithRestrictions />
      <TimePickerDisabled />
      <TimePickerReadOnly />
      <BasicTimeInput />
      <TimeInput24Hour />
      <TimeInputWithSeconds />
      <TimePickerMinuteStep />
      <CompleteDemo />
    </div>
  );
};

export default AllExamples;
