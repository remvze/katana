import { Hono } from 'hono';
import type { APIRoute } from 'astro';

import urlController from '@/controllers/url.controller';
import secretController from '@/controllers/secret.controller';
import { urlRepository } from '@/repositories/url.repository';

const app = new Hono().basePath('/api/');

app.route('/urls', urlController);
app.route('/secrets', secretController);

app.get('/health', c => c.json({ success: true }, 200));

app.get('expire', async c => {
  const authorization = c.req.header('authorization');

  if (authorization !== `Bearer ${import.meta.env.EXPIRATION_SECRET}`) {
    return c.json({ success: false }, 403);
  }

  await urlRepository.deleteAllExpired();

  return c.json({ success: true }, 200);
});

export const ALL: APIRoute = context => app.fetch(context.request);
