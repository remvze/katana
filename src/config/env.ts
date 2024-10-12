export function getEnvSource() {
  return import.meta.env ?? process.env;
}
