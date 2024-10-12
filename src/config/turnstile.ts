import { env } from 'std-env';

export const turnstileConfig = {
  publicSiteKey: env.PUBLIC_TURNSTILE_SITE_KEY,
  secretKey: env.TURNSTILE_SECRET_KEY,
};
