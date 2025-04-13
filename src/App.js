import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import GoalTracker from './pages/GoalTracker';
import AccountabilityCircle from './pages/AccountabilityCircle';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/goals" element={<GoalTracker />} />
          <Route path="/accountability" element={<AccountabilityCircle />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;



