// error.types.ts
export type AppErrorSource = 'react' | 'api' | 'validation' | 'unknown';

export interface AppError {
  source: AppErrorSource;
  message: string;
  stack?: string;
  componentStack?: string;
}
