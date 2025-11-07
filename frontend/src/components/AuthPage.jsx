import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthPage({ onLogin }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="flex h-screen bg-gradient-to-tr from-fuchsia-900 via-pink-800 to-yellow-400">
      <div className="hidden lg:flex w-1/2 items-center justify-center xl:justify-end xl:pr-16 px-12 relative overflow-hidden">
        <div className="relative text-left max-w-lg">
          <h1 className="font-playfair text-white text-7xl leading-tight text-center">
            Don't just do it.
            <br />
            Plan It.
          </h1>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center xl:justify-start xl:pl-16 px-6">
        <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl shadow-card rounded-2xl bg-fuchsia-900 p-8 md:px-12 md:py-12">
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

