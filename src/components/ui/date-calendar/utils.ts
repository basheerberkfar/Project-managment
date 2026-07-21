export const MONTHS_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const MONTHS_AR = [
  'يناير',
  'فبراير',
  'مارس',
  'إبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

export const MONTHS_SHORT_EN = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const MONTHS_SHORT_AR = [
  'يناير',
  'فبراير',
  'مارس',
  'إبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

export const WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const WEEKDAYS_AR = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

export const WEEKDAYS_SHORT_EN = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
export const WEEKDAYS_SHORT_AR = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];

export const getMonths = (locale: 'en' | 'ar' = 'en') => {
  return locale === 'ar' ? MONTHS_AR : MONTHS_EN;
};

export const getMonthsShort = (locale: 'en' | 'ar' = 'en') => {
  return locale === 'ar' ? MONTHS_SHORT_AR : MONTHS_SHORT_EN;
};

export const getWeekdays = (locale: 'en' | 'ar' = 'en') => {
  return locale === 'ar' ? WEEKDAYS_AR : WEEKDAYS_EN;
};

export const getWeekdaysShort = (locale: 'en' | 'ar' = 'en') => {
  return locale === 'ar' ? WEEKDAYS_SHORT_AR : WEEKDAYS_SHORT_EN;
};

export const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isSameMonth = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
};

export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

export const isInRange = (
  date: Date,
  from: Date | null,
  to: Date | null
): boolean => {
  if (!from || !to) return false;
  const time = date.getTime();
  return time >= from.getTime() && time <= to.getTime();
};

export const isRangeStart = (date: Date, from: Date | null): boolean => {
  return isSameDay(date, from);
};

export const isRangeEnd = (date: Date, to: Date | null): boolean => {
  return isSameDay(date, to);
};

export const isDateDisabled = (
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  disabledDates?: Date[]
): boolean => {
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
  if (disabledDates?.some((d) => isSameDay(d, date))) return true;
  return false;
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

export const generateCalendarDays = (
  year: number,
  month: number
): (Date | null)[] => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const days: (Date | null)[] = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }

  return days;
};

export const addMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

export const addYears = (date: Date, years: number): Date => {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + years);
  return newDate;
};

export const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const endOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

export const generateYearRange = (
  startYear?: number,
  endYear?: number
): number[] => {
  const currentYear = new Date().getFullYear();
  const start = startYear || currentYear - 100;
  const end = endYear || currentYear + 50;
  const years: number[] = [];

  for (let year = end; year >= start; year--) {
    years.push(year);
  }

  return years;
};

export const formatDate = (
  date: Date | null,
  locale: 'en' | 'ar' = 'en'
): string => {
  if (!date) return '';

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  if (locale === 'ar') {
    return `${day} ${MONTHS_AR[month]} ${year}`;
  }

  return `${MONTHS_EN[month]} ${day}, ${year}`;
};

export const formatDateRange = (
  from: Date | null,
  to: Date | null,
  locale: 'en' | 'ar' = 'en'
): string => {
  if (!from && !to) return '';
  if (!to) return formatDate(from, locale);
  if (!from) return formatDate(to, locale);

  return `${formatDate(from, locale)} - ${formatDate(to, locale)}`;
};
