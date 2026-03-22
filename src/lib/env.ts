import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_GEMINI_API_KEY: z.string().optional(),
  GITHUB_TOKEN: z.string().optional(),
  DATABASE_URL: z.string().default('file:./dev.db?timeout=10000'),
  NODE_ENV: z.enum(['development', 'production'] as const).default('development'),
});

export const env = envSchema.parse(process.env);
