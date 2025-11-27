-- Add missing policies for updating and deleting exercises

create policy "Users can update exercises for their routines" on exercises
  for update using (
    exists ( select 1 from routines where id = exercises.routine_id and user_id = auth.uid() )
  );

create policy "Users can delete exercises for their routines" on exercises
  for delete using (
    exists ( select 1 from routines where id = exercises.routine_id and user_id = auth.uid() )
  );
