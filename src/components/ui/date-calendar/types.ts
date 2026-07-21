export type DateValue = Date | null | undefined;

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export type CalendarMode = 'single' | 'range';
export type CalendarView = 'day' | 'month' | 'year';

export interface CalendarProps {
  mode?: CalendarMode;
  value?: DateValue;
  rangeValue?: DateRange;
  onChange?: (date: DateValue) => void;
  onRangeChange?: (range: DateRange) => void;
  disabled?: boolean;
  readOnly?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  className?: string;
  views?: CalendarView[];
  defaultView?: CalendarView;
  locale?: 'en' | 'ar';
}

export interface CalendarHeaderProps {
  displayMonth: Date;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onMonthChange: (month: Date) => void;
  onPrevious: () => void;
  onNext: () => void;
  locale?: 'en' | 'ar';
  minDate?: Date;
  maxDate?: Date;
}

export interface CalendarGridProps {
  displayMonth: Date;
  mode: CalendarMode;
  value?: DateValue;
  rangeValue?: DateRange;
  onSelect: (date: Date) => void;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  locale?: 'en' | 'ar';
  hoveredDate?: Date | null;
  onHoverDate?: (date: Date | null) => void;
}

export interface MonthGridProps {
  displayYear: number;
  value?: Date;
  onSelect: (month: number) => void;
  locale?: 'en' | 'ar';
  minDate?: Date;
  maxDate?: Date;
}

export interface YearGridProps {
  value?: Date;
  onSelect: (year: number) => void;
  minDate?: Date;
  maxDate?: Date;
}
