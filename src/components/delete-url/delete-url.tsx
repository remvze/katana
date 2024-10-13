import { useState, useEffect } from 'react';
import Turnstile, { useTurnstile } from 'react-turnstile';

import { Container } from '../container';

import { deleteUrl } from '@/api/url';
import { config } from '@/config';

export function DeleteUrl() {
  const siteKey = config.turnstile.publicSiteKey();

  const turnstile = useTurnstile();

  const [destructionKey, setDestructionKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [mountTurnstile, setMountTurnstile] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => setMountTurnstile(true), []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!destructionKey || !token) return;

    setError('');
    setSuccess(false);

    turnstile.reset();

    const response = await deleteUrl(destructionKey, token);

    setDestructionKey('');

    if (!response.success) return setError(response.error);

    setSuccess(true);
  };

  return (
    <Container>
      <h1>Delete URL</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Destruction Key"
          type="text"
          value={destructionKey}
          onChange={e => setDestructionKey(e.target.value)}
        />

        {mountTurnstile && (
          <Turnstile
            sitekey={siteKey}
            size="flexible"
            onVerify={token => setToken(token)}
          />
        )}
      </form>

      {error && <p>Error: {error}</p>}
      {success && <p>Successful</p>}
    </Container>
  );
}
