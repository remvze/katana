import { getEnvSource } from './env';

const env = getEnvSource();

export const turnstileConfig = {
  publicSiteKey: env.PUBLIC_TURNSTILE_SITE_KEY,
  secretKey: env.TURNSTILE_SECRET_KEY,
};
