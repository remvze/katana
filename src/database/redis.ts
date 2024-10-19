import { createStorage } from 'unstorage';

import upstash from './drivers/upstash';
import redis from 'unstorage/drivers/redis';

import { config } from '@/config';

export const storage = createStorage({
  driver:
    config.deployment.runtime === 'cloudflare'
      ? upstash({
          token: config.redis.upstashRedisToken,
          url: config.redis.upstashRedisUrl,
        })
      : redis({
          url: config.redis.redisUrl,
        }),
});
