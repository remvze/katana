export const turnstileConfig = {
  publicSiteKey:
    import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ??
    process.env.PUBLIC_TURNSTILE_SITE_KEY,
  secretKey:
    import.meta.env.TURNSTILE_SECRET_KEY ?? process.env.TURNSTILE_SECRET_KEY,
};
