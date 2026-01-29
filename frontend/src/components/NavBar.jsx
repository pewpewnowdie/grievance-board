import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      color: "white"
    }}>
      <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "bold" }}>📋 Grievance Board</h2>
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <span style={{ fontSize: "0.95rem" }}>
          {user?.email || ""} | <strong style={{ color: "#ffd700" }}>{user?.role || "none"}</strong>
        </span>
        <button
          onClick={handleLogout}
          style={{
            padding: "0.6rem 1.2rem",
            background: "#fff",
            color: "#667eea",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontSize: "0.95rem"
          }}
          onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
          onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
