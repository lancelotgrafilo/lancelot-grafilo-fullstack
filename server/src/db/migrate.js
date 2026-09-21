import '../config/env.js';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import * as pgMigrate from 'node-pg-migrate';

// The runner is exported under a different name depending on the version
const runner = pgMigrate.runner ?? pgMigrate.default;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const direction = process.argv[2] === 'down' ? 'down' : 'up';

try {
  await runner({
    databaseUrl: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || process.env.POSTGRES_PORT) || 5432,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    },
    dir: path.resolve(__dirname, 'migrations'),
    migrationsTable: 'pgmigrations',
    direction,
    // "down" undoes only the latest migration, "up" applies all pending ones
    ...(direction === 'down' ? { count: 1 } : {}),
    log: console.log,
  });
  console.log(`Migrations (${direction}) finished`);
} catch (err) {
  console.error('Migration failed:', err.message);
  process.exit(1);
}