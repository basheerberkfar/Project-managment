export type JobTitleDto = {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export type JobTitleFormValues = {
  name: string;
};

export type CreateJobTitleDto = {
  name: string;
};

export type UpdateJobTitleDto = Partial<CreateJobTitleDto>;
