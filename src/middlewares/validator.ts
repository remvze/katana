import type { ZodTypeDef, ZodType } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { ValidationTargets } from 'hono';
import { errorResponse } from '@/lib/response';

export const validator = (
  target: keyof ValidationTargets,
  schema: ZodType<unknown, ZodTypeDef, unknown>,
) =>
  zValidator(target, schema, (result, c) => {
    if (!result.success) {
      return c.json(errorResponse('Invalid data.'), 400);
    }
  });
