import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";

export default function GrievanceFormModal({ setShowModal, setGrievances }) {
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api(token).post("/grievances/", {
        title,
        description,
        is_anonymous: isAnonymous,
      });
      setGrievances((prev) => [...prev, res.data]);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setError("Failed to create grievance");
    }
  };

  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <h3>Add Grievance</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
  padding: "2rem",
  borderRadius: "8px",
  minWidth: "300px",
  maxWidth: "500px",
};
