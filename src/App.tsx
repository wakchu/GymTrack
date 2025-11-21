import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';

import { CreateRoutine } from './pages/CreateRoutine';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<CreateRoutine />} />
      </Routes>
    </Router>
  );
}

export default App;
