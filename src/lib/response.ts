export interface SuccessReponse<T> {
  data: T;
  success: true;
}

export interface ErrorResponse {
  error: string;
  success: false;
}

export type APIResponse<T> = SuccessReponse<T> | ErrorResponse;

export function successResponse<T>(data: T): SuccessReponse<T> {
  return { data, success: true };
}

export function errorResponse(error: string): ErrorResponse {
  return { error, success: false };
}
