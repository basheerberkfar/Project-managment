import { useForm } from 'react-hook-form';
import { TimePickerInput } from './index';
import type { TimeValue } from './types';

interface FormData {
  meetingTime: TimeValue;
  startTime: TimeValue;
  endTime: TimeValue;
}

export function TimePickerWithReactHookForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      meetingTime: { hour: 14, minute: 30 },
      startTime: { hour: 9, minute: 0 },
      endTime: { hour: 17, minute: 0 },
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form Data:', data);
    alert('تم الإرسال بنجاح! تحقق من الـ console');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem' }}>مثال React Hook Form</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* وقت الاجتماع */}
        <div style={{ marginBottom: '1.5rem' }}>
          <TimePickerInput
            name="meetingTime"
            control={control}
            label="وقت الاجتماع"
            format="12"
            rules={{
              required: 'وقت الاجتماع مطلوب',
            }}
            error={errors.meetingTime?.message}
          />
        </div>

        {/* وقت البداية */}
        <div style={{ marginBottom: '1.5rem' }}>
          <TimePickerInput
            name="startTime"
            control={control}
            label="وقت البداية"
            format="12"
            minTime={{ hour: 6, minute: 0 }}
            maxTime={{ hour: 12, minute: 0 }}
            rules={{
              required: 'وقت البداية مطلوب',
            }}
            error={errors.startTime?.message}
          />
        </div>

        {/* وقت النهاية */}
        <div style={{ marginBottom: '1.5rem' }}>
          <TimePickerInput
            name="endTime"
            control={control}
            label="وقت النهاية"
            format="12"
            minTime={{ hour: 12, minute: 0 }}
            maxTime={{ hour: 22, minute: 0 }}
            rules={{
              required: 'وقت النهاية مطلوب',
              validate: (value: TimeValue) => {
                // eslint-disable-next-line react-hooks/incompatible-library -- watch() used in validation callback
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
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'linear-gradient(135deg, #B8860B 0%, #8B6508 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          إرسال
        </button>
      </form>
    </div>
  );
}

export function SimpleExample() {
  const { control, handleSubmit } = useForm<{ time: TimeValue }>();

  const onSubmit = (data: { time: TimeValue }) => {
    console.log('Selected time:', data.time);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TimePickerInput
        name="time"
        control={control}
        label="اختر الوقت"
        format="12"
        rules={{ required: 'الوقت مطلوب' }}
      />
      <button type="submit">حفظ</button>
    </form>
  );
}

export default TimePickerWithReactHookForm;
