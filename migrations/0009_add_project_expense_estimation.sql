-- Migration number: 0009 	 2024-12-24T01:08:50.842Z

alter table projects add column expense_estimation decimal(10, 2) not null default 0;
