/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly MONGODB_URI: string;
  readonly PUBLIC_TURNSTILE_SITE_KEY: string;
  readonly PUBLIC_UNSHORTENER_LINK: string;
  readonly SUPABASE_KEY: string;
  readonly SUPABASE_URL: string;
  readonly TURNSTILE_SECRET_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
