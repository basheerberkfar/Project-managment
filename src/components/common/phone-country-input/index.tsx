import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import {
  Controller,
  useController,
  useWatch,
  type Control,
  type FieldValues,
  type Path,
  type PathValue,
  type UseFormSetValue,
} from 'react-hook-form';
import clsx from 'clsx';
import { CaretDown, MagnifyingGlass } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import {
  FlagImage,
  defaultCountries,
  parseCountry,
  type CountryIso2,
  type ParsedCountry,
} from 'react-international-phone';
import 'react-international-phone/style.css';

type PhoneCountryInputProps<T extends FieldValues> = {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  codeName: Path<T>;
  countryIsoName?: Path<T>;
  phoneName: Path<T>;
  label: string;
  codeLabel: string;
  phoneLabel: string;
  searchPlaceholder: string;
  phonePlaceholder?: string;
  required?: boolean;
  disabled?: boolean;
  defaultCountry?: CountryIso2;
  wrapperClassName?: string;
  showErrorOnTouchedOnly?: boolean;
};

const COUNTRIES = defaultCountries.map((country) => parseCountry(country));

const normalizeDialCode = (dialCode?: string | null) => {
  if (!dialCode) return '';
  return dialCode.startsWith('+') ? dialCode : `+${dialCode}`;
};

const getCountryByDialCode = (dialCode?: string | null) => {
  const normalizedDialCode = normalizeDialCode(dialCode);
  return COUNTRIES.find(
    (country) => normalizeDialCode(country.dialCode) === normalizedDialCode
  );
};

const getLocalizedCountryName = (
  country: ParsedCountry,
  formatter?: Intl.DisplayNames | null
) => formatter?.of(country.iso2.toUpperCase()) ?? country.name;

const filterCountries = (
  countries: ParsedCountry[],
  term: string,
  getCountryName: (country: ParsedCountry) => string
) => {
  const normalizedTerm = term.trim().toLowerCase();
  if (!normalizedTerm) return countries;

  return countries.filter((country) => {
    const countryName = getCountryName(country).toLowerCase();
    const iso2 = country.iso2.toLowerCase();
    const dialCode = normalizeDialCode(country.dialCode).toLowerCase();

    return (
      countryName.includes(normalizedTerm) ||
      iso2.includes(normalizedTerm) ||
      dialCode.includes(normalizedTerm)
    );
  });
};

const PhoneCountryInput = <T extends FieldValues>({
  control,
  setValue,
  codeName,
  countryIsoName,
  phoneName,
  label,
  codeLabel,
  phoneLabel,
  searchPlaceholder,
  phonePlaceholder,
  required = false,
  disabled = false,
  defaultCountry = 'sy',
  wrapperClassName,
  showErrorOnTouchedOnly = true,
}: PhoneCountryInputProps<T>) => {
  const { i18n } = useTranslation();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const isArabic = i18n.language.startsWith('ar');

  const { fieldState: codeState } = useController({
    control,
    name: codeName,
  });
  const { fieldState: phoneState } = useController({
    control,
    name: phoneName,
  });
  const codeValue = useWatch({ control, name: codeName }) as string | null;
  const phoneValue = useWatch({ control, name: phoneName }) as string | null;

  const fallbackCountry =
    COUNTRIES.find((country) => country.iso2 === defaultCountry) ??
    COUNTRIES[0];
  const selectedCountry = getCountryByDialCode(codeValue) ?? fallbackCountry;
  const countryNameFormatter = useMemo(() => {
    try {
      return new Intl.DisplayNames([isArabic ? 'ar' : 'en'], {
        type: 'region',
      });
    } catch {
      return null;
    }
  }, [isArabic]);
  const getCountryName = useCallback(
    (country: ParsedCountry) =>
      getLocalizedCountryName(country, countryNameFormatter),
    [countryNameFormatter]
  );
  const filteredCountries = useMemo(
    () => filterCountries(COUNTRIES, searchTerm, getCountryName),
    [searchTerm, getCountryName]
  );

  useEffect(() => {
    if (!codeValue) {
      setValue(
        codeName,
        normalizeDialCode(selectedCountry.dialCode) as PathValue<T, Path<T>>,
        {
          shouldDirty: false,
        }
      );
    }
  }, [codeName, codeValue, selectedCountry.dialCode, setValue]);

  useEffect(() => {
    if (!countryIsoName) return;

    setValue(countryIsoName, selectedCountry.iso2 as PathValue<T, Path<T>>, {
      shouldDirty: false,
    });
  }, [countryIsoName, selectedCountry.iso2, setValue]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      window.setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const errorMessage = showErrorOnTouchedOnly
    ? phoneState.isTouched && phoneState.error?.message
      ? phoneState.error.message
      : codeState.isTouched && codeState.error?.message
        ? codeState.error.message
        : undefined
    : phoneState.error?.message || codeState.error?.message;
  const hasValue = Boolean(
    (phoneValue && String(phoneValue).trim()) ||
    (codeValue && String(codeValue).trim())
  );
  const shouldFloatLabel = isFocused || isOpen || hasValue;

  const handlePhoneKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && !isOpen) {
      event.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <div ref={rootRef} className={clsx('w-full', wrapperClassName)}>
      <div className="relative">
        <label
          className={clsx(
            'pointer-events-none absolute start-3 z-20 bg-white px-1.5 text-sm transition-all duration-200 select-none dark:bg-dark-card-background',
            shouldFloatLabel
              ? 'top-0 -translate-y-1/2 text-xs font-medium'
              : 'top-1/2 -translate-y-1/2',
            errorMessage
              ? 'text-danger-500'
              : isFocused || isOpen
                ? 'text-(--color-focus-primary)'
                : 'text-gray-light-700 dark:text-gray-dark-500'
          )}
        >
          {label}
          {required && <span className="ms-1 text-danger-500">*</span>}
        </label>

        <div
          className={clsx(
            'grid grid-cols-[112px_minmax(0,1fr)] overflow-hidden rounded-lg bg-white transition-all duration-200 dark:bg-dark-card-background',
            errorMessage
              ? 'border border-danger-500 ring-1 ring-danger-500/30'
              : 'border border-gray-light-500 hover:border-gray-light-600 dark:border-dark-card-border dark:hover:border-gray-dark-700 focus-within:border-(--color-focus-primary) focus-within:ring-1 focus-within:ring-(--color-focus-primary)/20'
          )}
        >
          <Controller
            name={codeName}
            control={control}
            render={({ field }) => (
              <button
                type="button"
                disabled={disabled}
                onClick={() =>
                  setIsOpen((prev) => {
                    const next = !prev;
                    if (!next) setSearchTerm('');
                    setIsFocused(next);
                    return next;
                  })
                }
                onFocus={() => setIsFocused(true)}
                className={clsx(
                  'flex min-h-[52px] items-center justify-between border-e px-3 text-sm transition-colors',
                  errorMessage
                    ? 'border-danger-500'
                    : 'border-gray-light-500 dark:border-dark-card-border',
                  disabled
                    ? 'cursor-not-allowed opacity-60'
                    : 'hover:bg-gray-light-100 dark:hover:bg-dark-card-surface'
                )}
                aria-label={codeLabel}
                onBlur={() => {
                  field.onBlur();
                  if (!isOpen) setIsFocused(false);
                }}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <FlagImage iso2={selectedCountry.iso2} size={20} />
                  <span
                    dir="ltr"
                    className="truncate font-medium text-gray-light-900 [unicode-bidi:plaintext] dark:text-white"
                  >
                    {normalizeDialCode(selectedCountry.dialCode)}
                  </span>
                </span>
                <CaretDown
                  size={14}
                  className={clsx(
                    'shrink-0 text-gray-light-700 transition-transform dark:text-gray-dark-500',
                    isOpen && 'rotate-180'
                  )}
                />
              </button>
            )}
          />

          <Controller
            name={phoneName}
            control={control}
            render={({ field }) => (
              <input
                ref={field.ref}
                type="tel"
                name={field.name}
                disabled={disabled}
                value={phoneValue ?? ''}
                placeholder={phonePlaceholder}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  field.onBlur();
                  if (!isOpen) setIsFocused(false);
                }}
                onKeyDown={handlePhoneKeyDown}
                onChange={(event) => field.onChange(event.target.value)}
                aria-label={phoneLabel}
                dir={isArabic ? 'rtl' : 'ltr'}
                className={clsx(
                  'min-h-[52px] w-full bg-white px-4 pb-3 pt-5 text-sm text-gray-light-900 outline-none transition-all placeholder:text-gray-light-700/75 focus:outline-none dark:bg-dark-card-background dark:text-white dark:placeholder:text-gray-dark-500',
                  isArabic
                    ? 'text-end placeholder:text-right'
                    : 'text-start placeholder:text-left',
                  disabled &&
                    'cursor-not-allowed bg-light-surface-disabled opacity-60 dark:bg-dark-surface-disabled'
                )}
                style={{
                  direction: isArabic ? 'rtl' : 'ltr',
                  textAlign: isArabic ? 'right' : 'left',
                }}
              />
            )}
          />
        </div>

        {isOpen && (
          <div className="absolute start-0 top-[calc(100%+8px)] z-50 w-full min-w-[280px] rounded-xl border border-gray-light-500 bg-white p-3 shadow-xl dark:border-dark-card-border dark:bg-dark-card-background">
            <div className="relative mb-3">
              <span className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-light-700 dark:text-gray-dark-500">
                <MagnifyingGlass size={16} />
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={searchPlaceholder}
                dir={isArabic ? 'rtl' : 'ltr'}
                className="min-h-[44px] w-full rounded-lg border border-gray-light-500 bg-white pe-4 ps-10 text-sm text-gray-light-900 outline-none transition-all [unicode-bidi:plaintext] focus:border-(--color-focus-primary) focus:ring-1 focus:ring-(--color-focus-primary)/20 dark:border-dark-card-border dark:bg-dark-card-background dark:text-white"
              />
            </div>

            <div className="max-h-64 overflow-y-auto">
              {filteredCountries.length === 0 ? (
                <div className="px-3 py-3 text-sm text-gray-light-700 dark:text-gray-dark-500">
                  -
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredCountries.map((country) => {
                    const dialCode = normalizeDialCode(country.dialCode);
                    const isSelected = country.iso2 === selectedCountry.iso2;

                    return (
                      <button
                        key={`${country.iso2}-${country.dialCode}`}
                        type="button"
                        onClick={() => {
                          setValue(
                            codeName,
                            dialCode as PathValue<T, Path<T>>,
                            {
                              shouldDirty: true,
                              shouldTouch: true,
                            }
                          );
                          if (countryIsoName) {
                            setValue(
                              countryIsoName,
                              country.iso2 as PathValue<T, Path<T>>,
                              {
                                shouldDirty: true,
                                shouldTouch: true,
                              }
                            );
                          }
                          setIsOpen(false);
                          setSearchTerm('');
                        }}
                        className={clsx(
                          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-start text-sm transition-colors',
                          isSelected
                            ? 'bg-primary-light-500/12 text-primary-light-500'
                            : 'text-gray-light-900 hover:bg-gray-light-100 dark:text-white dark:hover:bg-dark-card-surface'
                        )}
                      >
                        <FlagImage iso2={country.iso2} size={18} />
                        <span className="min-w-0 flex-1 truncate">
                          {getCountryName(country)}
                        </span>
                        <span
                          dir="ltr"
                          className="shrink-0 text-xs font-medium opacity-80 [unicode-bidi:plaintext]"
                        >
                          {dialCode}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {errorMessage && (
        <p className="mt-1.5 ps-1 text-xs font-medium text-danger-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default PhoneCountryInput;
