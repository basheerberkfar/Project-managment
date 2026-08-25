import type { ProjectPriority } from './projects.types';

export type TaskDto = {
  id: string;
  no: string | null;
  name: string | null;
  description: string | null;
  startDate: string | null;
  deliverDate: string | null;
  employeeId: string | null;
  employeeName: string | null;
  projectId: string;
  projectName: string | null;
  taskStatusId: string;
  taskStatusName: string | null;
  priority: ProjectPriority;
  taskCategoryId: string | null;
  taskCategoryName: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type TaskPayload = {
  no: string | null;
  name: string | null;
  description: string | null;
  startDate: string | null;
  deliverDate: string | null;
  employeeId: string | null;
  projectId: string;
  taskStatusId: string;
  priority: ProjectPriority;
  taskCategoryId: string | null;
};

export type TaskStatusDto = {
  id: string;
  name: string | null;
  color: string | null;
  type: string | null;
  default: boolean;
  canArchive: boolean;
  sortOrder: number;
  permissionId: string | null;
};

export type TaskStatusPayload = Omit<TaskStatusDto, 'id'>;
export type TaskCategoryDto = {
  id: string;
  name: string | null;
  hasText: boolean;
  hasAttachments: boolean;
  hasPrices: boolean;
  color: string | null;
};
export type TaskCategoryPayload = Omit<TaskCategoryDto, 'id'>;
