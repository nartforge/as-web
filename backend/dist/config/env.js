import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(4000),
    FRONTEND_URL: z.string().url().default('http://localhost:3000'),
    BACKEND_URL: z.string().url().default('http://localhost:4000'),
    DATABASE_URL: z.string().min(1).default('mysql://root:password@localhost:3306/nartforge'),
    JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters').default('development-only-change-me'),
    JWT_EXPIRES_IN: z.string().default('7d'),
    DISCORD_CLIENT_ID: z.string().optional().default(''),
    DISCORD_CLIENT_SECRET: z.string().optional().default(''),
    DISCORD_REDIRECT_URI: z.string().optional().default(''),
    DISCORD_SCOPES: z.string().default('identify email'),
    SHOPIER_PAYMENT_URL: z.string().optional().default(''),
    SHOPIER_API_KEY: z.string().optional().default(''),
    SHOPIER_API_SECRET: z.string().optional().default(''),
    SHOPIER_CALLBACK_URL: z.string().optional().default(''),
    SHOPIER_SUCCESS_URL: z.string().optional().default(''),
    SHOPIER_FAIL_URL: z.string().optional().default(''),
});
export const env = envSchema.parse(process.env);
