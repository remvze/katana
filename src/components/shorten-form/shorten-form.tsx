import { useState } from 'react';

export function ShortenForm() {
  const [url, setUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!url) return null;

    const response = await fetch('/api/shorten-url', {
      body: JSON.stringify({ url }),
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
    </form>
  );
}
