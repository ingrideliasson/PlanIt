import { useState } from "react";
import api from "../services/api";

export default function RegisterForm( {onSuccess, switchToLogin} ) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await api.post("/auth/register", { email, password, firstName, lastName});
            setMessage("Registration successful! Please log in.");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            if (onSuccess) onSuccess(); // Tell App to redirect to login
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
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
            <button type="submit">Register</button>
            <p>Already have an account?{" "}
                <button type="button" onClick={switchToLogin}>
                    Log in
                </button>
            </p>
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
}