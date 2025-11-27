-- Add created_at column to workout_logs if it doesn't exist
alter table workout_logs 
add column if not exists created_at timestamptz default now();
