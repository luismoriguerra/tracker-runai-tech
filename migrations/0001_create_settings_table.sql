-- Migration number: 0001 	 2024-12-21T18:32:08.781Z

CREATE TABLE settings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT NOT NULL
);
