import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import pool from '../config/db.js';

describe('POST /api/contact', () => {
  beforeEach(async () => {
    await pool.query('DELETE FROM messages');
  });

  it('rejects an empty submission', async () => {
    const res = await request(app).post('/api/contact').send({ name: '', email: '', message: '' });
    expect(res.status).toBe(400);
    expect(res.body.fields).toHaveProperty('name');
    expect(res.body.fields).toHaveProperty('email');
    expect(res.body.fields).toHaveProperty('message');
  });

  it('rejects an invalid email', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Test', email: 'not-an-email', message: 'A message long enough to pass.' });
    expect(res.status).toBe(400);
    expect(res.body.fields.email).toBeDefined();
  });

  it('strips HTML tags from a valid submission', async () => {
    const res = await request(app).post('/api/contact').send({
      name: '<b>Lance</b>',
      email: 'TEST@Example.com',
      message: 'Hello <script>alert(1)</script> this is a real message.',
    });

    expect(res.status).toBe(201);

    const stored = await pool.query('SELECT name, email, message FROM messages');
    expect(stored.rows[0].name).toBe('Lance');
    expect(stored.rows[0].email).toBe('test@example.com');
    expect(stored.rows[0].message).not.toContain('<script>');
  });

  it('silently accepts but does not save a honeypot submission', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Bot',
      email: 'bot@example.com',
      message: 'Buy cheap stuff now please.',
      website: 'http://spam.example',
    });

    expect(res.status).toBe(201);

    const stored = await pool.query('SELECT COUNT(*) FROM messages WHERE email = $1', ['bot@example.com']);
    expect(Number(stored.rows[0].count)).toBe(0);
  });
});