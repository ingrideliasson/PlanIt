import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api, { setAuthToken } from "./services/api";

import AuthPage from "./components/AuthPage";
import PersonalDashboard from "./components/PersonalDashboard";
import BoardView from "./components/BoardView";

function ProtectedRoute({ token, children }) {
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (token) {
      setAuthToken(token); // attach to axios
      try {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded);
      } catch (err) {
        console.error("Invalid token:", err);
        setAuthToken(null);
        setCurrentUser(null);
        setToken(null);
        localStorage.removeItem("token");
      }
    }
  }, [token]);

  const handleLogin = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
    try {
      setCurrentUser(jwtDecode(jwt));
    } catch (err) {
      console.error("Invalid login token:", err);
      setCurrentUser(null);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem("token");
    setAuthToken(null);
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
              <PersonalDashboard currentUser={currentUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/boards/:id"
          element={
            <ProtectedRoute token={token}>
              <BoardView currentUser={currentUser} onLogout={handleLogout} />
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
