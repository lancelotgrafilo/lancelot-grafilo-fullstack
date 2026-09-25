import '../../config/env.js';
import pool from '../../config/db.js';

const technologies = [
  { name: 'React', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express', category: 'Backend' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Docker', category: 'DevOps' },
];

const skills = [
  { name: 'React', category: 'Frontend', sort_order: 1 },
  { name: 'JavaScript', category: 'Frontend', sort_order: 2 },
  { name: 'Node.js', category: 'Backend', sort_order: 1 },
  { name: 'Express', category: 'Backend', sort_order: 2 },
  { name: 'PostgreSQL', category: 'Database', sort_order: 1 },
  { name: 'Docker', category: 'DevOps', sort_order: 1 },
  { name: 'Git', category: 'Tools', sort_order: 1 },
];

const experience = [
  {
    title: 'Bookkeeping & Executive Virtual Assistant',
    organization: 'Freelance',
    start_date: '2025-01-01',
    end_date: null,
    description: 'Xero Advisor Certified L1, L2, L3. Helping businesses stay organized and efficient.',
  },
];

const projects = [
  {
    title: 'Full-Stack Portfolio',
    slug: 'portfolio',
    summary: 'This site. A portfolio that is itself a working full-stack app.',
    description: 'Built phase by phase with React, Express, PostgreSQL, and Docker.',
    repo_url: 'https://github.com/lancelotgrafilo/lancelot-grafilo-fullstack.git',
    live_url: null,
    featured: true,
    sort_order: 1,
    tech: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Docker'],
  },
];

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Clear existing data so this script can run more than once.
    // TRUNCATE ... RESTART IDENTITY also resets the id counters back to 1.
    await client.query(
      'TRUNCATE project_technologies, projects, technologies, skills, experience, messages RESTART IDENTITY CASCADE'
    );

    const techIdByName = {};
    for (const t of technologies) {
      const result = await client.query(
        'INSERT INTO technologies (name, category) VALUES ($1, $2) RETURNING id',
        [t.name, t.category]
      );
      techIdByName[t.name] = result.rows[0].id;
    }

    for (const s of skills) {
      await client.query(
        'INSERT INTO skills (name, category, sort_order) VALUES ($1, $2, $3)',
        [s.name, s.category, s.sort_order]
      );
    }

    for (const e of experience) {
      await client.query(
        `INSERT INTO experience (title, organization, start_date, end_date, description)
         VALUES ($1, $2, $3, $4, $5)`,
        [e.title, e.organization, e.start_date, e.end_date, e.description]
      );
    }

    for (const p of projects) {
      const result = await client.query(
        `INSERT INTO projects (title, slug, summary, description, repo_url, live_url, featured, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [p.title, p.slug, p.summary, p.description, p.repo_url, p.live_url, p.featured, p.sort_order]
      );
      const projectId = result.rows[0].id;

      for (const techName of p.tech) {
        await client.query(
          'INSERT INTO project_technologies (project_id, technology_id) VALUES ($1, $2)',
          [projectId, techIdByName[techName]]
        );
      }
    }

    await client.query('COMMIT');
    console.log('Seed data inserted');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();