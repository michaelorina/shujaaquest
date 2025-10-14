import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from '../db/schema';

const getDbConnection = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  const pool = new Pool({ connectionString: databaseUrl });
  return drizzle(pool, { schema });
};

export const db = getDbConnection();
