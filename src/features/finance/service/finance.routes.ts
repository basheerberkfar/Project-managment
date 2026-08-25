export const FINANCE_ROUTES = {
  BILLS: 'Bills',
  BILL: (id: string) => `Bills/${id}`,
  BILL_TYPES: 'BillTypes',
  BILL_TYPE: (id: string) => `BillTypes/${id}`,
  BONDS: 'Bonds',
  BOND: (id: string) => `Bonds/${id}`,
  BOND_TYPES: 'BondTypes',
  BOND_TYPE: (id: string) => `BondTypes/${id}`,
} as const;
