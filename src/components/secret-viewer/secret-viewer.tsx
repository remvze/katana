import { useState, useEffect } from 'react';
import { Container } from '../container';
import { combine, decrypt, decryptFile } from '@/lib/crypto.client';

interface SecretViewerProps {
  expiresAt: Date;
  isPasswordProtected: boolean;
  remainingViews: number | null;
  secretId: string;
}

export function SecretViewer({
  expiresAt,
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
  const [encryptedFile, setEncryptedFile] = useState<null | string>(null);
  const [blobUrl, setBlobUrl] = useState<null | string>(null);
  const [metadata, setMetadata] = useState<null | { name: string }>(null);

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

    if (data.data.encryptedFile) setEncryptedFile(data.data.encryptedFile);

    const decryptedData = await decrypt(data.data.encryptedNote, key);

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

  useEffect(() => {
    if (decryptedNote) {
      if (encryptedFile) {
        const decrypt = async () => {
          const decryptedFile = await decryptFile(
            encryptedFile,
            password ? combine(key, password) : key,
          );

          setBlobUrl(decryptedFile.blobUrl);
          setMetadata(decryptedFile.metadata);
        };

        decrypt();
      }
    }
  }, [decryptedNote, encryptedFile, password, key]);

  if (error) return <p>Error: {error}</p>;
  if (decryptedNote)
    return (
      <Container>
        <p>Note: {decryptedNote}</p>
        {blobUrl && (
          <div>
            <p>Attached File:</p>
            <a download={metadata?.name} href={blobUrl}>
              Download File
            </a>
          </div>
        )}
      </Container>
    );

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
      <p>Expires At: {expiresAt ? expiresAt.toLocaleString() : 'Unknown'}</p>

      <button onClick={handleView}>View</button>
    </Container>
  );
}
