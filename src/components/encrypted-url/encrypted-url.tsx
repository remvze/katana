import { useState, useEffect } from 'react';

import { decrypt } from '@/lib/crypto';

interface EncryptedUrlProps {
  encryptedUrl: string;
}

export function EncryptedUrl({ encryptedUrl }: EncryptedUrlProps) {
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
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
  }, [encryptedUrl]);

  if (error) return <p>{error}</p>;
  if (result) return <p>{result}</p>;

  return <h1>{encryptedUrl}</h1>;
}
