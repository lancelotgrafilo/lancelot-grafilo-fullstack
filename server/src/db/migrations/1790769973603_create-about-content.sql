-- Up Migration
CREATE TABLE about_content (
  id         INTEGER PRIMARY KEY DEFAULT 1,
  intro      TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT about_content_singleton CHECK (id = 1)
);

INSERT INTO about_content (id, intro) VALUES (
  1,
  'I''m Lancelot, a Xero Advisor Certified bookkeeping and executive virtual assistant based in Masbate, Philippines, currently expanding into full-stack development with React, Node.js, Express, PostgreSQL, and Docker. This site is itself a working example of that stack.'
);

-- Down Migration
DROP TABLE about_content;