import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useState, useEffect } from 'react';
import { usePWAInstall } from './hooks/usePWAInstall';
import { usePWASetup } from './hooks/usePWASetup';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SplashScreen from './components/SplashScreen';
import Onboarding from './components/Onboarding';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import DiagnosticTest from './components/DiagnosticTest';
import DiagnosticResults from './components/DiagnosticResults';
import LearningPath from './components/LearningPath';
import Lesson from './components/Lesson';
import Exercise from './components/Exercise';
import Streak from './components/Streak';
import Challenges from './components/Challenges';
import Groups from './components/Groups';
import CreateGroup from './components/CreateGroup';
import GroupDetail from './components/GroupDetail';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import Store from './components/Store';
import Settings from './components/Settings';
import AccountManagement from './components/AccountManagement';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import About from './components/About';
import Help from './components/Help';
import ForgotPassword from './components/ForgotPassword';
import ChallengeExercise from './components/ChallengeExercise';
import Notifications from './components/Notifications';
import InstallBanner from './components/InstallBanner';

function AppRoutes() {
  const [showSplash, setShowSplash] = useState(true);
  const { isAuthenticated, isLoading } = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const { prompt, install, canInstall, isIOS } = usePWAInstall();
  usePWASetup();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash || isLoading) {
    return <SplashScreen />;
  }

  return (
    <BrowserRouter>
      <div className="size-full bg-background max-w-md mx-auto relative">
        {canInstall && <InstallBanner onInstall={install} isIOS={isIOS} />}
        <Routes>
          <Route path="/" element={
            !hasSeenOnboarding ? <Navigate to="/onboarding" /> :
              !isAuthenticated ? <Navigate to="/login" /> :
                <Navigate to="/dashboard" />
          } />
          <Route path="/onboarding" element={<Onboarding onComplete={() => setHasSeenOnboarding(true)} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/diagnostic" element={<DiagnosticTest />} />
          <Route path="/diagnostic-results" element={<DiagnosticResults />} />
          <Route path="/learning-path" element={<LearningPath />} />
          <Route path="/lesson/:id" element={<Lesson />} />
          <Route path="/exercise/:id" element={<Exercise />} />
          <Route path="/streak" element={<Streak />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/create" element={<CreateGroup />} />
          <Route path="/groups/:id" element={<GroupDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/store" element={<Store />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/account" element={<AccountManagement />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/challenges/:id/exercise" element={<ChallengeExercise />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}