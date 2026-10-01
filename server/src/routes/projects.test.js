import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import pool from '../config/db.js';
import { resetTestData  } from '../db/testSetup.js';

describe('GET /api/projects', () => {
  beforeEach(async () => {
    await resetTestData();
  });

  it('returns an empty array when there are no projects', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns a seeded project with its technologies', async () => {
    const projectResult = await pool.query(
      `INSERT INTO projects (title, slug, summary, featured)
       VALUES ('Test Project', 'test-project', 'A project for testing.', true)
       RETURNING id`
    );
    const projectId = projectResult.rows[0].id;

    const techResult = await pool.query(
      "INSERT INTO technologies (name, category) VALUES ('TestTech', 'Other') RETURNING id"
    );
    await pool.query(
      'INSERT INTO project_technologies (project_id, technology_id) VALUES ($1, $2)',
      [projectId, techResult.rows[0].id]
    );

    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('Test Project');
    expect(res.body[0].tech).toBe('TestTech');
  });

  it('filters by technology', async () => {
    await pool.query(
      `INSERT INTO projects (title, slug, summary) VALUES ('No Tech Project', 'no-tech', 'Has no linked technology.')`
    );

    const res = await request(app).get('/api/projects?tech=NonexistentTech');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('GET /api/projects/:slug', () => {
  beforeEach(async () => {
    await resetTestData();
  });

  it('returns 404 for a slug that does not exist', async () => {
    const res = await request(app).get('/api/projects/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Project not found');
  });

  it('returns the full project for a valid slug', async () => {
    await pool.query(
      `INSERT INTO projects (title, slug, summary, description)
       VALUES ('Detail Test', 'detail-test', 'Summary here.', 'Full description here.')`
    );

    const res = await request(app).get('/api/projects/detail-test');
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Detail Test');
    expect(res.body.description).toBe('Full description here.');
  });
});