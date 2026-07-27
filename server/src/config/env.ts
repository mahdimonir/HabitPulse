import dotenv from 'dotenv';

dotenv.config();

function getEnvVariable(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is required but was not provided.`);
  }
  return value;
}

export const config = {
  port: parseInt(process.env.PORT || '8000', 10),
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  databaseUrl: getEnvVariable('DATABASE_URL'),
  jwt: {
    accessSecret: getEnvVariable('JWT_ACCESS_SECRET', 'dev-jwt-access-secret-change-in-production'),
    refreshSecret: getEnvVariable('JWT_REFRESH_SECRET', 'dev-jwt-refresh-secret-change-in-production'),
    accessExpiresIn: '15m',
    refreshExpiresIn: '7d',
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
} as const;

export type Config = typeof config;
