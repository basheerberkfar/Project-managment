import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

type BackendErrors = Record<string, string[] | string | null | undefined>;

const FIELD_NAME_ALIASES: Record<string, string> = {
  permession_ids: 'permissions_ids',
  permission_ids: 'permissions_ids',
  permissions: 'permissions_ids',
  name: 'title',
};

type HandleFormErrorsOptions<TFieldValues extends FieldValues> = {
  error: unknown;
  setError?: UseFormSetError<TFieldValues>;
  fieldMap?: Partial<Record<string, Path<TFieldValues>>>;
  toast?: (message: string) => void;
  fallbackMessage?: string;
  setFormError?: (message: string) => void;
};

const FORM_LEVEL_ERROR_KEYS = new Set([
  'error',
  'message',
  'detail',
  'non_field_errors',
  'general',
]);

const extractBackendErrors = (error: unknown): BackendErrors | null => {
  const backendErrors = (
    error as { response?: { data?: { errors?: BackendErrors } } }
  )?.response?.data?.errors;

  if (
    !backendErrors ||
    typeof backendErrors !== 'object' ||
    Array.isArray(backendErrors)
  ) {
    return null;
  }

  return backendErrors;
};

const extractResponseMessage = (error: unknown): string | null => {
  const data = (error as { response?: { data?: unknown } })?.response?.data;

  if (!data || typeof data !== 'object') return null;

  const payload = data as {
    message?: unknown;
    error?: unknown;
    detail?: unknown;
  };

  const message = payload.message ?? payload.error ?? payload.detail;

  if (typeof message === 'string' && message.trim()) {
    return message.trim();
  }

  return null;
};

const resolveFieldName = <TFieldValues extends FieldValues>(
  key: string,
  fieldMap?: Partial<Record<string, Path<TFieldValues>>>
) => {
  const normalizedKey = FIELD_NAME_ALIASES[key] ?? key;

  return (
    fieldMap?.[key] ??
    fieldMap?.[normalizedKey] ??
    (normalizedKey as Path<TFieldValues>)
  );
};

export const handleFormErrors = <TFieldValues extends FieldValues>({
  error,
  setError,
  fieldMap,
  toast,
  fallbackMessage = 'Operation failed',
  setFormError,
}: HandleFormErrorsOptions<TFieldValues>) => {
  const responseMessage = extractResponseMessage(error);
  const backendErrors = extractBackendErrors(error);
  let hasToastedFieldError = false;

  if (backendErrors) {
    Object.entries(backendErrors).forEach(([key, value]) => {
      const firstMessage = Array.isArray(value)
        ? (value[0] ?? fallbackMessage)
        : typeof value === 'string' && value.trim()
          ? value
          : fallbackMessage;

      if (FORM_LEVEL_ERROR_KEYS.has(key)) {
        setFormError?.(firstMessage);
        toast?.(firstMessage);
        return;
      }

      const fieldName = resolveFieldName(key, fieldMap);

      if ((Array.isArray(value) || typeof value === 'string') && setError) {
        setError(fieldName, {
          type: 'manual',
          message: firstMessage,
        });
        if (!hasToastedFieldError) {
          toast?.(firstMessage);
          hasToastedFieldError = true;
        }
        return;
      }

      if (value) {
        setFormError?.(firstMessage);
        toast?.(firstMessage);
        return;
      }

      setFormError?.(fallbackMessage);
      toast?.(fallbackMessage);
    });

    return;
  }

  const message =
    responseMessage ??
    (error instanceof Error ? error.message : null) ??
    fallbackMessage;

  setFormError?.(message);
  toast?.(message);
};
