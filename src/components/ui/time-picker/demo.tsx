import React, { useState } from 'react';
import TimePicker from './index';
import TimeInput from './time-input';
import type { TimeValue } from './types';
import { formatTime } from './utils';

/**
 * Interactive Demo Page for Time Picker Component
 */
const TimePickerDemo: React.FC = () => {
  const [time12, setTime12] = useState<TimeValue>({ hour: 14, minute: 30 });
  const [time24, setTime24] = useState<TimeValue>({ hour: 14, minute: 30 });
  const [timeWithSeconds, setTimeWithSeconds] = useState<TimeValue>({
    hour: 10,
    minute: 30,
    second: 45,
  });
  const [timeArabic, setTimeArabic] = useState<TimeValue>({
    hour: 15,
    minute: 45,
  });
  const [timeRestricted, setTimeRestricted] = useState<TimeValue>({
    hour: 12,
    minute: 0,
  });
  const [timeInput, setTimeInput] = useState<TimeValue>({
    hour: 14,
    minute: 30,
  });
  const [timeStep, setTimeStep] = useState<TimeValue>({ hour: 10, minute: 0 });

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1
          style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#111827' }}
        >
          Time Picker Component Demo
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          A comprehensive time picker with 12/24 hour formats, RTL support, and
          editable inputs
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
        }}
      >
        {/* 12-Hour Format */}
        <section style={cardStyle}>
          <h2 style={headingStyle}>12-Hour Format</h2>
          <p style={descStyle}>
            Standard 12-hour time format with AM/PM selection. Click on the time
            to edit directly.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <TimePicker value={time12} onChange={setTime12} format="12" />
          </div>
          <div style={infoBoxStyle}>
            <strong>Selected:</strong> {formatTime(time12, '12', false, 'en')}
          </div>
        </section>

        {/* 24-Hour Format */}
        <section style={cardStyle}>
          <h2 style={headingStyle}>24-Hour Format</h2>
          <p style={descStyle}>
            Military time format (00:00 - 23:59) without AM/PM indicators.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <TimePicker value={time24} onChange={setTime24} format="24" />
          </div>
          <div style={infoBoxStyle}>
            <strong>Selected:</strong> {formatTime(time24, '24', false, 'en')}
          </div>
        </section>

        {/* With Seconds */}
        <section style={cardStyle}>
          <h2 style={headingStyle}>With Seconds</h2>
          <p style={descStyle}>
            Includes seconds for more precise time selection.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <TimePicker
              value={timeWithSeconds}
              onChange={setTimeWithSeconds}
              format="12"
              showSeconds
            />
          </div>
          <div style={infoBoxStyle}>
            <strong>Selected:</strong>{' '}
            {formatTime(timeWithSeconds, '12', true, 'en')}
          </div>
        </section>

        {/* RTL (Arabic) */}
        <section style={cardStyle}>
          <h2 style={headingStyle}>RTL Support (Arabic)</h2>
          <p style={descStyle}>
            Full support for right-to-left languages with localized labels.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <TimePicker
              value={timeArabic}
              onChange={setTimeArabic}
              format="12"
              locale="ar"
            />
          </div>
          <div style={{ ...infoBoxStyle, direction: 'rtl' }}>
            <strong>الوقت المحدد:</strong>{' '}
            {formatTime(timeArabic, '12', false, 'ar')}
          </div>
        </section>

        {/* Time Restrictions */}
        <section style={cardStyle}>
          <h2 style={headingStyle}>Time Restrictions</h2>
          <p style={descStyle}>
            Limit time selection to business hours (9 AM - 5 PM).
          </p>
          <div style={{ marginTop: '1rem' }}>
            <TimePicker
              value={timeRestricted}
              onChange={setTimeRestricted}
              format="12"
              minTime={{ hour: 9, minute: 0 }}
              maxTime={{ hour: 17, minute: 0 }}
            />
          </div>
          <div style={infoBoxStyle}>
            <strong>Selected:</strong>{' '}
            {formatTime(timeRestricted, '12', false, 'en')}
            <br />
            <small style={{ color: '#6b7280' }}>Range: 9:00 AM - 5:00 PM</small>
          </div>
        </section>

        {/* Time Input */}
        <section style={cardStyle}>
          <h2 style={headingStyle}>Time Input Field</h2>
          <p style={descStyle}>
            Type time directly in various formats. Supports "3:45 PM", "03:45
            PM", etc.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <TimeInput
              value={timeInput}
              onChange={setTimeInput}
              format="12"
              placeholder="Enter time (e.g., 3:45 PM)"
            />
          </div>
          <div style={infoBoxStyle}>
            <strong>Selected:</strong>{' '}
            {timeInput ? formatTime(timeInput, '12', false, 'en') : 'None'}
            <br />
            <small style={{ color: '#6b7280' }}>
              Try: "11:30 AM" or "23:45"
            </small>
          </div>
        </section>

        {/* Minute Steps */}
        <section style={cardStyle}>
          <h2 style={headingStyle}>Minute Steps</h2>
          <p style={descStyle}>
            Increment minutes in 15-minute intervals for appointment scheduling.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <TimePicker
              value={timeStep}
              onChange={setTimeStep}
              format="12"
              minuteStep={15}
            />
          </div>
          <div style={infoBoxStyle}>
            <strong>Selected:</strong> {formatTime(timeStep, '12', false, 'en')}
            <br />
            <small style={{ color: '#6b7280' }}>Step: 15 minutes</small>
          </div>
        </section>

        {/* Disabled State */}
        <section style={cardStyle}>
          <h2 style={headingStyle}>Disabled State</h2>
          <p style={descStyle}>
            Non-interactive state for display-only scenarios.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <TimePicker value={{ hour: 10, minute: 30 }} format="12" disabled />
          </div>
        </section>

        {/* Read-Only State */}
        <section style={cardStyle}>
          <h2 style={headingStyle}>Read-Only State</h2>
          <p style={descStyle}>Display time without allowing modifications.</p>
          <div style={{ marginTop: '1rem' }}>
            <TimePicker value={{ hour: 10, minute: 30 }} format="12" readOnly />
          </div>
        </section>
      </div>

      {/* Features Section */}
      <section style={{ marginTop: '4rem', textAlign: 'center' }}>
        <h2
          style={{ fontSize: '2rem', marginBottom: '2rem', color: '#111827' }}
        >
          Key Features
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            textAlign: 'left',
          }}
        >
          <div style={featureCardStyle}>
            <div style={featureIconStyle}>⏰</div>
            <h3 style={featureTitleStyle}>12/24 Hour Formats</h3>
            <p style={featureDescStyle}>
              Switch between standard and military time formats seamlessly.
            </p>
          </div>
          <div style={featureCardStyle}>
            <div style={featureIconStyle}>✍️</div>
            <h3 style={featureTitleStyle}>Editable Inputs</h3>
            <p style={featureDescStyle}>
              Click any time component to type directly for quick entry.
            </p>
          </div>
          <div style={featureCardStyle}>
            <div style={featureIconStyle}>🌍</div>
            <h3 style={featureTitleStyle}>RTL Support</h3>
            <p style={featureDescStyle}>
              Full right-to-left support for Arabic and other RTL languages.
            </p>
          </div>
          <div style={featureCardStyle}>
            <div style={featureIconStyle}>⌨️</div>
            <h3 style={featureTitleStyle}>Keyboard Navigation</h3>
            <p style={featureDescStyle}>
              Complete keyboard support for accessibility and efficiency.
            </p>
          </div>
          <div style={featureCardStyle}>
            <div style={featureIconStyle}>🎯</div>
            <h3 style={featureTitleStyle}>Time Restrictions</h3>
            <p style={featureDescStyle}>
              Set min/max time limits for controlled selection.
            </p>
          </div>
          <div style={featureCardStyle}>
            <div style={featureIconStyle}>📱</div>
            <h3 style={featureTitleStyle}>Responsive</h3>
            <p style={featureDescStyle}>
              Works perfectly on desktop, tablet, and mobile devices.
            </p>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
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
            borderRadius: '0.5rem',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            overflow: 'auto',
          }}
        >
          <pre style={{ margin: 0 }}>{`import { useState } from 'react';
import TimePicker from '@/components/ui/time-picker';

function MyComponent() {
  const [time, setTime] = useState({ hour: 14, minute: 30 });

  return (
    <TimePicker
      value={time}
      onChange={setTime}
      format="12"
    />
  );
}`}</pre>
        </div>
      </section>
    </div>
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
  background: '#f9fafb',
  borderRadius: '0.375rem',
  fontSize: '0.875rem',
  borderLeft: '3px solid #3b82f6',
};

const featureCardStyle: React.CSSProperties = {
  padding: '1.5rem',
  background: '#f9fafb',
  borderRadius: '0.5rem',
  border: '1px solid #e5e7eb',
};

const featureIconStyle: React.CSSProperties = {
  fontSize: '2rem',
  marginBottom: '0.75rem',
};

const featureTitleStyle: React.CSSProperties = {
  fontSize: '1.125rem',
  fontWeight: 600,
  marginBottom: '0.5rem',
  color: '#111827',
};

const featureDescStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#6b7280',
  lineHeight: 1.5,
};

export default TimePickerDemo;
