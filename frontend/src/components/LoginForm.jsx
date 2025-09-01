import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

export default function LoginForm({ onLogin, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.token;
      if (!token) throw new Error("No token returned from server.");

      localStorage.setItem("token", token);
      if (onLogin) onLogin(token);
      navigate("/dashboard");
    } catch (err) {
      let errorMsg = "Login failed. Please check your credentials.";
      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          errorMsg = err.response.data;
        } else if (Array.isArray(err.response.data) && err.response.data[0]?.description) {
          errorMsg = err.response.data[0].description;
        } else if (err.response.data.message) {
          errorMsg = err.response.data.message;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    }
  };

return (
  <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
    {/* Title */}
    <h2 className="text-4xl text-white font-montserrat">Login</h2>
    <p className="text-sm font-montserrat text-white mb-2">
      No account?{" "}
      <button
        type="button"
        onClick={switchToRegister}
        className="underline hover:text-pink-300"
      >
        Register
      </button>
    </p>

    {/* Email input */}
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
      className="w-full px-4 py-2 rounded bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
    />

    {/* Password input with toggle */}
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-4 py-2 rounded bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
      >
        {showPassword ? <FaEyeSlash 
        className="text-xl"/> 
        : <FaEye 
        className="text-xl"/>}
      </button>
    </div>

    {/* Submit button */}
    <button
      type="submit"
      className="w-full py-3 bg-orange-600 rounded-lg hover:bg-orange-500 transition-colors text-white text-xl font-montserrat"
    >
      Login
    </button>

    {/* Messages */}
    {message && <p className="text-green-500 mt-2">{message}</p>}
    {error && <p className="text-orange-500 mt-2">{error}</p>}
  </form>
);

}

