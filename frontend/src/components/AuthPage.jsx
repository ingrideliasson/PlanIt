import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthPage({ onLogin }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="flex h-screen bg-gradient-to-tr from-fuchsia-800 via-pink-800 to-yellow-400">
      {/* Left side text */}
      <div className="hidden lg:flex w-1/2 justify-center items-center xl:justify-end xl:pr-16 px-12">
        <div className="text-white text-center font-montserrat text-4xl lg:text-5xl xl:text-6xl">
          <h1 className="mb-2">Don't just do it...</h1>
          <h1>Plan It!</h1>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex-1 flex justify-center items-center xl:justify-start xl:pl-16 px-6">
        <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl shadow-lg rounded-xl bg-fuchsia-900 p-8 md:px-12 md:py-12">
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

