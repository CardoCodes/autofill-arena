import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Popup from './pages/Popup';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import { ResumeProvider } from './contexts/ResumeContext';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ResumeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Popup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Router>
      </ResumeProvider>
    </AuthProvider>
  );
};

export default App;