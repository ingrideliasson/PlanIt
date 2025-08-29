import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthPage({ onLogin }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="flex h-screen bg-gradient-to">
      {/* Left side */}
      <div className="w-1/2 bg-slate-800 text-white flex flex-col justify-center items-center p-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to TaskTracker</h1>
        <p className="max-w-sm text-center text-slate-300">
          Manage tasks, track issues, and stay productive with your team.
        </p>
      </div>

      {/* Right side */}
      <div className="w-1/2 flex justify-center items-center">
        <div className="w-full max-w-sm p-6 bg-white shadow-lg rounded-xl">
          {showLogin ? (
            <LoginForm
              onLogin={onLogin}
              switchToRegister={() => setShowLogin(false)}
            />
          ) : (
            <RegisterForm
              onSuccess={() => setShowLogin(true)}
              switchToLogin={() => setShowLogin(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
