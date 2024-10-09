import { useEffect, useState } from 'react';
import Turnstile, { useTurnstile } from 'react-turnstile';
import { FaCopy, FaCheck } from 'react-icons/fa6';

import { generateSecureKey, encrypt } from '@/lib/crypto.client';
import { KEY_LENGTH } from '@/constants/url';
import { useCopy } from '@/hooks/use-copy';
import { config } from '@/config';

import styles from './shorten-form.module.css';
import { cn } from '@/helpers/styles';
import { createUrl } from '@/api/url';

export function ShortenForm() {
  const siteKey = config.turnstile.publicSiteKey;
  const unshortenLink = config.other.publicUnshortenLink;

  const turnstile = useTurnstile();
  const [mountTurnstile, setMountTurnstile] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => setMountTurnstile(true), []);

  const [url, setUrl] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [destructionKey, setDestructionKey] = useState('');

  const { copy: copyLink, copying: copyingLink } = useCopy();
  const { copy: copyKey, copying: copyingKey } = useCopy();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!url || !token) return null;

    setIsLoading(true);

    const key = await generateSecureKey(KEY_LENGTH);
    let encrypted = url;

    if (password) {
      encrypted = await encrypt(encrypted, password);
    }

    encrypted = await encrypt(encrypted, key);

    const response = await createUrl({
      encryptedUrl: encrypted,
      isPasswordProtected: !!password,
      token,
    });

    setIsLoading(false);
    turnstile.reset();

    if (response.success) {
      setDestructionKey(response.data.destructionKey);
      setResult(`${response.data.slug}#${key}`);
    }
  };

  const reset = () => {
    setResult('');
    setDestructionKey('');

    setUrl('');
    setPassword('');
  };

  return (
    <>
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

      {!!result.length && (
        <div className={styles.result}>
          <div className={styles.field}>
            <label htmlFor="shortUrl">Short URL</label>
            <div className={styles.inputWrapper}>
              <input readOnly type="text" value={`${unshortenLink}${result}`} />
              <button onClick={() => copyLink(`${unshortenLink}${result}`)}>
                {copyingLink ? <FaCheck /> : <FaCopy />}
              </button>
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="shortUrl">Destruction Key</label>
            <div className={styles.inputWrapper}>
              <input readOnly type="text" value={destructionKey} />
              <button onClick={() => copyKey(destructionKey)}>
                {copyingKey ? <FaCheck /> : <FaCopy />}
              </button>
            </div>
            <p>
              <span>Notice:</span> Do NOT share this with anyone.
            </p>
          </div>

          <button className={styles.button} onClick={reset}>
            Back to Form
          </button>
        </div>
      )}
    </>
  );
}
