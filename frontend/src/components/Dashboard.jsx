import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";
import GrievanceFormModal from "./GrievanceFormModal";
import ReportFormModal from "./ReportFormModal";

export default function Dashboard() {
  const { token, user } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [mergeSource, setMergeSource] = useState(null);

  const fetchGrievances = useCallback(async () => {
    try {
      const client = token ? api(token) : api();
      const res = await client.get("/grievances/");
      setGrievances(res.data);
    } catch (err) {
      console.error("Error fetching grievances:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchGrievances();
  }, [fetchGrievances]);

  const filteredGrievances = grievances
    .filter((g) => statusFilter === "all" || g.status === statusFilter)
    .filter((g) =>
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const stats = {
    total: grievances.length,
    open: grievances.filter(g => g.status === "open").length,
    reopened: grievances.filter(g => g.status === "reopened").length,
    closed: grievances.filter(g => g.status === "closed").length,
  };

  const isManager = user?.role === "manager";

  const StatCard = ({ label, value, color, icon }) => (
    <div style={{
      flex: 1,
      minWidth: "150px",
      background: "white",
      padding: "1.5rem",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      borderLeft: `4px solid ${color}`,
      textAlign: "center"
    }}>
      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{icon}</div>
      <div style={{ fontSize: "2rem", fontWeight: "bold", color }}>{value}</div>
      <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>{label}</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", paddingBottom: "2rem" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
        {/* Header with stats */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ color: "#2c3e50", marginBottom: "1.5rem", fontSize: "2.5rem", fontWeight: "bold" }}>
            📊 Grievance Board
          </h1>

          {/* Stats cards */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
            <StatCard label="Total" value={stats.total} color="#667eea" icon="📋" />
            <StatCard label="Open" value={stats.open} color="#4CAF50" icon="🔴" />
            <StatCard label="Reopened" value={stats.reopened} color="#FF9800" icon="🟠" />
            <StatCard label="Closed" value={stats.closed} color="#999" icon="⚫" />
          </div>
        </div>

        {/* Controls */}
        <div style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "10px",
          marginBottom: "2rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={() => setShowModal(true)}
              style={{
                padding: "0.8rem 1.6rem",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1rem",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)"
              }}
              onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
            >
              ➕ New Grievance
            </button>

            <input
              type="text"
              placeholder="🔍 Search grievances..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                minWidth: "250px",
                padding: "0.8rem 1.2rem",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "1rem",
                transition: "border-color 0.3s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: "0.8rem 1.2rem",
                borderRadius: "8px",
                border: "2px solid #667eea",
                background: "white",
                fontSize: "1rem",
                cursor: "pointer",
                fontWeight: "500",
                color: "#333"
              }}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="reopened">Reopened</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {showModal && (
          <GrievanceFormModal
            setShowModal={setShowModal}
            setGrievances={setGrievances}
          />
        )}

        {/* Grievances List */}
        <div style={{ background: "white", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          {filteredGrievances.length === 0 ? (
            <div style={{
              padding: "3rem",
              textAlign: "center",
              color: "#999"
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎯</div>
              <p style={{ fontSize: "1.1rem" }}>No grievances found matching your search.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1.5fr 140px 160px",
                background: "#f8f9fa",
                borderBottom: "2px solid #e0e0e0",
                padding: "1rem",
                fontWeight: "bold",
                color: "#333",
                gap: "1rem"
              }}>
                <div>Title</div>
                <div style={{ textAlign: "left" }}>Status</div>
                <div style={{ textAlign: "left" }}>Reporter</div>
                <div style={{ textAlign: "center" }}>Reports</div>
                <div style={{ textAlign: "center" }}>Action</div>
              </div>

              {/* Rows */}
              {filteredGrievances.map((g) => (
                <div key={g.id}
                  onClick={() => setSelectedGrievance(g)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1.5fr 140px 160px",
                    borderBottom: "1px solid #e0e0e0",
                    cursor: "pointer",
                    background: "white",
                    padding: "1rem",
                    gap: "1rem",
                    transition: "all 0.2s",
                    alignItems: "center"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = "#f8f9fa"}
                  onMouseOut={(e) => e.currentTarget.style.background = "white"}
                >
                  <div style={{ color: "#333", fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    <span style={{ marginRight: "0.5rem" }}>📌</span>
                    {g.title}
                  </div>
                  <div>
                    <span style={{
                      padding: "0.4rem 0.8rem",
                      borderRadius: "20px",
                      background: g.status === "open" ? "#d4edda" : g.status === "closed" ? "#e2e3e5" : "#fff3cd",
                      color: g.status === "open" ? "#155724" : g.status === "closed" ? "#383d41" : "#856404",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                      display: "inline-block"
                    }}>
                      {g.status === "open" ? "🔴 Open" : g.status === "closed" ? "⚫ Closed" : "🟠 Reopened"}
                    </span>
                  </div>
                  <div style={{ color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {g.is_anonymous ? "👤 Anonymous" : g.user?.name || "Unknown"}
                  </div>
                  <div style={{ textAlign: "center", color: "#667eea", fontWeight: "bold" }}>
                    {g.reports?.length || 0} 💬
                  </div>
                  <div style={{ textAlign: "center", display: "flex", gap: "0.5rem", justifyContent: "flex-end", whiteSpace: "nowrap" }}>
                    {isManager && (g.status === "open" || g.status === "reopened") && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          GrievanceActionHandler(g, "close");
                        }}
                        title="Close this grievance"
                        style={{
                          padding: "0.4rem 0.8rem",
                          background: "#ff6b6b",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "0.8rem",
                          transition: "all 0.2s"
                        }}
                        onMouseOver={(e) => e.target.style.background = "#ff5252"}
                        onMouseOut={(e) => e.target.style.background = "#ff6b6b"}
                      >
                        ❌
                      </button>
                    )}
                    {isManager && g.status === "closed" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          GrievanceActionHandler(g, "reopen");
                        }}
                        title="Reopen this grievance"
                        style={{
                          padding: "0.4rem 0.8rem",
                          background: "#51cf66",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "0.8rem",
                          transition: "all 0.2s"
                        }}
                        onMouseOver={(e) => e.target.style.background = "#40c057"}
                        onMouseOut={(e) => e.target.style.background = "#51cf66"}
                      >
                        🔄
                      </button>
                    )}
                    {isManager && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMergeSource(g);
                          setShowMergeModal(true);
                        }}
                        title="Merge this grievance into another"
                        style={{
                          padding: "0.4rem 0.6rem",
                          background: "#6f42c1",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontSize: "1rem",
                          transition: "all 0.2s"
                        }}
                        onMouseOver={(e) => e.target.style.background = "#5a32a3"}
                        onMouseOut={(e) => e.target.style.background = "#6f42c1"}
                      >
                        🔀
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Grievance Details Modal */}
        {selectedGrievance && (
          <GrievanceDetailsModal
            grievance={selectedGrievance}
            onClose={() => setSelectedGrievance(null)}
            token={token}
            setGrievances={setGrievances}
            isManager={user?.role === "manager"}
          />
        )}
        {showMergeModal && mergeSource && (
          <MergeModal
            source={mergeSource}
            grievances={grievances}
            onClose={() => { setShowMergeModal(false); setMergeSource(null); }}
            token={token}
            fetchGrievances={fetchGrievances}
          />
        )}
      </div>


    </div>
  );

  async function GrievanceActionHandler(grievance, action) {
    try {
      const client = token ? api(token) : api();
      let res;
      if (action === "close") {
        res = await client.post(`/grievances/${grievance.id}/close`);
      } else if (action === "reopen") {
        res = await client.post(`/grievances/${grievance.id}/reopen`);
      }
      if (res && setGrievances) {
        setGrievances((prev) =>
          prev.map((g) => (g.id === grievance.id ? res.data : g))
        );
      }
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
      alert(`Failed to ${action} grievance`);
    }
  }
}

function GrievanceDetailsModal({ grievance, onClose, token, setGrievances, isManager }) {
  const { token: authToken } = useAuth();
  const [reports, setReports] = useState(grievance.reports || []);
  const [showReportModal, setShowReportModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReopen = async () => {
    setLoading(true);
    try {
      const res = await api(authToken).post(`/grievances/${grievance.id}/reopen`);
      if (setGrievances) {
        setGrievances((prev) =>
          prev.map((g) => (g.id === grievance.id ? res.data : g))
        );
      }
      onClose();
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
      onClose();
    } catch (err) {
      console.error("Error closing grievance:", err);
      alert("Failed to close grievance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      padding: "1rem"
    }}>
      <div style={{
        background: "white",
        borderRadius: "12px",
        padding: "2rem",
        maxWidth: "700px",
        width: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ margin: "0 0 0.5rem 0", color: "#333", fontSize: "1.8rem" }}>
              📌 {grievance.title}
            </h2>
            <p style={{ margin: 0, color: "#666", fontSize: "0.95rem" }}>
              🆔 ID: {grievance.id} • 👤 {grievance.is_anonymous ? "Anonymous" : grievance.user?.name || "Unknown"}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#999"
            }}
          >
            ✕
          </button>
        </div>

        {/* Status Section */}
        <div style={{
          background: "#f8f9fa",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <small style={{ color: "#666" }}>Status:</small>
            <span style={{
              marginLeft: "0.5rem",
              padding: "0.4rem 1rem",
              borderRadius: "20px",
              background: grievance.status === "open" ? "#d4edda" : grievance.status === "closed" ? "#e2e3e5" : "#fff3cd",
              color: grievance.status === "open" ? "#155724" : grievance.status === "closed" ? "#383d41" : "#856404",
              fontSize: "0.95rem",
              fontWeight: "bold",
              display: "inline-block",
              textTransform: "capitalize"
            }}>
              {grievance.status === "open" ? "🔴 Open" : grievance.status === "closed" ? "⚫ Closed" : "🟠 Reopened"}
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {isManager && (grievance.status === "open" || grievance.status === "reopened") && (
              <button
                onClick={handleClose}
                disabled={loading}
                style={{
                  padding: "0.6rem 1.2rem",
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
                {loading ? "⏳" : "❌"} {loading ? "Closing..." : "Close"}
              </button>
            )}
            {isManager && grievance.status === "closed" && (
              <button
                onClick={handleReopen}
                disabled={loading}
                style={{
                  padding: "0.6rem 1.2rem",
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
                {loading ? "⏳" : "🔄"} {loading ? "Reopening..." : "Reopen"}
              </button>
            )}
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ color: "#333", marginBottom: "0.5rem", fontSize: "1rem" }}>📝 Description</h3>
          <p style={{ color: "#555", lineHeight: "1.6", fontSize: "0.95rem", background: "#f8f9fa", padding: "1rem", borderRadius: "8px" }}>
            {grievance.description}
          </p>
        </div>

        {/* Reports Section */}
        <div style={{
          background: "#f0f4ff",
          padding: "1.5rem",
          borderRadius: "8px",
          borderLeft: "4px solid #667eea"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ color: "#333", margin: 0, fontSize: "1.1rem" }}>
              💬 Reports ({reports.length})
            </h3>
            <button
              onClick={() => setShowReportModal(true)}
              style={{
                padding: "0.6rem 1rem",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "0.9rem",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => e.target.transform = "scale(1.05)"}
              onMouseOut={(e) => e.target.transform = "scale(1)"}
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
            {reports.length === 0 ? (
              <p style={{ color: "#999", fontStyle: "italic", margin: 0 }}>No reports yet. Add one to get started!</p>
            ) : (
              reports.map((r) => (
                <div key={r.id} style={{ marginBottom: "1rem", background: "white", padding: "1rem", borderRadius: "6px", borderLeft: "4px solid #667eea" }}>
                  <p style={{ margin: "0 0 0.5rem 0", color: "#333" }}>
                    <strong>{r.content}</strong>
                  </p>
                  <small style={{ color: "#999" }}>
                    By: {r.reporter_id ? `User #${r.reporter_id}` : "Anonymous"}
                  </small>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Close Button */}
        <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "0.8rem 2rem",
              background: "#e9ecef",
              color: "#333",
              border: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "0.95rem",
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => e.target.style.background = "#dee2e6"}
            onMouseOut={(e) => e.target.style.background = "#e9ecef"}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function MergeModal({ source, grievances, onClose, token, fetchGrievances }) {
  const { token: authToken } = useAuth();
  const [search, setSearch] = useState("");
  const [merging, setMerging] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mergeError, setMergeError] = useState(null);

  const candidates = grievances.filter(g => g.id !== source.id && (
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.description.toLowerCase().includes(search.toLowerCase())
  ));

  const handleMerge = (targetId) => {
    setConfirmTarget(targetId);
    setShowConfirm(true);
  };

  const doMerge = async (targetId) => {
    setShowConfirm(false);
    setMerging(true);
    setMergeError(null);
    try {
      const client = authToken ? api(authToken) : api();
      await client.post(`/grievances/${source.id}/merge`, { target_id: targetId });
      await fetchGrievances();
      onClose();
      alert("Merge completed successfully.");
    } catch (err) {
      console.error("Merge failed:", err);
      const status = err?.response?.status;
      if (status === 404 || status === 405) {
        setMergeError('Merge API not available on the backend (endpoint missing or method not allowed).');
      } else {
        setMergeError('Merge failed due to server error. See console for details.');
      }
    } finally {
      setMerging(false);
      setConfirmTarget(null);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1100,
      padding: "1rem"
    }}>
      <div style={{ background: "white", borderRadius: "10px", padding: "1.5rem", maxWidth: "800px", width: "100%", boxShadow: "0 8px 30px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <div>
            <h3 style={{ margin: 0 }}>🔀 Merge Grievance</h3>
            <small style={{ color: "#666" }}>Source: {source.title} (#{source.id})</small>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", fontSize: "1.25rem" }}>✕</button>
        </div>

        <div style={{ margin: "0.75rem 0 1rem 0" }}>
          <div style={{ marginBottom: "0.5rem", color: "#666", fontSize: "0.9rem" }}>Search targets (backend merge endpoint required)</div>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search target grievance by title or description..." style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "6px", border: "1px solid #e0e0e0", boxSizing: "border-box" }} />
        </div>

        <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
          {mergeError && (
            <div style={{ color: "#b00020", padding: "0.5rem 0", fontWeight: "600" }}>{mergeError}</div>
          )}
          {candidates.length === 0 ? (
            <div style={{ color: "#999", padding: "1rem" }}>No candidate grievances found.</div>
          ) : (
            candidates.map(c => (
              <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1fr 80px 120px", gap: "1rem", alignItems: "center", padding: "0.75rem", borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ fontWeight: "600", color: "#333" }}>{c.title} <small style={{ color: "#999" }}>#{c.id}</small></div>
                  <div style={{ color: "#666", fontSize: "0.95rem", marginTop: "0.25rem", overflow: "hidden", textOverflow: "ellipsis" }}>{c.description}</div>
                </div>
                <div style={{ textAlign: "center", color: "#667eea", fontWeight: "bold" }}>{c.reports?.length || 0} 💬</div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button disabled={merging} onClick={() => handleMerge(c.id)} style={{ padding: "0.5rem 0.9rem", background: "#6f42c1", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>{merging ? "Merging..." : "Merge into"}</button>
                </div>
              </div>
            ))
          )}
        </div>

        {showConfirm && confirmTarget && (
          <div style={{ marginTop: "1rem", padding: "1rem", background: "#fff3cd", borderRadius: "8px" }}>
            <p style={{ margin: 0, color: "#333" }}>Are you sure you want to merge <strong>"{source.title}"</strong> into grievance <strong>#{confirmTarget}</strong>? This cannot be undone.</p>
            <div style={{ marginTop: "0.75rem", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button onClick={() => { setShowConfirm(false); setConfirmTarget(null); }} style={{ padding: "0.5rem 0.9rem", background: "#e9ecef", border: "none", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
              <button onClick={() => doMerge(confirmTarget)} disabled={merging} style={{ padding: "0.5rem 0.9rem", background: "#6f42c1", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>{merging ? "Merging..." : "Confirm Merge"}</button>
            </div>
          </div>
        )}

        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          <button onClick={onClose} style={{ padding: "0.6rem 1rem", background: "#e9ecef", border: "none", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
