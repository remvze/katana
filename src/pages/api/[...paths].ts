import { Hono } from 'hono';
import type { APIRoute } from 'astro';

import urlController from '@/controllers/url.controller';
import secretController from '@/controllers/secret.controller';

const app = new Hono().basePath('/api/');

app.route('/urls', urlController);
app.route('/secrets', secretController);

app.get('/health', c => c.json({ success: true }, 200));

export const ALL: APIRoute = context => app.fetch(context.request);
