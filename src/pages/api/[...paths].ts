import { Hono } from 'hono';
import type { APIRoute } from 'astro';

import urlController from '@/controllers/url.controller';

const app = new Hono().basePath('/api/');

app.route('/urls', urlController);

export const ALL: APIRoute = context => app.fetch(context.request);
