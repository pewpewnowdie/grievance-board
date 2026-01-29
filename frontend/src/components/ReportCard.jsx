export default function ReportCard({ report }) {
  return (
    <div style={{
      marginLeft: "0",
      padding: "1rem",
      marginBottom: "0.75rem",
      borderLeft: "4px solid #667eea",
      background: "white",
      borderRadius: "6px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
    }}>
      <p style={{ margin: "0 0 0.5rem 0", color: "#333", lineHeight: "1.5" }}>{report.content}</p>
      <small style={{ color: "#999", fontSize: "0.85rem" }}>
        👤 {report.is_anonymous ? "Anonymous" : `${report.user?.name || "Unknown"}`}
      </small>
    </div>
  );
}
