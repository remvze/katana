import { getEnvSource } from './env';

const env = getEnvSource();

export const otherConfig = {
  publicUnshortenLink: env.PUBLIC_UNSHORTENER_LINK,
};
