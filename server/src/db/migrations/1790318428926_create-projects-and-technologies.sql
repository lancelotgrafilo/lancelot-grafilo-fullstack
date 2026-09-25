-- Up Migration
CREATE TABLE technologies (
  id       INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name     TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL
);

CREATE TABLE projects (
  id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  summary     TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  repo_url    TEXT,
  live_url    TEXT,
  featured    BOOLEAN NOT NULL DEFAULT false,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE project_technologies (
  project_id     INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  technology_id  INTEGER NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, technology_id)
);

CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_project_technologies_technology_id ON project_technologies(technology_id);

-- Down Migration
DROP TABLE project_technologies;
DROP TABLE projects;
DROP TABLE technologies;