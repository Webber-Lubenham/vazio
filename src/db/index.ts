import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não está definida nas variáveis de ambiente');
}

const connectionString = process.env.DATABASE_URL;

// Desativa preparação de queries para melhor performance
const client = postgres(connectionString, { 
  prepare: false,
  ssl: {
    rejectUnauthorized: false // Permite certificados auto-assinados em desenvolvimento
  }
});

export const db = drizzle(client, { schema }); 