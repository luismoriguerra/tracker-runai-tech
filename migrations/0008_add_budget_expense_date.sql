-- Migration number: 0008 	 2024-12-23T23:29:10.065Z

-- First add the column without a default
ALTER TABLE budget_expenses ADD COLUMN expense_date date;
