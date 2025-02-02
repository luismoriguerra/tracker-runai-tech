-- Migration number: 0007 	 2024-12-23T23:08:31.559Z
DROP TABLE IF EXISTS budget_expenses;
CREATE TABLE budget_expenses (
    id TEXT PRIMARY KEY,
    budget_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('pending', 'paid')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);