import { useState } from 'react';

import { Container } from '../container';

import { MAX_ORIGINAL_FILE_SIZE } from '@/constants/file';
import {
  generateSecureKey,
  encrypt,
  encryptFile,
  combine,
} from '@/lib/crypto.client';
import { secretExpirations } from '@/lib/expiration';

export function CreateSecret() {
  const [note, setNote] = useState('');
  const [password, setPassword] = useState('');
  const [expiresIn, setExpiresIn] = useState(60 * 60 * 2);
  const [viewLimit, setViewLimit] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState('');
  const [fileError, setFileError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!note) return;

    const key = await generateSecureKey(24);
    let encrypted = note;

    if (password) {
      encrypted = await encrypt(encrypted, password);
    }

    encrypted = await encrypt(encrypted, key);

    let encryptedFile = null;

    if (file) {
      encryptedFile = await encryptFile(
        file,
        password ? combine(key, password) : key,
      );
    }

    const response = await fetch('/api/secrets/create', {
      body: JSON.stringify({
        encryptedFile: encryptedFile ?? null,
        encryptedNote: encrypted,
        expiresIn,
        isPasswordProtected: !!password,
        viewLimit,
      }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    const data = await response.json();

    setLink(`/secrets/${data.data.publicId}#${key}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      if (selectedFile.size > MAX_ORIGINAL_FILE_SIZE) {
        setFileError(
          `File size should not exceed ${MAX_ORIGINAL_FILE_SIZE / (1024 * 1024)} MB.`,
        );
        setFile(null);
      } else {
        setFileError('');
        setFile(selectedFile);
      }
    }
  };

  return (
    <Container>
      <h1>Create Secret</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            placeholder="Your note"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>

        <div>
          <input
            placeholder="Password (optional)"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div>
          <select
            value={expiresIn}
            onChange={e => setExpiresIn(Number(e.target.value))}
          >
            {secretExpirations.map(expiration => (
              <option key={expiration.label} value={expiration.value}>
                {expiration.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <input
            min="1"
            placeholder="Leave empty for unlimited"
            type="number"
            value={viewLimit ?? ''}
            onChange={e =>
              setViewLimit(e.target.value ? Number(e.target.value) : null)
            }
          />
        </div>

        <div>
          <input type="file" onChange={handleFileChange} />
        </div>

        {fileError && <p>{fileError}</p>}

        <button type="submit">Create Secret</button>
      </form>

      {link && <p>{link}</p>}

      <h1>Watchtower is working!!!!!!!</h1>
    </Container>
  );
}
