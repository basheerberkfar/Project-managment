import * as yup from 'yup';
import type { BillFormValues } from '@/features/bills/service';

export function getBillSchema() {
  return yup.object({
    relatedToProject: yup.boolean().required(),
    billTypeId: yup.string().trim().required('Bill Type Id is required'),
    projectId: yup.string().trim(),
    clientId: yup.string().trim(),
    total: yup.string().trim().required('Total is required'),
    paidAmount: yup.string().trim().required('Paid Amount is required'),
  }) as yup.ObjectSchema<BillFormValues>;
}
