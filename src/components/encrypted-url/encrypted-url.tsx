import { useState, useEffect } from 'react';

import { decrypt } from '@/lib/crypto.client';

interface EncryptedUrlProps {
  clicks: number;
  encryptedUrl: string;
  isPasswordProtected: boolean;
}

export function EncryptedUrl({
  clicks,
  encryptedUrl,
  isPasswordProtected,
}: EncryptedUrlProps) {
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [encrypted, setEncrypted] = useState('');
  const [password, setPassword] = useState('');
  const [askPassword, setAskPassword] = useState(false);

  useEffect(() => console.log({ isPasswordProtected }), [isPasswordProtected]);

  useEffect(() => {
    const hash = location.hash.split('#')[1];

    if (!hash) return setError('No decryption key');

    const decryptUrl = async () => {
      const decrypted = await decrypt(encryptedUrl, hash);

      if (isPasswordProtected) {
        setEncrypted(decrypted);
        setAskPassword(true);
      } else {
        setResult(decrypted);
      }
    };

    decryptUrl();
  }, [isPasswordProtected, encryptedUrl]);

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
  if (result)
    return (
      <p>
        {result}
        <br />
        {clicks} clicks
      </p>
    );
  if (askPassword)
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
