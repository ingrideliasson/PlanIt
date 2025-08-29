import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function LoginForm({onLogin, switchToRegister}) {
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

            localStorage.setItem("token", token); // save JWT
            if (onLogin) onLogin(token);
            navigate("/dashboard");
        } catch (err) {
            // Extract meaningful message from axios error
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
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <div style={{ position: "relative" }}>
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                        position: "absolute",
                        right: "5px",
                        top: "50%",
                        transform: "translateY(-50%)"
                    }}
                >
                    {showPassword ? "🙈" : "👁️"}
                </button>
            </div>
            <button type="submit">Login</button>
            <p>No account?{" "}
                <button type="button" onClick={switchToRegister}>
                    Register
                </button>
            </p>
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
}
