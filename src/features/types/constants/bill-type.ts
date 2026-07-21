export const BILL_TYPE_ENUM = {
  SAMPLEBILL: 1,
  RETURNBILL: 2,
  PICKUPMAINTENANCEBILL: 3,
  DELIVERMAINTENANCEBILL: 4,
  CHANGEOIL: 5,
  SALESBILL: 6,
  CONTRACTBILL: 7,
  FOLLOWUP: 8,
  RETURNSAMPLEBILL: 9,
  FILLINGOIL: 10,
} as const;

export const BILL_TYPE_TRANSLATION_KEYS: Record<number, string> = {
  [BILL_TYPE_ENUM.SAMPLEBILL]: 'bill_type_enum.sample_bill',
  [BILL_TYPE_ENUM.RETURNBILL]: 'bill_type_enum.return_bill',
  [BILL_TYPE_ENUM.PICKUPMAINTENANCEBILL]:
    'bill_type_enum.pickup_maintenance_bill',
  [BILL_TYPE_ENUM.DELIVERMAINTENANCEBILL]:
    'bill_type_enum.deliver_maintenance_bill',
  [BILL_TYPE_ENUM.CHANGEOIL]: 'bill_type_enum.change_oil',
  [BILL_TYPE_ENUM.SALESBILL]: 'bill_type_enum.sales_bill',
  [BILL_TYPE_ENUM.CONTRACTBILL]: 'bill_type_enum.contract_bill',
  [BILL_TYPE_ENUM.FOLLOWUP]: 'bill_type_enum.follow_up',
  [BILL_TYPE_ENUM.RETURNSAMPLEBILL]: 'bill_type_enum.return_sample_bill',
  [BILL_TYPE_ENUM.FILLINGOIL]: 'bill_type_enum.filling_oil',
};
