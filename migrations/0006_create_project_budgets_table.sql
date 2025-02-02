-- Migration number: 0006 	 2024-12-23T23:00:49.524Z
DROP TABLE IF EXISTS project_budgets;
CREATE TABLE project_budgets (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    estimated_amount DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

