import { Redis, type RedisConfigNodejs } from '@upstash/redis';
import { defineDriver } from 'unstorage';

export interface UpstashRedisOptions extends Partial<RedisConfigNodejs> {
  base?: string;
  envPrefix?: false | string;
  token: string;
  ttl?: number;
  url: string;
}

export function normalizeKey(key: string | undefined): string {
  if (!key) {
    return '';
  }
  return key.replace(/[/\\]/g, ':').replace(/^:|:$/g, '');
}

export function joinKeys(...keys: string[]) {
  return keys
    .map(key => normalizeKey(key))
    .filter(Boolean)
    .join(':');
}

export default defineDriver(
  (opts: UpstashRedisOptions = { token: '', url: '' }) => {
    let redisClient: Redis;

    const getRedisClient = () => {
      if (redisClient) {
        return redisClient;
      }

      redisClient = new Redis({ token: opts.token, url: opts.url });
      return redisClient;
    };

    const base = (opts.base || '').replace(/:$/, '');
    const p = (...keys: string[]) => joinKeys(base, ...keys);

    return {
      async clear(base) {
        const keys = await getRedisClient().keys(p(base, '*'));

        if (keys.length === 0) {
          return;
        }

        await getRedisClient().del(...keys);
      },

      async getItem(key) {
        return getRedisClient().get(p(key));
      },

      async getKeys(base) {
        return getRedisClient().keys(p(base, '*'));
      },

      async hasItem(key) {
        return Boolean(await getRedisClient().exists(p(key)));
      },

      name: 'upstash',

      options: opts,

      async removeItem(key) {
        await getRedisClient().del(p(key));
      },

      async setItem(key, value, tOptions) {
        const ttl = tOptions?.ttl ?? opts.ttl;
        await getRedisClient().set(
          p(key),
          value,
          ttl ? { ex: ttl } : undefined,
        );
      },
    };
  },
);
