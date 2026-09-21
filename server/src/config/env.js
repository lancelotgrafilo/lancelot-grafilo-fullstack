import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load the .env file from the repo root (three folders up from here)
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });