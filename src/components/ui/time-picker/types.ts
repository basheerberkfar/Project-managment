export interface TimeValue {
  hour: number; // 0-23 (24-hour format internally)
  minute: number; // 0-59
  second?: number; // 0-59 (optional)
}

export type TimeFormat = '12' | '24';

export interface TimePickerProps {
  value?: TimeValue;
  onChange?: (time: TimeValue) => void;
  format?: TimeFormat;
  showSeconds?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  minTime?: TimeValue;
  maxTime?: TimeValue;
  className?: string;
  locale?: 'en' | 'ar';
  minuteStep?: number; // Default: 1
  secondStep?: number; // Default: 1
}

export interface TimeInputProps {
  value?: TimeValue;
  onChange?: (time: TimeValue) => void;
  format?: TimeFormat;
  showSeconds?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  locale?: 'en' | 'ar';
  placeholder?: string;
}
