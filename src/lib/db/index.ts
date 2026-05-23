// ===========================================
// CYBER.DEV Portfolio — Database Connection
// Drizzle ORM + PostgreSQL (Neon)
// ===========================================

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Fix pg warning by explicitly using verify-full for SSL mode if require is configured
let dbUrl = process.env.DATABASE_URL!;
if (dbUrl && dbUrl.includes("sslmode=require")) {
  dbUrl = dbUrl.replace("sslmode=require", "sslmode=verify-full");
}

// Create a connection pool for PostgreSQL
const pool = new Pool({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false, // Required for Neon
  },
  max: 10, // Maximum number of connections in the pool
});

// Create the Drizzle instance with schema for relational queries
export const db = drizzle(pool, { schema });

// Export pool for manual query needs
export { pool };
