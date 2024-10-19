import { getEnv } from './getter';

export const redisConfig = {
  redisUrl: getEnv('REDIS_URL'),
  upstashRedisToken: getEnv('UPSTASH_REDIS_TOKEN'),
  upstashRedisUrl: getEnv('UPSTASH_REDIS_URL'),
};
