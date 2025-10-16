import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from '../db/schema';

let dbInstance: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (dbInstance) return dbInstance;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const pool = new Pool({ connectionString: databaseUrl });
  dbInstance = drizzle(pool, { schema });
  return dbInstance;
}
