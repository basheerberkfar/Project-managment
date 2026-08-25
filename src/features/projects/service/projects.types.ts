import type { PagedFilters, PagedResponse } from '@/features/finance/service';

export type ProjectStatus = 'New' | 'InProgress' | 'Completed' | 'OnHold' | 'Cancelled';
export type ProjectPriority = 'Low' | 'Medium' | 'High' | 'Urgent' | 'Critical';

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
  status: ProjectStatus;
  priority: ProjectPriority;
  clientId: string;
  clientName: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type ProjectPayload = {
  name: string | null;
  receiptDate: string | null;
  deliveryDate: string | null;
  startDate: string | null;
  description: string | null;
  totalAmount: number;
  paidAmount: number;
  status: ProjectStatus;
  priority: ProjectPriority;
  clientId: string;
};

export type ProjectFilters = PagedFilters & {
  ClientId?: string;
  Status?: ProjectStatus;
  Priority?: ProjectPriority;
};

export type ProjectPagedResponse = PagedResponse<ProjectDto>;
