import { useEffect, useState } from 'react';
import Turnstile from 'react-turnstile';

import { generateSecureKey, encrypt } from '@/lib/crypto';
import { KEY_LENGTH } from '@/constants/url';

export function ShortenForm() {
  const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;

  const [mountTurnstile, setMountTurnstile] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => setMountTurnstile(true), []);

  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!url || !token) return null;

    setIsLoading(true);

    const key = await generateSecureKey(KEY_LENGTH);
    const encrypted = await encrypt(url, key);

    const response = await fetch('/api/shorten-url', {
      body: JSON.stringify({ encryptedUrl: encrypted, token }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const data = await response.json();

    setIsLoading(false);

    if (!response.ok) {
      throw new Error(data.error || 'Failed to shorten URL');
    }

    setResult(`${data.slug}#${key}`);
  };

  return (
    <>
      {!isLoading && !result && (
        <form onSubmit={handleSubmit}>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />

          {mountTurnstile && (
            <Turnstile sitekey={siteKey} onVerify={token => setToken(token)} />
          )}
        </form>
      )}

      {isLoading && <p>Loading...</p>}

      {result && <p>{result}</p>}
    </>
  );
}
