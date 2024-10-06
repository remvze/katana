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

interface GetUrlResponse {
  clicks: number;
  encryptedUrl: string;
  isPasswordProtected: boolean;
}

export async function getUrl(
  identifier: string,
): Promise<APIResponse<GetUrlResponse>> {
  return apiClient<GetUrlResponse>(`/api/urls/${identifier}`, {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function deleteUrl(
  destructionKey: string,
  token: string,
): Promise<APIResponse<null>> {
  return apiClient<null>('/api/urls/delete', {
    body: JSON.stringify({ destructionKey, token }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });
}
