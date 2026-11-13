import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000').transform(Number),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/silwasa_cms?schema=public'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  CORS_ORIGINS: z.string().default('http://localhost:3000,http://127.0.0.1:3000'),
  SESSION_SECRET: z.string().default('development-super-secret-session-key-min-32-chars-long'),
  JWT_SECRET: z.string().default('development-super-secret-jwt-key-min-32-chars-long'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  MEDIA_UPLOAD_DIR: z.string().default('./uploads'),
  EMAIL_FROM: z.string().default('contact@silwasa.com'),
  EMAIL_FROM_NAME: z.string().default('Silwasa IT Solutions'),
});

const parsed = envSchema.safeParse(process.cwd() ? process.env : {});

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
