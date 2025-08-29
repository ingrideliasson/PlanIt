import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import api, { setAuthToken } from "./services/api";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("jwt") || null );

  useEffect(() => {
    if (token) setAuthToken(token);
  }, [token]);

  const handleLogin = (jwt) => setToken(jwt);

  return (
    <div>
      {!token ?(
        <>
          <h2>Register</h2>
          <RegisterForm />
          <h2>Login</h2>
          <LoginForm onLogin={handleLogin} />
        </>
      ) : (
        <h2>Logged in!</h2>
      )}
    </div>
  );
}