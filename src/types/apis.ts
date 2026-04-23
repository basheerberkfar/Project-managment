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

export type ApiListResponse<T> = ApiResponse<T[]>;

export type ApiDetailResponse<T> = ApiResponse<T>;
