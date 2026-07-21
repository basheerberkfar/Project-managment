export type ProjectDto = {
  id: string;
  name: string | null;
  receiptDate: string | null;
  deliveryDate: string | null;
  startDate: string | null;
  description: string | null;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: string;
  priority: string;
  clientId: string;
  clientName: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type ProjectFormValues = {
  name: string;
  receiptDate: string;
  deliveryDate: string;
  startDate: string;
  description: string;
  totalAmount: string;
  paidAmount: string;
  status: string;
  priority: string;
  clientId: string;
};

export type CreateProjectDto = {
  name: string | null;
  receiptDate: string | null;
  deliveryDate: string | null;
  startDate: string | null;
  description: string | null;
  totalAmount: number;
  paidAmount: number;
  status: string;
  priority: string;
  clientId: string;
};

export type UpdateProjectDto = Partial<CreateProjectDto>;

export type ProjectFilters = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDescending?: boolean;
  clientId?: string;
  status?: string;
  priority?: string;
};
