import { getEnv } from './getter';

export const otherConfig = {
  publicUnshortenLink: getEnv('PUBLIC_UNSHORTENER_LINK'),
};
