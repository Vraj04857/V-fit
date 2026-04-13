import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import WorkoutPage from './pages/WorkoutPage';
import DietPage from './pages/DietPage';
import ProgressPage from './pages/ProgressPage';
import AiAssistantPage from './pages/Aiassistantpage';

const GOOGLE_CLIENT_ID = '105127700631-0jikef3c58klcg0f96uki07s6vi4d6m7.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/workout" element={<WorkoutPage/>}/>
          <Route path="/diet" element={<DietPage/>}/>
          <Route path="/progress" element={<ProgressPage/>}/>
          <Route path="/ai" element={<AiAssistantPage/>}/>
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;