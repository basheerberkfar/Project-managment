import { REASON_TYPE } from '@/constants/enums';

export const REASON_TYPE_TRANSLATION_KEYS: Record<number, string> = {
  [REASON_TYPE.NEW]: 'reason_type_enum.new',
  [REASON_TYPE.DELAYING]: 'reason_type_enum.delaying',
  [REASON_TYPE.DELAYED]: 'reason_type_enum.delayed',
  [REASON_TYPE.PROCESSING]: 'reason_type_enum.processing',
  [REASON_TYPE.DONE]: 'reason_type_enum.done',
  [REASON_TYPE.REJECTED]: 'reason_type_enum.rejected',
  [REASON_TYPE.CANCELLED]: 'reason_type_enum.cancelled',
  [REASON_TYPE.TRANSFER]: 'reason_type_enum.transfer',
};
