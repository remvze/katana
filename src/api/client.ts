import { errorResponse, successResponse } from '@/lib/response';
import type { APIResponse } from '@/lib/response';

async function apiClient<T>(
  url: string,
  options: RequestInit,
): Promise<APIResponse<T>> {
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      const message =
        data.error || `Error ${response.status}: ${response.statusText}`;

      return errorResponse(message);
    }

    return successResponse(data.data as T);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return errorResponse(`Failed to fetch: ${error.message}`);
    }

    return errorResponse(
      'An unexpected error occurred while making the request.',
    );
  }
}

export default apiClient;
