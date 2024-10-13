import { config } from '@/config';

export async function verifyToken(token: string) {
  const verificationUrl =
    'https://challenges.cloudflare.com/turnstile/v0/siteverify';

  const body = new URLSearchParams();

  body.append('secret', config.turnstile.secretKey());
  body.append('response', token);

  const verificationResponse = await fetch(verificationUrl, {
    body,
    method: 'POST',
  });

  const verificationResult = await verificationResponse.json();

  return !!verificationResult.success;
}
