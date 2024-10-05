import apiClient from './client';
import type { APIResponse } from '@/lib/response';

interface NewUrl {
  encryptedUrl: string;
  identifier: string;
  isPasswordProtected: boolean;
  token: string;
}

interface CreateUrlResponse {
  destructionKey: string;
}

export async function createUrl(
  newUrl: NewUrl,
): Promise<APIResponse<CreateUrlResponse>> {
  return apiClient<CreateUrlResponse>('/api/urls/new', {
    body: JSON.stringify(newUrl),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });
}
