export type BillDto = {
  id: string;
  no: string | null;
  relatedToProject: boolean;
  barcode: string | null;
  billTypeId: string;
  billTypeName: string | null;
  projectId: string | null;
  projectName: string | null;
  clientId: string | null;
  clientName: string | null;
  total: number;
  paidAmount: number;
  createdAt: string;
  updatedAt: string | null;
};

export type CreateBillDto = {
  no?: string | null;
  relatedToProject?: boolean;
  barcode?: string | null;
  billTypeId?: string | null;
  projectId?: string | null;
  clientId?: string | null;
  total?: number | null;
  paidAmount?: number | null;
};

export type UpdateBillDto = Partial<CreateBillDto>;

export type BillFormValues = {
  no: string;
  relatedToProject: boolean;
  barcode: string;
  billTypeId: string;
  projectId: string;
  clientId: string;
  total: string;
  paidAmount: string;
};
