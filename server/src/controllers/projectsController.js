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