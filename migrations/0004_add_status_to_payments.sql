-- Migration number: 0004 	 2024-12-21T21:46:54.354Z

ALTER TABLE project_payments ADD COLUMN status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid'));
