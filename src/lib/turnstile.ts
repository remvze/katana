export async function verifyToken(token: string) {
  const verificationUrl =
    'https://challenges.cloudflare.com/turnstile/v0/siteverify';

  const body = new URLSearchParams();

  body.append('secret', import.meta.env.TURNSTILE_SECRET_KEY);
  body.append('response', token);

  const verificationResponse = await fetch(verificationUrl, {
    body,
    method: 'POST',
  });

  const verificationResult = await verificationResponse.json();

  return !!verificationResult.success;
}
