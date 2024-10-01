import { useState, useEffect } from 'react';

import { decrypt } from '@/lib/crypto';

interface EncryptedUrlProps {
  encryptedUrl: string;
  passwordProtected: boolean;
}

export function EncryptedUrl({
  encryptedUrl,
  passwordProtected,
}: EncryptedUrlProps) {
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!passwordProtected) {
      const hash = location.hash.split('#')[1];

      if (!hash) return setError('No decryption key');

      const decryptUrl = async () => {
        try {
          const decryptedUrl = await decrypt(encryptedUrl, hash);

          setResult(decryptedUrl);
        } catch (err) {
          setError('Wrong key');
        }
      };

      decryptUrl();
    }
  }, [encryptedUrl, passwordProtected]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const decryptedUrl = await decrypt(encryptedUrl, password);

      setResult(decryptedUrl);
    } catch (err) {
      setError('Wrong password');
    }
  };

  if (error) return <p>{error}</p>;
  if (result) return <p>{result}</p>;
  if (passwordProtected)
    return (
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </form>
    );

  return <h1>{encryptedUrl}</h1>;
}
