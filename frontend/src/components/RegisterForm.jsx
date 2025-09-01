import { useState } from "react";
import api from "../services/api";

export default function RegisterForm({ onSuccess, switchToLogin }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await api.post("/auth/register", { firstName, lastName, email, password });
      setMessage("Registration successful! Please log in.");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      if (onSuccess) onSuccess();
    } catch (err) {
      const errorMsg =
        err.response?.data?.[0]?.description ||
        err.response?.data ||
        err.message ||
        "Unknown error";
      setError(errorMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {/* Title */}
      <h1 className="text-4xl font-montserrat text-white">Create Account</h1>
      <p className="text-sm font-montserrat text-white mb-2">
        Already have an account?{" "}
        <button
          type="button"
          onClick={switchToLogin}
          className="underline hover:text-pink-300"
        >
          Log in
        </button>
      </p>

      {/* Inputs */}
      <div className="flex flex-row gap-2">
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        className="w-full px-4 py-2 rounded bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        className="w-full px-4 py-2 rounded bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      </div>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-2 rounded bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-4 py-2 rounded bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        className="w-full px-4 py-2 rounded bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />

      {/* Submit button */}
      <button
        type="submit"
        className="w-full py-3 bg-orange-600 rounded-lg hover:bg-orange-500 transition-colors text-white text-xl font-montserrat"
      >
        Create Account
      </button>

      {/* Divider */}
      <div className="flex items-center gap-2 my-2 text-gray-200 text-sm">
        <hr className="flex-1 border-gray-300" />
        <span>or register with</span>
        <hr className="flex-1 border-gray-200" />
      </div>

      {/* Social buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button className="flex-1 py-2 bg-red-600 rounded hover:bg-red-700 transition-colors">
          Google
        </button>
        <button className="flex-1 py-2 bg-blue-800 rounded hover:bg-blue-900 transition-colors">
          Facebook
        </button>
      </div>

      {/* Messages */}
      {message && <p className="text-green-500 mt-2">{message}</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}

