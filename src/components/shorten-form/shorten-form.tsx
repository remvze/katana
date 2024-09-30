import { useEffect, useState } from 'react';
import Turnstile from 'react-turnstile';

export function ShortenForm() {
  const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;

  const [mountTurnstile, setMountTurnstile] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => setMountTurnstile(true), []);

  const [url, setUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!url || !token) return null;

    const response = await fetch('/api/shorten-url', {
      body: JSON.stringify({ token, url }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to shorten URL');
    }

    console.log({ data });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="url" value={url} onChange={e => setUrl(e.target.value)} />

      {mountTurnstile && (
        <Turnstile sitekey={siteKey} onVerify={token => setToken(token)} />
      )}
    </form>
  );
}
