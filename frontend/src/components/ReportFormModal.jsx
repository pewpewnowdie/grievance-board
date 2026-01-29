import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";

export default function ReportFormModal({ grievanceId, setShowModal, setReports }) {
  const { token } = useAuth();
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api(token).post("/reports/", {
        grievance_id: grievanceId,
        content,
        is_anonymous: isAnonymous,
      });
      setReports((prev) => [...prev, res.data]);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setError("Failed to add report");
    }
  };

  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <h4>Add Report</h4>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Report content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <label>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            Anonymous
          </label>
          <div style={{ marginTop: "0.5rem" }}>
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setShowModal(false)} style={{ marginLeft: "1rem" }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  background: "#fff",
  padding: "1.5rem",
  borderRadius: "8px",
  minWidth: "300px",
  maxWidth: "400px",
};
