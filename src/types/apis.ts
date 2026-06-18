export interface ApiResponse<T> {
  success: boolean;
  data: T;
  result?: T;
  message?: string;
  meta?: Meta;
}

export interface Meta {
  current_page: number;
  last_page: number;
  quant?: number;
  total?: number;
}

export interface PaginatedItemsResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export type ApiListResponse<T> = ApiResponse<T[]>;

export type ApiDetailResponse<T> = ApiResponse<T>;

export type GenericListResponse<T> = ApiListResponse<T> | PaginatedItemsResponse<T>;

export const extractApiList = <T>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload as T[];
  if (!payload || typeof payload !== 'object') return [];

  const response = payload as {
    data?: unknown;
    result?: unknown;
    items?: unknown;
  };

  if (Array.isArray(response.items)) return response.items as T[];
  if (Array.isArray(response.data)) return response.data as T[];
  if (Array.isArray(response.result)) return response.result as T[];

  return [];
};

export const extractApiItem = <T>(payload: unknown): T | null => {
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    const directValue = payload as Record<string, unknown>;
    const hasWrappedKeys =
      'data' in directValue || 'result' in directValue || 'item' in directValue;

    if (!hasWrappedKeys) {
      return payload as T;
    }
  }

  if (!payload || typeof payload !== 'object') return null;

  const response = payload as {
    data?: unknown;
    result?: unknown;
    item?: unknown;
  };

  if (response.data && !Array.isArray(response.data)) {
    return response.data as T;
  }

  if (response.result && !Array.isArray(response.result)) {
    return response.result as T;
  }

  if (response.item && typeof response.item === 'object') {
    return response.item as T;
  }

  return null;
};

export const extractPaginationMeta = (
  payload: unknown,
  fallbackPageSize: number = 10
) => {
  if (!payload || typeof payload !== 'object') {
    return {
      page: 1,
      pageSize: fallbackPageSize,
      totalCount: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    };
  }

  const response = payload as {
    meta?: Meta;
    page?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
    hasPreviousPage?: boolean;
    hasNextPage?: boolean;
  };

  if (response.meta) {
    return {
      page: response.meta.current_page ?? 1,
      pageSize: fallbackPageSize,
      totalCount: response.meta.total ?? 0,
      totalPages: response.meta.last_page ?? 0,
      hasPreviousPage: (response.meta.current_page ?? 1) > 1,
      hasNextPage:
        (response.meta.current_page ?? 1) < (response.meta.last_page ?? 0),
    };
  }

  return {
    page: response.page ?? 1,
    pageSize: response.pageSize ?? fallbackPageSize,
    totalCount: response.totalCount ?? 0,
    totalPages: response.totalPages ?? 0,
    hasPreviousPage: response.hasPreviousPage ?? false,
    hasNextPage: response.hasNextPage ?? false,
  };
};
