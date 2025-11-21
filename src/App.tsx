import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';

import { CreateRoutine } from './pages/CreateRoutine';
import { RoutineDetail } from './pages/RoutineDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<CreateRoutine />} />
        <Route path="/routine/:id" element={<RoutineDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
