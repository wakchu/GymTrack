-- Enable RLS on workout_logs if not already enabled
alter table workout_logs enable row level security;

-- Policy for selecting logs (viewing history)
create policy "Users can view their own workout logs" on workout_logs
  for select using (
    exists (
      select 1 from routines
      where routines.id = workout_logs.routine_id
      and routines.user_id = auth.uid()
    )
  );

-- Policy for inserting logs (logging workouts)
create policy "Users can insert their own workout logs" on workout_logs
  for insert with check (
    exists (
      select 1 from routines
      where routines.id = workout_logs.routine_id
      and routines.user_id = auth.uid()
    )
  );

-- Policy for updating logs
create policy "Users can update their own workout logs" on workout_logs
  for update using (
    exists (
      select 1 from routines
      where routines.id = workout_logs.routine_id
      and routines.user_id = auth.uid()
    )
  );

-- Policy for deleting logs
create policy "Users can delete their own workout logs" on workout_logs
  for delete using (
    exists (
      select 1 from routines
      where routines.id = workout_logs.routine_id
      and routines.user_id = auth.uid()
    )
  );
