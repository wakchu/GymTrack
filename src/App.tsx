import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';

import { CreateRoutine } from './pages/CreateRoutine';
import { RoutineDetail } from './pages/RoutineDetail';
import { ExerciseDetail } from './pages/ExerciseDetail';
import { WorkoutSession } from './pages/WorkoutSession';

function App() {
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
