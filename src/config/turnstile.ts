import { getEnv } from './getter';

export const turnstileConfig = {
  publicSiteKey: getEnv('PUBLIC_TURNSTILE_SITE_KEY'),
  secretKey: getEnv('TURNSTILE_SECRET_KEY'),
};
