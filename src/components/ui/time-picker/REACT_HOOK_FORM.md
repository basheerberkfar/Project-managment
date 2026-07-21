# استخدام TimePickerInput مع React Hook Form

## الاستخدام الأساسي

```tsx
import { useForm } from 'react-hook-form';
import { TimePickerInput } from '@/components/ui/time-picker';
import type { TimeValue } from '@/components/ui/time-picker';

interface FormData {
  meetingTime: TimeValue;
}

function MyForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log('Selected time:', data.meetingTime);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TimePickerInput
        name="meetingTime"
        control={control}
        label="وقت الاجتماع"
        format="12"
        rules={{ required: 'الوقت مطلوب' }}
        error={errors.meetingTime?.message}
      />
      <button type="submit">حفظ</button>
    </form>
  );
}
```

## مع قواعد التحقق (Validation)

```tsx
<TimePickerInput
  name="appointmentTime"
  control={control}
  label="موعد الحجز"
  format="12"
  rules={{
    required: 'الوقت مطلوب',
    validate: (value) => {
      // تحقق مخصص
      if (value.hour < 9 || value.hour > 17) {
        return 'الموعد يجب أن يكون بين 9 صباحاً و 5 مساءً';
      }
      return true;
    },
  }}
  error={errors.appointmentTime?.message}
/>
```

## مع قيود الوقت

```tsx
<TimePickerInput
  name="workStart"
  control={control}
  label="بداية العمل"
  format="12"
  minTime={{ hour: 6, minute: 0 }}
  maxTime={{ hour: 12, minute: 0 }}
  rules={{ required: 'وقت البداية مطلوب' }}
  error={errors.workStart?.message}
/>
```

## التحقق المقارن (Compare Times)

```tsx
function FormWithComparison() {
  const {
    control,
    watch,
    formState: { errors },
  } = useForm();

  return (
    <>
      <TimePickerInput
        name="startTime"
        control={control}
        label="من"
        format="12"
        rules={{ required: 'مطلوب' }}
      />

      <TimePickerInput
        name="endTime"
        control={control}
        label="إلى"
        format="12"
        rules={{
          required: 'مطلوب',
          validate: (value) => {
            const startTime = watch('startTime');
            if (!startTime || !value) return true;

            const startMinutes = startTime.hour * 60 + startTime.minute;
            const endMinutes = value.hour * 60 + value.minute;

            return (
              endMinutes > startMinutes ||
              'وقت النهاية يجب أن يكون بعد وقت البداية'
            );
          },
        }}
        error={errors.endTime?.message}
      />
    </>
  );
}
```

## مثال كامل

```tsx
import { useForm } from 'react-hook-form';
import { TimePickerInput } from '@/components/ui/time-picker';
import type { TimeValue } from '@/components/ui/time-picker';

interface ScheduleForm {
  startTime: TimeValue;
  breakTime: TimeValue;
  endTime: TimeValue;
}

export function WorkScheduleForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ScheduleForm>({
    defaultValues: {
      startTime: { hour: 9, minute: 0 },
      breakTime: { hour: 12, minute: 0 },
      endTime: { hour: 17, minute: 0 },
    },
  });

  const onSubmit = (data: ScheduleForm) => {
    console.log('Form submitted:', data);
    // إرسال البيانات للـ API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TimePickerInput
        name="startTime"
        control={control}
        label="بداية العمل"
        format="12"
        minTime={{ hour: 6, minute: 0 }}
        maxTime={{ hour: 12, minute: 0 }}
        rules={{ required: 'وقت البداية مطلوب' }}
        error={errors.startTime?.message}
      />

      <TimePickerInput
        name="breakTime"
        control={control}
        label="وقت الاستراحة"
        format="12"
        rules={{ required: 'وقت الاستراحة مطلوب' }}
        error={errors.breakTime?.message}
      />

      <TimePickerInput
        name="endTime"
        control={control}
        label="نهاية العمل"
        format="12"
        minTime={{ hour: 12, minute: 0 }}
        maxTime={{ hour: 22, minute: 0 }}
        rules={{
          required: 'وقت النهاية مطلوب',
          validate: (value) => {
            const startTime = watch('startTime');
            if (!startTime || !value) return true;

            const startMinutes = startTime.hour * 60 + startTime.minute;
            const endMinutes = value.hour * 60 + value.minute;

            return (
              endMinutes > startMinutes ||
              'وقت النهاية يجب أن يكون بعد وقت البداية'
            );
          },
        }}
        error={errors.endTime?.message}
      />

      <button type="submit">حفظ الجدول</button>
    </form>
  );
}
```

## Props المتاحة

| Prop          | Type           | الوصف                                |
| ------------- | -------------- | ------------------------------------ |
| `name`        | `string`       | اسم الحقل (مطلوب مع React Hook Form) |
| `control`     | `Control`      | كائن control من useForm              |
| `rules`       | `object`       | قواعد التحقق                         |
| `label`       | `string`       | النص الظاهر                          |
| `error`       | `string`       | رسالة الخطأ                          |
| `format`      | `'12' \| '24'` | صيغة الوقت                           |
| `showSeconds` | `boolean`      | عرض الثواني                          |
| `minTime`     | `TimeValue`    | الحد الأدنى                          |
| `maxTime`     | `TimeValue`    | الحد الأقصى                          |
| `disabled`    | `boolean`      | تعطيل الحقل                          |

## ملاحظات

1. **القيمة الافتراضية**: استخدم `defaultValues` في `useForm`
2. **التحقق المخصص**: استخدم `validate` في `rules`
3. **رسائل الخطأ**: مرر `errors.fieldName?.message` إلى prop `error`
4. **المقارنة**: استخدم `watch` للحصول على قيم حقول أخرى

## أمثلة إضافية

راجع ملف `react-hook-form-example.tsx` لأمثلة أكثر تفصيلاً.
