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
      <h1 className="text-4xl font-montserrat text-neutral-100 tracking-wider">Create Account</h1>
      <p className="text-sm font-montserrat text-neutral-200 mb-2">
        Already have an account?{" "}
        <button
          type="button"
          onClick={switchToLogin}
          className="underline text-primary-700 hover:text-neutral-100"
        >
          Log in
        </button>
      </p>

      {/* Inputs */}
      <div className="flex flex-row gap-4">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="w-full px-4 py-2 rounded border-2 border-stone-300 bg-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="w-full px-4 py-2 rounded border-2 border-stone-300 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-2 rounded border-2 border-stone-300 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-4 py-2 rounded border-2 border-stone-300 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        className="w-full px-4 py-2 rounded border-2 border-stone-300 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
      />

      {/* Submit button */}
      <button
        type="submit"
        className="w-full py-3 bg-transparent rounded-lg hover:scale-105 hover:underline transition-colors text-white text-lg font-montserrat"
      >
        Register
      </button>

      {/* Messages */}
      {message && <p className="text-neutral-100 text-sm mt-2">{message}</p>}
      {error && <p className="text-neutral-100 text-md mt-2">{error}</p>}
    </form>
  );
}

