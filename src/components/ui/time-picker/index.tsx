/* eslint-disable react-refresh/only-export-components -- file exports component, types and utils */
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import type { TimePickerProps, TimeValue } from './types';
import { to12Hour, to24Hour, getCurrentTime, clampTime } from './utils';
import './time-picker.css';

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  format = '12',
  showSeconds = false,
  disabled = false,
  readOnly = false,
  minTime,
  maxTime,
  className,
  locale,
  minuteStep = 1,
  secondStep = 1,
}) => {
  const { t, i18n } = useTranslation();
  const currentLocale = (locale || i18n.language) as 'en' | 'ar';

  const [internalTime, setInternalTime] = useState<TimeValue>(
    value || getCurrentTime()
  );

  useEffect(() => {
    if (value) {
      setTimeout(() => {
        setInternalTime(value);
      }, 0);
    }
  }, [value]);

  const handleTimeChange = (newTime: TimeValue) => {
    if (disabled || readOnly) return;

    // Clamp to valid range
    const clampedTime = clampTime(newTime, minTime, maxTime);

    setInternalTime(clampedTime);
    onChange?.(clampedTime);
  };

  const handleHourChange = (delta: number) => {
    const newHour = (internalTime.hour + delta + 24) % 24;
    handleTimeChange({ ...internalTime, hour: newHour });
  };

  const handleMinuteChange = (delta: number) => {
    let newMinute = internalTime.minute + delta;
    let hourDelta = 0;

    if (newMinute >= 60) {
      hourDelta = Math.floor(newMinute / 60);
      newMinute = newMinute % 60;
    } else if (newMinute < 0) {
      hourDelta = Math.ceil((newMinute - 59) / 60);
      newMinute = ((newMinute % 60) + 60) % 60;
    }

    const newHour = (internalTime.hour + hourDelta + 24) % 24;
    handleTimeChange({ ...internalTime, hour: newHour, minute: newMinute });
  };

  const handleSecondChange = (delta: number) => {
    if (!showSeconds) return;

    let newSecond = (internalTime.second || 0) + delta;
    let minuteDelta = 0;

    if (newSecond >= 60) {
      minuteDelta = Math.floor(newSecond / 60);
      newSecond = newSecond % 60;
    } else if (newSecond < 0) {
      minuteDelta = Math.ceil((newSecond - 59) / 60);
      newSecond = ((newSecond % 60) + 60) % 60;
    }

    handleMinuteChange(minuteDelta * minuteStep);
    handleTimeChange({ ...internalTime, second: newSecond });
  };

  const handlePeriodChange = (period: 'am' | 'pm') => {
    if (format !== '12' || disabled || readOnly) return;

    const { period: currentPeriod } = to12Hour(internalTime.hour);
    if (currentPeriod === period) return;

    const newHour =
      period === 'pm'
        ? (internalTime.hour + 12) % 24
        : (internalTime.hour - 12 + 24) % 24;

    handleTimeChange({ ...internalTime, hour: newHour });
  };

  const handleSetNow = () => {
    const now = getCurrentTime();
    handleTimeChange(now);
  };

  const handleHourInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;

    const val = e.target.value;
    if (val === '') return;

    let hour = parseInt(val, 10);
    if (isNaN(hour)) return;

    if (format === '12') {
      const { period } = to12Hour(internalTime.hour);
      if (hour < 1) hour = 1;
      if (hour > 12) hour = 12;
      hour = to24Hour(hour, period);
    } else {
      if (hour < 0) hour = 0;
      if (hour > 23) hour = 23;
    }

    handleTimeChange({ ...internalTime, hour });
  };

  const handleMinuteInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;

    const val = e.target.value;
    if (val === '') return;

    let minute = parseInt(val, 10);
    if (isNaN(minute)) return;

    if (minute < 0) minute = 0;
    if (minute > 59) minute = 59;

    handleTimeChange({ ...internalTime, minute });
  };

  const handleSecondInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || readOnly || !showSeconds) return;

    const val = e.target.value;
    if (val === '') return;

    let second = parseInt(val, 10);
    if (isNaN(second)) return;

    if (second < 0) second = 0;
    if (second > 59) second = 59;

    handleTimeChange({ ...internalTime, second });
  };

  const { hour: displayHour, period } =
    format === '12'
      ? to12Hour(internalTime.hour)
      : { hour: internalTime.hour, period: null };

  return (
    <div
      dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
      className={clsx('time-picker', className, {
        'time-picker-disabled': disabled,
        'time-picker-readonly': readOnly,
        'time-picker-rtl': currentLocale === 'ar',
      })}
    >
      {/* Display Section with Editable Inputs */}
      <div className="time-picker-display">
        <div className="time-picker-display-input">
          <input
            type="number"
            value={String(displayHour).padStart(2, '0')}
            onChange={handleHourInputChange}
            disabled={disabled}
            readOnly={readOnly}
            min={format === '12' ? 1 : 0}
            max={format === '12' ? 12 : 23}
          />
        </div>

        <span className="time-picker-display-separator">:</span>

        <div className="time-picker-display-input">
          <input
            type="number"
            value={String(internalTime.minute).padStart(2, '0')}
            onChange={handleMinuteInputChange}
            disabled={disabled}
            readOnly={readOnly}
            min={0}
            max={59}
          />
        </div>

        {showSeconds && (
          <>
            <span className="time-picker-display-separator">:</span>
            <div className="time-picker-display-input">
              <input
                type="number"
                value={String(internalTime.second || 0).padStart(2, '0')}
                onChange={handleSecondInputChange}
                disabled={disabled}
                readOnly={readOnly}
                min={0}
                max={59}
              />
            </div>
          </>
        )}

        {format === '12' && (
          <div className="time-picker-display-period">
            <button
              type="button"
              className={clsx('time-picker-period-btn', {
                active: period === 'am',
              })}
              onClick={() => handlePeriodChange('am')}
              disabled={disabled || readOnly}
            >
              {t('time.am')}
            </button>
            <button
              type="button"
              className={clsx('time-picker-period-btn', {
                active: period === 'pm',
              })}
              onClick={() => handlePeriodChange('pm')}
              disabled={disabled || readOnly}
            >
              {t('time.pm')}
            </button>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="time-picker-controls">
        {/* Hour Controls */}
        <div className="time-picker-control-group">
          <div className="time-picker-control-label">{t('time.hour')}</div>
          <div className="time-picker-control-buttons">
            <button
              type="button"
              className="time-picker-control-btn"
              onClick={() => handleHourChange(1)}
              disabled={disabled || readOnly}
              aria-label="Increase hour"
            >
              ▲
            </button>
            <div className="time-picker-control-value">
              {String(displayHour).padStart(2, '0')}
            </div>
            <button
              type="button"
              className="time-picker-control-btn"
              onClick={() => handleHourChange(-1)}
              disabled={disabled || readOnly}
              aria-label="Decrease hour"
            >
              ▼
            </button>
          </div>
        </div>

        {/* Minute Controls */}
        <div className="time-picker-control-group">
          <div className="time-picker-control-label">{t('time.minute')}</div>
          <div className="time-picker-control-buttons">
            <button
              type="button"
              className="time-picker-control-btn"
              onClick={() => handleMinuteChange(minuteStep)}
              disabled={disabled || readOnly}
              aria-label="Increase minute"
            >
              ▲
            </button>
            <div className="time-picker-control-value">
              {String(internalTime.minute).padStart(2, '0')}
            </div>
            <button
              type="button"
              className="time-picker-control-btn"
              onClick={() => handleMinuteChange(-minuteStep)}
              disabled={disabled || readOnly}
              aria-label="Decrease minute"
            >
              ▼
            </button>
          </div>
        </div>

        {/* Second Controls */}
        {showSeconds && (
          <div className="time-picker-control-group">
            <div className="time-picker-control-label">{t('time.second')}</div>
            <div className="time-picker-control-buttons">
              <button
                type="button"
                className="time-picker-control-btn"
                onClick={() => handleSecondChange(secondStep)}
                disabled={disabled || readOnly}
                aria-label="Increase second"
              >
                ▲
              </button>
              <div className="time-picker-control-value">
                {String(internalTime.second || 0).padStart(2, '0')}
              </div>
              <button
                type="button"
                className="time-picker-control-btn"
                onClick={() => handleSecondChange(-secondStep)}
                disabled={disabled || readOnly}
                aria-label="Decrease second"
              >
                ▼
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="time-picker-footer">
        <button
          type="button"
          className="time-picker-footer-btn"
          onClick={handleSetNow}
          disabled={disabled || readOnly}
        >
          {t('time.now')}
        </button>
      </div>
    </div>
  );
};

export default TimePicker;

// Export TimeInput component (standalone text input)
export { default as TimeInput } from './time-input';

// Export TimePickerInput component (input with dropdown picker - recommended)
export { default as TimePickerInput } from './time-picker-input';

// Export types
export type {
  TimePickerProps,
  TimeValue,
  TimeFormat,
  TimeInputProps,
} from './types';

// Export utils
export {
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
} from './utils';
