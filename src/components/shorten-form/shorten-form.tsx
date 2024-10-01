import { useEffect, useState } from 'react';
import Turnstile from 'react-turnstile';

import { Container } from '../container';

import { generateSecureKey, encrypt } from '@/lib/crypto';
import { KEY_LENGTH } from '@/constants/url';

import styles from './shorten-form.module.css';
import { cn } from '@/helpers/styles';

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
    <Container>
      {!result && (
        <form
          className={cn(styles.form, isLoading && styles.disabled)}
          onSubmit={handleSubmit}
        >
          <div className={styles.field}>
            <label htmlFor="url">Long URL</label>
            <input
              disabled={isLoading}
              id="url"
              placeholder="https://example.com/"
              required
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">
              Password <span>(optional)</span>
            </label>
            <input
              disabled={isLoading}
              id="password"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <p>
              Generate a secure password using{' '}
              <a href="https://pswd.mvze.net/" rel="noreferrer" target="_blank">
                PSWD
              </a>
              .
            </p>
          </div>

          {mountTurnstile && (
            <Turnstile
              className={styles.turnstile}
              sitekey={siteKey}
              size="flexible"
              onVerify={token => setToken(token)}
            />
          )}

          <button className={styles.button} disabled={isLoading} type="submit">
            Shorten URL
          </button>
        </form>
      )}

      {result && <p>{result}</p>}
    </Container>
  );
}
