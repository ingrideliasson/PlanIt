import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PersonalDashboard from "./components/PersonalDashboard";
import AuthPage from "./components/AuthPage";
import { setAuthToken } from "./services/api";

function ProtectedRoute({ token, children }) {
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("jwt") || null);

  useEffect(() => {
    if (token) setAuthToken(token);
  }, [token]);

  const handleLogin = (jwt) => setToken(jwt);
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("jwt");
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage onLogin={handleLogin} />} />
        <Route path="/register" element={<AuthPage onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute token={token}>
              <PersonalDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}