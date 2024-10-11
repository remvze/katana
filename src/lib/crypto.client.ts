function bufferToHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function sha256(str: string) {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = new Uint8Array(hashBuffer);

  return hashArray;
}

export async function createIdentifier(key: string) {
  const keyData = new TextEncoder().encode(key);

  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    keyData,
    'PBKDF2',
    false,
    ['deriveBits'],
  );

  const salt = await sha256(key);

  const iterations = 150_000;
  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      hash: 'SHA-256',
      iterations,
      name: 'PBKDF2',
      salt,
    },
    baseKey,
    256,
  );

  const identifierHash = await window.crypto.subtle.digest(
    'SHA-256',
    derivedBits,
  );

  const identifierHex = bufferToHex(identifierHash);

  return identifierHex;
}

export async function encrypt(text: string, password: string) {
  const encoder = new TextEncoder();
  const encodedText = encoder.encode(text);
  const encodedPassword = encoder.encode(password);

  const salt = window.crypto.getRandomValues(new Uint8Array(16));

  const iterations = 150_000;

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encodedPassword,
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      hash: 'SHA-256',
      iterations,
      name: 'PBKDF2',
      salt,
    },
    keyMaterial,
    { length: 256, name: 'AES-GCM' },
    true,
    ['encrypt'],
  );

  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await window.crypto.subtle.encrypt(
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
  const data = JSON.parse(atob(encodedData));
  const encryptedArray = base64ToBuffer(data.encryptedData);
  const saltArray = base64ToBuffer(data.salt);
  const ivArray = base64ToBuffer(data.iv);
  const iterations = data.iterations;

  const encoder = new TextEncoder();
  const encodedPassword = encoder.encode(password);

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encodedPassword,
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );

  const key = await window.crypto.subtle.deriveKey(
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

  const decrypted = await window.crypto.subtle.decrypt(
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

export async function generateSecurePassword(length: number) {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
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

/**
 * ========
 * FILE
 * ========
 */

export async function encryptFile(file: File, password: string) {
  const encoder = new TextEncoder();
  const encodedPassword = encoder.encode(password);
  const fileArrayBuffer = await file.arrayBuffer();
  const fileData = new Uint8Array(fileArrayBuffer);

  const salt = window.crypto.getRandomValues(new Uint8Array(16));

  const iterations = 150_000;

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encodedPassword,
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      hash: 'SHA-256',
      iterations,
      name: 'PBKDF2',
      salt,
    },
    keyMaterial,
    { length: 256, name: 'AES-GCM' },
    true,
    ['encrypt'],
  );

  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await window.crypto.subtle.encrypt(
    {
      iv: iv,
      name: 'AES-GCM',
    },
    key,
    fileData,
  );

  const fileMetadata = JSON.stringify({
    name: file.name,
    size: file.size,
    type: file.type,
  });

  const encryptedMetadata = await encrypt(fileMetadata, password);

  return btoa(
    JSON.stringify({
      encryptedFile: bufferToBase64(new Uint8Array(encrypted)),
      iterations,
      iv: bufferToBase64(iv),
      metadata: encryptedMetadata,
      salt: bufferToBase64(salt),
    }),
  );
}

export async function decryptFile(encodedData: string, password: string) {
  const data = JSON.parse(atob(encodedData));
  const encryptedFile = base64ToBuffer(data.encryptedFile);
  const saltArray = base64ToBuffer(data.salt);
  const ivArray = base64ToBuffer(data.iv);
  const iterations = data.iterations;
  const encryptedMetadata = data.metadata;

  const encoder = new TextEncoder();
  const encodedPassword = encoder.encode(password);

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encodedPassword,
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );

  const key = await window.crypto.subtle.deriveKey(
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

  const decrypted = await window.crypto.subtle.decrypt(
    {
      iv: ivArray,
      name: 'AES-GCM',
    },
    key,
    encryptedFile,
  );

  const metadata = JSON.parse(await decrypt(encryptedMetadata, password));
  const fileBlob = new Blob([decrypted]);
  const blobUrl = URL.createObjectURL(fileBlob);

  return {
    blobUrl,
    metadata,
  };
}
