export type ResourceValue = string | number | boolean | null;

export type ResourceRecord = {
  id: string;
  [key: string]: ResourceValue;
};

export type ResourcePayload = Record<string, ResourceValue>;

export type PagedResourceResponse = {
  items: ResourceRecord[] | null;
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type ResourceFilters = {
  Page?: number;
  PageSize?: number;
  Search?: string;
  SortBy?: string;
  SortDescending?: boolean;
  [key: string]: string | number | boolean | undefined;
};

export type ResourceFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'datetime-local'
  | 'boolean'
  | 'relation';

export type ResourceField = {
  key: string;
  type: ResourceFieldType;
  required?: boolean;
  table?: boolean;
  relation?: {
    resource: string;
    labelKey: string;
  };
};

export type ResourceConfig = {
  key: string;
  endpoint: string;
  fields: ResourceField[];
  readOnly?: boolean;
  children?: ResourceChild[];
};

export type ResourceChild = {
  resourceKey: string;
  fieldKey: string;
  filterKey: string;
};
