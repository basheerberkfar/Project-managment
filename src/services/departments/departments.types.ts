export type DepartmentDto = {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export type DepartmentFormValues = {
  name: string;
};

export type CreateDepartmentDto = {
  name: string;
};

export type UpdateDepartmentDto = Partial<CreateDepartmentDto>;
