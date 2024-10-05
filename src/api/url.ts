interface NewUrl {
  encryptedUrl: string;
  identifier: string;
  isPasswordProtected: boolean;
  token: string;
}

interface CreateUrlResponse {
  destructionKey: string;
}

export async function createUrl(newUrl: NewUrl): Promise<CreateUrlResponse> {
  try {
    const response = await fetch('/api/urls/new', {
      body: JSON.stringify(newUrl),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const data = (await response.json()) as CreateUrlResponse & {
      error?: string;
    };

    if (!response.ok) {
      throw new Error(
        data.error || `Error ${response.status}: ${response.statusText}`,
      );
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to create URL: ${error.message}`);
    }

    throw new Error('An unexpected error occurred while creating the URL.');
  }
}
