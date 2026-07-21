import type { TimeValue } from './types';

/**
 * Convert 24-hour to 12-hour format
 */
export const to12Hour = (
  hour: number
): { hour: number; period: 'am' | 'pm' } => {
  if (hour === 0) {
    return { hour: 12, period: 'am' };
  } else if (hour < 12) {
    return { hour, period: 'am' };
  } else if (hour === 12) {
    return { hour: 12, period: 'pm' };
  } else {
    return { hour: hour - 12, period: 'pm' };
  }
};

/**
 * Convert 12-hour to 24-hour format
 */
export const to24Hour = (hour: number, period: 'am' | 'pm'): number => {
  if (period === 'am') {
    return hour === 12 ? 0 : hour;
  } else {
    return hour === 12 ? 12 : hour + 12;
  }
};

/**
 * Format time value to string
 */
export const formatTime = (
  time: TimeValue,
  format: '12' | '24',
  showSeconds: boolean = false,
  locale: 'en' | 'ar' = 'en'
): string => {
  let hourDisplay: number;
  let period = '';

  if (format === '12') {
    const { hour, period: nextPeriod } = to12Hour(time.hour);
    hourDisplay = hour;
    period =
      locale === 'ar'
        ? nextPeriod === 'am'
          ? ' ص'
          : ' م'
        : ` ${nextPeriod.toUpperCase()}`;
  } else {
    hourDisplay = time.hour;
  }

  const hourStr = String(hourDisplay).padStart(2, '0');
  const minuteStr = String(time.minute).padStart(2, '0');

  let result = `${hourStr}:${minuteStr}`;

  if (showSeconds && time.second !== undefined) {
    const secondStr = String(time.second).padStart(2, '0');
    result += `:${secondStr}`;
  }

  return result + period;
};

/**
 * Parse time string to TimeValue
 */
export const parseTime = (
  timeStr: string,
  format: '12' | '24'
): TimeValue | null => {
  if (!timeStr) return null;

  // Remove AM/PM indicators in both English and Arabic.
  const cleanTime = timeStr
    .replace(/\s*(am|pm|صباحًا|مساءً|ص|م)\s*/gi, '')
    .trim();

  const isPM = /pm|مساءً|م/i.test(timeStr);
  const isAM = /am|صباحًا|ص/i.test(timeStr);

  const parts = cleanTime.split(':').map((p) => parseInt(p.trim(), 10));

  if (parts.length < 2 || parts.some(isNaN)) {
    return null;
  }

  let hour = parts[0];
  const minute = parts[1];
  const second = parts[2];

  if (minute < 0 || minute > 59) return null;
  if (second !== undefined && (second < 0 || second > 59)) return null;

  if (format === '12') {
    if (hour < 1 || hour > 12) return null;
    if (isPM || isAM) {
      hour = to24Hour(hour, isPM ? 'pm' : 'am');
    }
  } else {
    if (hour < 0 || hour > 23) return null;
  }

  return {
    hour,
    minute,
    second,
  };
};

/**
 * Get current time
 */
export const getCurrentTime = (): TimeValue => {
  const now = new Date();
  return {
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds(),
  };
};

/**
 * Compare two times
 */
export const compareTime = (time1: TimeValue, time2: TimeValue): number => {
  if (time1.hour !== time2.hour) {
    return time1.hour - time2.hour;
  }
  if (time1.minute !== time2.minute) {
    return time1.minute - time2.minute;
  }
  if (time1.second !== undefined && time2.second !== undefined) {
    return time1.second - time2.second;
  }
  return 0;
};

/**
 * Check if time is within range
 */
export const isTimeInRange = (
  time: TimeValue,
  minTime?: TimeValue,
  maxTime?: TimeValue
): boolean => {
  if (minTime && compareTime(time, minTime) < 0) {
    return false;
  }
  if (maxTime && compareTime(time, maxTime) > 0) {
    return false;
  }
  return true;
};

/**
 * Clamp time to valid range
 */
export const clampTime = (
  time: TimeValue,
  minTime?: TimeValue,
  maxTime?: TimeValue
): TimeValue => {
  let result = { ...time };

  if (minTime && compareTime(result, minTime) < 0) {
    result = { ...minTime };
  }

  if (maxTime && compareTime(result, maxTime) > 0) {
    result = { ...maxTime };
  }

  return result;
};

/**
 * Create time value from date
 */
export const timeFromDate = (date: Date): TimeValue => {
  return {
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
  };
};

/**
 * Apply time to date
 */
export const applyTimeToDate = (date: Date, time: TimeValue): Date => {
  const newDate = new Date(date);
  newDate.setHours(time.hour);
  newDate.setMinutes(time.minute);
  if (time.second !== undefined) {
    newDate.setSeconds(time.second);
  }
  return newDate;
};
