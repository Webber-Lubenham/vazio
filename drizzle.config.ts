import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
  // Configurações de migração
  migrations: {
    table: 'drizzle_migrations',
    schema: 'public',
  },
  // Configurações de seeds
  seeds: {
    directory: './drizzle/seeds',
  },
} satisfies Config; 