export type mutationOptions<T = unknown> = {
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
};
