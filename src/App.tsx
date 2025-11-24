import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { Dashboard } from './pages/Dashboard';

import { CreateRoutine } from './pages/CreateRoutine';
import { RoutineDetail } from './pages/RoutineDetail';
import { ExerciseDetail } from './pages/ExerciseDetail';
import { WorkoutSession } from './pages/WorkoutSession';

function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Auth />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<CreateRoutine />} />
        <Route path="/routine/:id" element={<RoutineDetail />} />
        <Route path="/exercise/:id" element={<ExerciseDetail />} />
        <Route path="/workout/:id" element={<WorkoutSession />} />
      </Routes>
    </Router>
  );
}

export default App;
