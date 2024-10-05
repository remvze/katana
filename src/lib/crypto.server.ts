import crypto from 'crypto';

export function generateSecureSlug(length: number) {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charsetLength = charset.length;

  let slug = '';

  const maxValue = 256 - (256 % charsetLength);

  while (slug.length < length) {
    const randomBytes = crypto.randomBytes(1);
    const randomValue = randomBytes[0];

    if (randomValue < maxValue) {
      slug += charset[randomValue % charsetLength];
    }
  }

  return slug;
}

export function generateSecureKey(bytes: number) {
  const buffer = crypto.randomBytes(bytes);

  return buffer.toString('hex');
}

async function sha256(str: string): Promise<Uint8Array> {
  const buffer = Buffer.from(str, 'utf-8');
  const hash = crypto.createHash('sha256');
  hash.update(buffer as crypto.BinaryLike);
  return Uint8Array.from(hash.digest());
}

function bufferToHex(buffer: Uint8Array): string {
  return Array.prototype.map
    .call(buffer, (x: number) => ('00' + x.toString(16)).slice(-2))
    .join('');
}

export async function hashIdentifier(key: string): Promise<string> {
  const keyData = Buffer.from(key, 'utf-8');

  const salt = await sha256(key);
  const iterations = 150000;
  const keyLength = 32;

  const derivedKey = crypto.pbkdf2Sync(
    new Uint8Array(keyData),
    new Uint8Array(salt),
    iterations,
    keyLength,
    'sha256',
  );

  const identifierHash = crypto
    .createHash('sha256')
    .update(new Uint8Array(derivedKey))
    .digest();

  const identifierHex = bufferToHex(Uint8Array.from(identifierHash));

  return identifierHex;
}
