import { useEffect, useState } from 'react';
import Turnstile from 'react-turnstile';

import { generateSecureKey, encrypt } from '@/lib/crypto';
import { KEY_LENGTH } from '@/constants/url';

export function ShortenForm() {
  const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;

  const [mountTurnstile, setMountTurnstile] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => setMountTurnstile(true), []);
  useEffect(() => console.log({ token }), [token]);

  const [url, setUrl] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({ token, url });

    if (!url || !token) return null;

    setIsLoading(true);

    let key;

    if (password.length > 0) key = password;
    else key = await generateSecureKey(KEY_LENGTH);

    const encrypted = await encrypt(url, key);

    const response = await fetch('/api/shorten-url', {
      body: JSON.stringify({
        encryptedUrl: encrypted,
        passwordProtected: !!password,
        token,
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const data = await response.json();

    setIsLoading(false);

    if (!response.ok) {
      throw new Error(data.error || 'Failed to shorten URL');
    }

    setResult(`${data.slug}${password ? '' : `#${key}`}`);
  };

  return (
    <>
      {!isLoading && !result && (
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Original URL"
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />

          <input
            placeholder="Password (optional)"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {mountTurnstile && (
            <Turnstile sitekey={siteKey} onVerify={token => setToken(token)} />
          )}

          <button type="submit">Shorten URL</button>
        </form>
      )}

      {isLoading && <p>Loading...</p>}

      {result && <p>{result}</p>}
    </>
  );
}
