import type { IService } from "../framework/services/IServices";

export function env(key: string, service : IService): string {
  const value = process.env[key];
  if (!value) throw new Error(
    `[${service.name}] Missing required environment variable: ${key}\n` +
    `Make sure it is set in your .env file.`
  );
  return value;
}