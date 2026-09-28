import '../config/env.js';
import process from 'node:process';
import readline from 'node:readline/promises';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Reads a line without showing what is typed
function askHidden(prompt) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    process.stdout.write(prompt);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    let input = '';

    const onData = (chunk) => {
      for (const ch of chunk) {
        if (ch === '\u0003') {
          stdin.setRawMode(false);
          process.stdout.write('\n');
          process.exit(1);
        }
        if (ch === '\r' || ch === '\n') {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener('data', onData);
          process.stdout.write('\n');
          resolve(input);
          return;
        }
        if (ch === '\u007F' || ch === '\b') {
          input = input.slice(0, -1);
        } else {
          input += ch;
        }
      }
    };

    stdin.on('data', onData);
  });
}

async function main() {
  if (!process.stdin.isTTY) {
    console.error('Run this script in an interactive terminal.');
    process.exitCode = 1;
    return;
  }

  const existing = await pool.query('SELECT COUNT(*)::int AS count FROM users');
  if (existing.rows[0].count > 0) {
    console.log('An admin user already exists. Nothing was changed.');
    return;
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const email = (await rl.question('Admin email: ')).trim().toLowerCase();
  rl.close();

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    console.error('That is not a valid email address.');
    process.exitCode = 1;
    return;
  }

  const password = await askHidden('Password (12 to 72 characters): ');
  const confirm = await askHidden('Repeat password: ');

  if (password !== confirm) {
    console.error('Passwords do not match.');
    process.exitCode = 1;
    return;
  }

  // bcrypt only uses the first 72 bytes, so longer passwords add nothing
  if (password.length < 12 || Buffer.byteLength(password) > 72) {
    console.error('Password must be at least 12 characters and at most 72 bytes.');
    process.exitCode = 1;
    return;
  }

  const hash = await bcrypt.hash(password, 12);

  await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, hash]);
  console.log('Admin user created.');
}

try {
  await main();
} catch (err) {
  console.error('Failed to create admin:', err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}