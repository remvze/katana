import IORedis from 'ioredis';
import { Redis as UpstashRedis } from '@upstash/redis';
import { config } from '@/config';

export type Client = UpstashRedis | IORedis;

let client: Client;

export function createRedisClient() {
  if (client) return client;

  if (config.deployment.runtime() === 'cloudflare') {
    client = new UpstashRedis({
      token: config.redis.upstashRedisToken(),
      url: config.redis.upstashRedisUrl(),
    });
  } else {
    client = new IORedis(config.redis.redisUrl());
  }

  return client;
}
