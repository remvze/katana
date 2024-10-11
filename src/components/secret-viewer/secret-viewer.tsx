import { useState, useEffect } from 'react';
import { Container } from '../container';
import { decrypt } from '@/lib/crypto.client';

interface SecretViewerProps {
  expireAt: Date;
  isPasswordProtected: boolean;
  remainingViews: number | null;
  secretId: string;
}

export function SecretViewer({
  expireAt,
  isPasswordProtected,
  remainingViews,
  secretId,
}: SecretViewerProps) {
  const [error, setError] = useState('');
  const [key, setKey] = useState('');
  const [note, setNote] = useState('');
  const [password, setPassword] = useState('');
  const [askPassword, setAskPassword] = useState(false);
  const [decryptedNote, setDecryptedNote] = useState('');

  useEffect(() => {
    const key = window.location.hash.split('#')[1];

    if (!key) return setError('No decryption key');

    setKey(key);
  }, []);

  const handleView = async () => {
    const response = await fetch(`/api/secrets/${secretId}/content`);

    if (!response.ok) {
      setError(
        'This note has expired or been viewed the maximum number of times.',
      );

      return;
    }

    const data = await response.json();

    console.log({ data });

    const decryptedData = await decrypt(data.data.encryptedSecret, key);

    console.log({ decryptedData });

    if (data.data.encryptedFile) {
      console.log(data.data.encryptedFile.length);
    }

    setNote(decryptedData);

    if (isPasswordProtected) setAskPassword(true);
    else setDecryptedNote(decryptedData);
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password) return;

    try {
      const decryptedData = await decrypt(note, password);

      setDecryptedNote(decryptedData);
    } catch (error) {
      setError('Incorrect password');
    }
  };

  if (error) return <p>Error: {error}</p>;
  if (decryptedNote) return <p>Note: {decryptedNote}</p>;

  if (askPassword)
    return (
      <form onSubmit={handlePasswordSubmit}>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </form>
    );

  return (
    <Container>
      <h1>Secret Viewer</h1>

      <p>This note is encrypted. Do you want to view it now?</p>
      <p>
        Remaining Views:{' '}
        {remainingViews !== null ? remainingViews : 'Unlimited'}
      </p>
      <p>Expires At: {expireAt ? expireAt.toLocaleString() : 'Unknown'}</p>

      <button onClick={handleView}>View</button>
    </Container>
  );
}
