-- Up Migration
CREATE TABLE skills (
  id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       TEXT NOT NULL,
  category   TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE experience (
  id           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title        TEXT NOT NULL,
  organization TEXT NOT NULL,
  start_date   DATE NOT NULL,
  end_date     DATE,
  description  TEXT NOT NULL DEFAULT ''
);

CREATE TABLE messages (
  id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  message    TEXT NOT NULL,
  is_read    BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_is_read ON messages(is_read);

-- Down Migration
DROP TABLE messages;
DROP TABLE experience;
DROP TABLE skills;