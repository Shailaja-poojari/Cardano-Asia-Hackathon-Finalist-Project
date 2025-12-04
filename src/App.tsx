// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';

import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { PersonaStudioPage } from './pages/PersonaStudioPage';
import { AgentChatPage } from './pages/AgentChatPage';
import { ProofCenterPage } from './pages/ProofCenterPage';
import { ActivityLogPage } from './pages/ActivityLogPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Authenticated app shell */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="personas" element={<PersonaStudioPage />} />
          <Route path="chat" element={<AgentChatPage />} />
          <Route path="proofs" element={<ProofCenterPage />} />
          <Route path="activity" element={<ActivityLogPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
