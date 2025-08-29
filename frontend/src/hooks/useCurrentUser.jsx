import { useState, useEffect } from "react";

export default function useCurrentUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const base64Payload = token.split(".")[1];
      const jsonPayload = decodeURIComponent(
        atob(base64Payload)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const payload = JSON.parse(jsonPayload);
      setUser(payload);
    } catch (err) {
      console.error("Failed to parse JWT:", err);
      setUser(null);
    }
  }, []);

  return user;
}
