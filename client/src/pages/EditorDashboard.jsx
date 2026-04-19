import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Alert from "../components/Alert";
import LoadingSpinner from "../components/LoadingSpinner";

export default function EditorDashboard() {
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user.role || (user.role.toLowerCase() !== "editor" && user.role.toLowerCase() !== "admin")) {
      navigate("/dashboard");
      return;
    }
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/editor/papers", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPapers(data.papers);
      } else {
        setError(data.message || "Failed to load papers");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <LoadingSpinner size="lg" label="Loading papers..." />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.content}>
          <h1 style={styles.title}>⚖️ Paper Decisions</h1>
          <p style={styles.subtitle}>Manage submissions and make final decisions</p>

          {error && <Alert type="danger" message={error} onClose={() => setError("")} />}

          {/* Stats */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{papers.length}</div>
              <div style={styles.statLabel}>Total Papers</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{papers.filter(p => p.status === "submitted").length}</div>
              <div style={styles.statLabel}>Need Assignment</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{papers.filter(p => p.status === "under_review").length}</div>
              <div style={styles.statLabel}>Under Review</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{papers.filter(p => p.reviews.length > 0).length}</div>
              <div style={styles.statLabel}>Reviewed</div>
            </div>
          </div>

          {/* Papers */}
          {papers.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No papers to review yet</p>
            </div>
          ) : (
            <div style={styles.grid}>
              {papers.map((paper) => {
                const needsAssignment = paper.status === "submitted" && paper.reviews.length === 0;
                return (
                  <div key={paper._id} style={styles.card}>
                    <h3 style={styles.cardTitle}>{paper.title}</h3>
                    <p style={styles.cardAuthor}>By: {paper.submittedBy?.name || "N/A"}</p>
                    <p style={styles.cardMeta}>Status: {paper.status.replace("_", " ").toUpperCase()}</p>
                    <p style={styles.cardMeta}>Reviews: {paper.reviews.length}</p>
                    <button
                      style={{
                        ...styles.btn,
                        backgroundColor: needsAssignment ? "#f59e0b" : "#10b981"
                      }}
                      onClick={() => navigate(needsAssignment ? "/assignment" : `/admin-paper/${paper._id}`)}
                    >
                      {needsAssignment ? "Assign Reviewers" : "View & Decide"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    minHeight: "calc(100vh - 64px)",
    backgroundColor: "#f9fafb",
    padding: "32px 24px",
  },
  content: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#4b5563",
    margin: "0 0 32px 0",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "32px",
  },
  statCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "16px",
    textAlign: "center",
  },
  statNumber: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1a73e8",
    margin: "0 0 8px 0",
  },
  statLabel: {
    fontSize: "13px",
    color: "#4b5563",
    fontWeight: "500",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "16px",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "16px",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 8px 0",
  },
  cardAuthor: {
    fontSize: "13px",
    color: "#4b5563",
    margin: "0 0 4px 0",
  },
  cardMeta: {
    fontSize: "13px",
    color: "#6b7280",
    margin: "0 0 4px 0",
  },
  btn: {
    width: "100%",
    padding: "8px 12px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    marginTop: "12px",
  },
  emptyState: {
    textAlign: "center",
    padding: "48px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
};

