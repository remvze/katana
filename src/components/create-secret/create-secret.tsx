import { useState } from 'react';

import { Container } from '../container';

import { generateSecureKey, encrypt, encryptFile } from '@/lib/crypto.client';

export function CreateSecret() {
  const [note, setNote] = useState('');
  const [password, setPassword] = useState('');
  const [expiresIn, setExpiresIn] = useState(60 * 60 * 24);
  const [viewLimit, setViewLimit] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState('');

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
        password ? `${key}:${password}` : key,
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

    setLink(`/secret/${data.data.id}#${key}`);
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
            <option value={60 * 60 * 24}>1 Day</option>
            <option value={60 * 60 * 24 * 2}>2 Days</option>
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
          <input
            type="file"
            onChange={e => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <button type="submit">Create Secret</button>
      </form>

      {link && <p>{link}</p>}
    </Container>
  );
}
