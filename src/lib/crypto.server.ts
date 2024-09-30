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
