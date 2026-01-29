import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";

// Helper to decode JWT
function decodeToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api().post("/auth/login", { email, password });
      const decoded = decodeToken(res.data.access_token);
      console.log("Decoded token:", decoded);
      const user = {
        id: parseInt(decoded?.sub),
        email,
        role: (decoded?.role || "user").toLowerCase(),
      };
      console.log("User object:", user);
      login(res.data.access_token, user);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "2rem"
    }}>
      <div style={{
        background: "white",
        padding: "3rem",
        borderRadius: "12px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <h2 style={{ textAlign: "center", color: "#333", marginBottom: "2rem", fontSize: "1.8rem" }}>
          🔐 Login
        </h2>
        {error && (
          <p style={{
            color: "#ff6b6b",
            background: "#ffe0e0",
            padding: "0.75rem",
            borderRadius: "6px",
            marginBottom: "1rem",
            textAlign: "center"
          }}>
            ⚠️ {error}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#333", fontWeight: "bold" }}>
              Email:
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #e9ecef",
                borderRadius: "6px",
                fontSize: "1rem",
                boxSizing: "border-box",
                transition: "border-color 0.3s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
            />
          </div>
          <div style={{ marginBottom: "2rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "#333", fontWeight: "bold" }}>
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #e9ecef",
                borderRadius: "6px",
                fontSize: "1rem",
                boxSizing: "border-box",
                transition: "border-color 0.3s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e9ecef"}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.85rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)"
            }}
            onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
            onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
