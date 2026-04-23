import {
  defaultCountries,
  parseCountry,
  type CountryIso2,
} from 'react-international-phone';
import parsePhoneNumberFromString, {
  getCountryCallingCode,
  isSupportedCountry,
  type CountryCode,
} from 'libphonenumber-js/min';

const PHONE_COUNTRIES = defaultCountries.map((country) =>
  parseCountry(country)
);

export const normalizeDialCode = (dialCode?: string | null) => {
  if (!dialCode) return '';
  return dialCode.startsWith('+') ? dialCode : `+${dialCode}`;
};

export const splitStoredPhoneNumber = (
  phoneNumber?: string | null,
  defaultCountry: CountryIso2 = 'iq'
) => {
  const normalizedPhone = phoneNumber?.trim() ?? '';

  const fallbackCountry =
    PHONE_COUNTRIES.find((country) => country.iso2 === defaultCountry) ??
    PHONE_COUNTRIES[0];

  if (!normalizedPhone) {
    return {
      phone_country_iso2: fallbackCountry.iso2,
      phone_country_code: normalizeDialCode(fallbackCountry.dialCode),
      phone_number: '',
    };
  }

  const parsed = parsePhoneNumberFromString(normalizedPhone);

  if (!parsed || !parsed.isValid()) {
    return {
      phone_country_iso2: fallbackCountry.iso2,
      phone_country_code: normalizeDialCode(fallbackCountry.dialCode),
      phone_number: normalizedPhone.replace(/^\+/, ''),
    };
  }

  return {
    phone_country_iso2: parsed.country?.toLowerCase() ?? fallbackCountry.iso2,
    phone_country_code: normalizeDialCode(parsed.countryCallingCode),
    phone_number: parsed.nationalNumber,
  };
};

export const composePhoneNumber = (
  phoneCountryCode?: string | null,
  phoneNumber?: string | null
) => {
  const normalizedPhoneNumber = (phoneNumber ?? '').replace(/[^\d]/g, '');
  if (!normalizedPhoneNumber) return null;

  const normalizedCode = normalizeDialCode(phoneCountryCode).replace(
    /[^\d+]/g,
    ''
  );

  return `${normalizedCode}${normalizedPhoneNumber}`;
};

export const isValidPhoneForSelectedCountry = ({
  phoneCountryIso2,
  phoneCountryCode,
  phoneNumber,
}: {
  phoneCountryIso2?: string | null;
  phoneCountryCode?: string | null;
  phoneNumber?: string | null;
}) => {
  const normalizedPhone = phoneNumber?.trim() ?? '';
  if (!normalizedPhone) return true;

  const normalizedIso2 = phoneCountryIso2?.trim()?.toUpperCase();
  const normalizedDialCode = phoneCountryCode?.trim()?.replace(/[^\d]/g, '');

  if (!normalizedIso2 || !isSupportedCountry(normalizedIso2)) {
    return false;
  }

  const countryCode = normalizedIso2 as CountryCode;

  if (getCountryCallingCode(countryCode) !== normalizedDialCode) {
    return false;
  }

  const nationalPhone = normalizedPhone.replace(/\s+/g, '').replace(/^0+/, '');
  const fullPhone = `+${normalizedDialCode}${nationalPhone}`;
  const parsedPhone = parsePhoneNumberFromString(fullPhone);

  if (!parsedPhone?.isValid()) {
    return false;
  }

  if (parsedPhone.country && parsedPhone.country !== countryCode) {
    return false;
  }

  return true;
};
