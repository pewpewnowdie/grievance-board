import { useState } from "react";
import ReportFormModal from "./ReportFormModal";
import ReportCard from "./ReportCard";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function GrievanceCard({ grievance, token, setGrievances, isManager }) {
  const { token: authToken } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reports, setReports] = useState(grievance.reports || []);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "#4CAF50";
      case "reopened":
        return "#FF9800";
      case "closed":
        return "#999";
      default:
        return "#666";
    }
  };

  const handleReopen = async () => {
    setLoading(true);
    try {
      const res = await api(authToken).post(`/grievances/${grievance.id}/reopen`);
      if (setGrievances) {
        setGrievances((prev) =>
          prev.map((g) => (g.id === grievance.id ? res.data : g))
        );
      }
    } catch (err) {
      console.error("Error reopening grievance:", err);
      alert("Failed to reopen grievance");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    setLoading(true);
    try {
      const res = await api(authToken).post(`/grievances/${grievance.id}/close`);
      if (setGrievances) {
        setGrievances((prev) =>
          prev.map((g) => (g.id === grievance.id ? res.data : g))
        );
      }
    } catch (err) {
      console.error("Error closing grievance:", err);
      alert("Failed to close grievance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      border: "none",
      margin: "1.5rem 0",
      padding: "1.5rem",
      borderRadius: "12px",
      background: "white",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      transition: "all 0.3s ease"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
            <h3 style={{ margin: 0, color: "#333", fontSize: "1.3rem" }}>{grievance.title}</h3>
            <span
              style={{
                padding: "0.4rem 1rem",
                borderRadius: "20px",
                background: getStatusColor(grievance.status),
                color: "white",
                fontSize: "0.8rem",
                fontWeight: "bold",
                textTransform: "capitalize",
                display: "inline-block"
              }}
            >
              {grievance.status}
            </span>
          </div>
          <small style={{ color: "#666", fontSize: "0.95rem" }}>
            👤 {grievance.is_anonymous ? "Anonymous" : `${grievance.user?.name || "Unknown"}`}
          </small>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
          {isManager && (grievance.status === "open" || grievance.status === "reopened") && (
            <button
              onClick={handleClose}
              disabled={loading}
              style={{
                padding: "0.6rem 1rem",
                background: "#ff6b6b",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "0.9rem",
                transition: "all 0.3s ease",
                opacity: loading ? 0.7 : 1
              }}
              onMouseOver={(e) => !loading && (e.target.style.background = "#ff5252")}
              onMouseOut={(e) => !loading && (e.target.style.background = "#ff6b6b")}
            >
              {loading ? "⏳ Closing..." : "❌ Close"}
            </button>
          )}
          {isManager && grievance.status === "closed" && (
            <button
              onClick={handleReopen}
              disabled={loading}
              style={{
                padding: "0.6rem 1rem",
                background: "#51cf66",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "0.9rem",
                transition: "all 0.3s ease",
                opacity: loading ? 0.7 : 1
              }}
              onMouseOver={(e) => !loading && (e.target.style.background = "#40c057")}
              onMouseOut={(e) => !loading && (e.target.style.background = "#51cf66")}
            >
              {loading ? "⏳ Reopening..." : "🔄 Reopen"}
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              padding: "0.6rem 1.2rem",
              background: expanded ? "#667eea" : "#e9ecef",
              color: expanded ? "white" : "#333",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
            onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
          >
            {expanded ? "▼ Collapse" : "▶ Expand"}
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid #eee" }}>
          <p style={{ color: "#555", lineHeight: "1.6", fontSize: "1rem" }}>{grievance.description}</p>
          <div style={{ marginTop: "1.5rem", background: "#f8f9fa", padding: "1rem", borderRadius: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <strong style={{ color: "#333", fontSize: "1.1rem" }}>📝 Reports ({reports.length})</strong>
              <button
                onClick={() => setShowReportModal(true)}
                style={{
                  padding: "0.6rem 1rem",
                  background: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => e.target.style.background = "#5568d3"}
                onMouseOut={(e) => e.target.style.background = "#667eea"}
              >
                ➕ Add Report
              </button>
            </div>
            {showReportModal && (
              <ReportFormModal
                grievanceId={grievance.id}
                setShowModal={setShowReportModal}
                setReports={setReports}
              />
            )}
            <div style={{ marginTop: "1rem" }}>
              {reports.length === 0 && (
                <p style={{ color: "#999", fontStyle: "italic" }}>No reports yet.</p>
              )}
              {reports.map((r) => (
                <ReportCard key={r.id} report={r} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
