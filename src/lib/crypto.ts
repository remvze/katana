export async function encrypt(text: string, password: string) {
  const { crypto } = window;
  const encoder = new TextEncoder();
  const encodedText = encoder.encode(text);
  const encodedPassword = encoder.encode(password);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iterations = 150_000;

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encodedPassword,
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );

  const key = await crypto.subtle.deriveKey(
    {
      hash: 'SHA-256',
      iterations,
      name: 'PBKDF2',
      salt: salt,
    },
    keyMaterial,
    { length: 256, name: 'AES-GCM' },
    true,
    ['encrypt'],
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    {
      iv: iv,
      name: 'AES-GCM',
    },
    key,
    encodedText,
  );

  return btoa(
    JSON.stringify({
      encryptedData: bufferToBase64(new Uint8Array(encrypted)),
      iterations,
      iv: bufferToBase64(iv),
      salt: bufferToBase64(salt),
    }),
  );
}

export async function decrypt(encodedData: string, password: string) {
  const { crypto } = window;
  const data = JSON.parse(atob(encodedData));
  const encryptedArray = base64ToBuffer(data.encryptedData);
  const saltArray = base64ToBuffer(data.salt);
  const ivArray = base64ToBuffer(data.iv);
  const iterations = data.iterations;

  const encoder = new TextEncoder();
  const encodedPassword = encoder.encode(password);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encodedPassword,
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );

  const key = await crypto.subtle.deriveKey(
    {
      hash: 'SHA-256',
      iterations,
      name: 'PBKDF2',
      salt: saltArray,
    },
    keyMaterial,
    { length: 256, name: 'AES-GCM' },
    true,
    ['decrypt'],
  );

  const decrypted = await crypto.subtle.decrypt(
    {
      iv: ivArray,
      name: 'AES-GCM',
    },
    key,
    encryptedArray,
  );

  const decoder = new TextDecoder();

  return decoder.decode(decrypted);
}

export async function generateSecureKey(length: number) {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charsetLength = charset.length;

  let slug = '';

  const maxValue = 256 - (256 % charsetLength);

  while (slug.length < length) {
    const randomBytes = new Uint8Array(1);

    window.crypto.getRandomValues(randomBytes);

    const randomValue = randomBytes[0];

    if (randomValue < maxValue) {
      slug += charset[randomValue % charsetLength];
    }
  }

  return slug;
}

function bufferToBase64(buffer: Uint8Array) {
  let binary = '';

  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

function base64ToBuffer(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
