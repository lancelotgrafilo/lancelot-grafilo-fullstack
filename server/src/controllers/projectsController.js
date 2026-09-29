import pool from '../config/db.js';

export async function listProjects(req, res, next) {
  const { tech, search } = req.query;

  const conditions = [];
  const values = [];

  let baseQuery = `
    SELECT
      p.id, p.title, p.slug, p.summary, p.featured, p.sort_order,
      COALESCE(string_agg(DISTINCT t.name, ', ' ORDER BY t.name), '') AS tech
    FROM projects p
    LEFT JOIN project_technologies pt ON pt.project_id = p.id
    LEFT JOIN technologies t ON t.id = pt.technology_id
  `;

  if (tech) {
    conditions.push(`p.id IN (
      SELECT pt2.project_id FROM project_technologies pt2
      JOIN technologies t2 ON t2.id = pt2.technology_id
      WHERE t2.name = $${values.length + 1}
    )`);
    values.push(tech);
  }

  if (search) {
    conditions.push(`(p.title ILIKE $${values.length + 1} OR p.summary ILIKE $${values.length + 1})`);
    values.push(`%${search}%`);
  }

  if (conditions.length > 0) {
    baseQuery += ' WHERE ' + conditions.join(' AND ');
  }

  baseQuery += ' GROUP BY p.id ORDER BY p.sort_order, p.created_at DESC';

  try {
    const result = await pool.query(baseQuery, values);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

export async function getProjectBySlug(req, res, next) {
  const { slug } = req.params;

  const query = `
    SELECT
      p.id, p.title, p.slug, p.summary, p.description, p.repo_url, p.live_url,
      p.featured, p.created_at,
      COALESCE(string_agg(DISTINCT t.name, ', ' ORDER BY t.name), '') AS tech
    FROM projects p
    LEFT JOIN project_technologies pt ON pt.project_id = p.id
    LEFT JOIN technologies t ON t.id = pt.technology_id
    WHERE p.slug = $1
    GROUP BY p.id
  `;

  try {
    const result = await pool.query(query, [slug]);

    if (result.rows.length === 0) {
      const err = new Error('Project not found');
      err.status = 404;
      return next(err);
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function validateProject({ title, summary, tech }) {
  const fields = {};

  if (typeof title !== 'string' || title.trim().length < 1 || title.trim().length > 150) {
    fields.title = 'Title is required (max 150 characters).';
  }
  if (typeof summary !== 'string' || summary.trim().length < 1 || summary.trim().length > 300) {
    fields.summary = 'Summary is required (max 300 characters).';
  }
  if (tech !== undefined && !Array.isArray(tech)) {
    fields.tech = 'Technologies must be a list.';
  }

  return fields;
}

export async function createProject(req, res, next) {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const fields = validateProject(body);

  if (Object.keys(fields).length > 0) {
    return res.status(400).json({ error: 'Please fix the highlighted fields.', fields });
  }

  const title = body.title.trim();
  const summary = body.summary.trim();
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  const repoUrl = typeof body.repo_url === 'string' && body.repo_url.trim() ? body.repo_url.trim() : null;
  const liveUrl = typeof body.live_url === 'string' && body.live_url.trim() ? body.live_url.trim() : null;
  const featured = Boolean(body.featured);
  const tech = Array.isArray(body.tech) ? body.tech : [];

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let slug = slugify(title) || `project-${Date.now()}`;
    const existing = await client.query('SELECT 1 FROM projects WHERE slug = $1', [slug]);
    if (existing.rows.length > 0) {
      slug = `${slug}-${Date.now().toString().slice(-5)}`;
    }

    const result = await client.query(
      `INSERT INTO projects (title, slug, summary, description, repo_url, live_url, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [title, slug, summary, description, repoUrl, liveUrl, featured]
    );
    const projectId = result.rows[0].id;

    for (const techName of tech) {
      if (typeof techName !== 'string' || !techName.trim()) continue;
      const techResult = await client.query(
        `INSERT INTO technologies (name, category)
         VALUES ($1, 'Other')
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [techName.trim()]
      );
      await client.query(
        'INSERT INTO project_technologies (project_id, technology_id) VALUES ($1, $2)',
        [projectId, techResult.rows[0].id]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ id: projectId, slug });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
}

export async function updateProject(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid project id' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const fields = validateProject(body);

  if (Object.keys(fields).length > 0) {
    return res.status(400).json({ error: 'Please fix the highlighted fields.', fields });
  }

  const title = body.title.trim();
  const summary = body.summary.trim();
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  const repoUrl = typeof body.repo_url === 'string' && body.repo_url.trim() ? body.repo_url.trim() : null;
  const liveUrl = typeof body.live_url === 'string' && body.live_url.trim() ? body.live_url.trim() : null;
  const featured = Boolean(body.featured);
  const tech = Array.isArray(body.tech) ? body.tech : [];

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      `UPDATE projects
       SET title = $1, summary = $2, description = $3, repo_url = $4, live_url = $5, featured = $6
       WHERE id = $7 RETURNING id`,
      [title, summary, description, repoUrl, liveUrl, featured, id]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      const err = new Error('Project not found');
      err.status = 404;
      return next(err);
    }

    await client.query('DELETE FROM project_technologies WHERE project_id = $1', [id]);

    for (const techName of tech) {
      if (typeof techName !== 'string' || !techName.trim()) continue;
      const techResult = await client.query(
        `INSERT INTO technologies (name, category)
         VALUES ($1, 'Other')
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [techName.trim()]
      );
      await client.query(
        'INSERT INTO project_technologies (project_id, technology_id) VALUES ($1, $2)',
        [id, techResult.rows[0].id]
      );
    }

    await client.query('COMMIT');
    res.json({ id });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
}

export async function deleteProject(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid project id' });
  }

  try {
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      const err = new Error('Project not found');
      err.status = 404;
      return next(err);
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function getProjectById(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid project id' });
  }

  try {
    const result = await pool.query(
      `SELECT p.id, p.title, p.slug, p.summary, p.description, p.repo_url, p.live_url, p.featured,
         COALESCE(array_agg(t.name) FILTER (WHERE t.name IS NOT NULL), '{}') AS tech
       FROM projects p
       LEFT JOIN project_technologies pt ON pt.project_id = p.id
       LEFT JOIN technologies t ON t.id = pt.technology_id
       WHERE p.id = $1
       GROUP BY p.id`,
      [id]
    );

    if (result.rows.length === 0) {
      const err = new Error('Project not found');
      err.status = 404;
      return next(err);
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}