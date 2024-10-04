import { useState, useEffect } from 'react';

import { decrypt, createIdentifier } from '@/lib/crypto';

export function EncryptedUrl() {
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [encrypted, setEncrypted] = useState('');
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const hash = location.hash.split('#')[1];

    if (!hash) return setError('No decryption key');

    const decryptUrl = async () => {
      const identifier = await createIdentifier(hash);

      const response = await fetch(`/api/url/${identifier}`, {
        method: 'GET',
      });

      if (!response.ok) window.location.href = '/404';

      const data = await response.json();
      const { encryptedUrl, passwordProtected } = data;

      const decrypted = await decrypt(encryptedUrl, hash);

      if (passwordProtected) {
        setEncrypted(decrypted);
        setPasswordProtected(true);
      } else {
        setResult(decrypted);
      }
    };

    decryptUrl();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password) return;

    try {
      const decrypted = await decrypt(encrypted, password);

      setResult(decrypted);
    } catch (error) {
      setError('Wrong password');
    }
  };

  if (error) return <p>{error}</p>;
  if (result) return <p>{result}</p>;
  if (passwordProtected)
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </form>
    );

  return <h1>Hello World</h1>;
}
