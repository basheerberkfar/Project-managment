import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import type { TimeInputProps, TimeValue } from './types';
import { formatTime, parseTime } from './utils';
import './time-picker.css';

const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  format = '12',
  showSeconds = false,
  disabled = false,
  readOnly = false,
  className,
  locale,
  placeholder,
}) => {
  const { t, i18n } = useTranslation();
  const currentLocale = (locale || i18n.language) as 'en' | 'ar';
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState<string>(() => {
    return value ? formatTime(value, format, showSeconds, currentLocale) : '';
  });

  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused && value) {
      setTimeout(() => {
        setInputValue(formatTime(value, format, showSeconds, currentLocale));
      }, 0);
    }
  }, [value, format, showSeconds, currentLocale, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return;
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    setIsFocused(false);

    if (!inputValue.trim()) {
      onChange?.(undefined as unknown as TimeValue);
      return;
    }

    const parsedTime = parseTime(inputValue, format);

    if (parsedTime) {
      onChange?.(parsedTime);
      setInputValue(formatTime(parsedTime, format, showSeconds, currentLocale));
    } else {
      // Invalid input, reset to previous value
      if (value) {
        setInputValue(formatTime(value, format, showSeconds, currentLocale));
      } else {
        setInputValue('');
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      if (value) {
        setInputValue(formatTime(value, format, showSeconds, currentLocale));
      } else {
        setInputValue('');
      }
      inputRef.current?.blur();
    }
  };

  const defaultPlaceholder =
    placeholder ||
    (format === '12'
      ? showSeconds
        ? '12:00:00 PM'
        : '12:00 PM'
      : showSeconds
        ? '00:00:00'
        : '00:00');

  return (
    <div
      className={clsx('time-input', className, {
        'time-input-rtl': currentLocale === 'ar',
      })}
    >
      <input
        ref={inputRef}
        type="text"
        className="time-input-field"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={defaultPlaceholder}
        aria-label={t('time.select-time')}
      />
    </div>
  );
};

export default TimeInput;
