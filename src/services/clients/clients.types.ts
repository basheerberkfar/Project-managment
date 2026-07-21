export type ClientDto = {
  id: string;
  name: string;
  phoneNumber: string;
  countryCode: string;
  address: string;
  birthday: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ClientFormValues = {
  name: string;
  phoneNumber: string;
  countryCode: string;
  address: string;
  birthday: string;
};

export type CreateClientDto = {
  name: string;
  phoneNumber: string;
  countryCode: string;
  address: string;
  birthday: string;
};

export type UpdateClientDto = Partial<CreateClientDto>;

export type ClientFilters = {
  page?: number;
  pageSize?: number;
  search?: string;
};
