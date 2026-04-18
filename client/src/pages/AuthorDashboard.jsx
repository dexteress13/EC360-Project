import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthorDashboard() {
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [papersLoading, setPapersLoading] = useState(true);
  const [papersError, setPapersError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user.role !== "author") {
      navigate("/dashboard");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchPapers = async () => {
      if (!token) return;
      setPapersLoading(true);
      setPapersError("");
      try {
        const res = await fetch("http://localhost:5000/api/paper/my", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setPapers(data.papers || []);
        } else {
          setPapersError(data.message || "Failed to load papers");
        }
      } catch (err) {
        setPapersError("Server error");
      } finally {
        setPapersLoading(false);
      }
    };
    fetchPapers();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return '#ffc107'; // yellow
      case 'under_review': return '#17a2b8'; // blue
      case 'accepted': return '#28a745'; // green
      case 'rejected': return '#dc3545'; // red
      default: return '#6c757d'; // gray
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>RevMatch</h2>
        <p style={styles.subtitle}>Author Dashboard ({user.name})</p>

        {/* My Submitted Papers Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>My Submitted Papers ({papers.length})</h3>
          {papersLoading && <p style={styles.loading}>Loading papers...</p>}
          {papersError && <p style={styles.error}>{papersError}</p>}
          {papers.length === 0 && !papersLoading && (
            <p style={styles.noPapers}>No papers submitted yet. <a href="/submit-paper" style={styles.link}>Submit your first paper!</a></p>
          )}
          {!papersLoading && papers.length > 0 && (
            <div style={styles.papersGrid}>
              {papers.map((paper) => (
                <div key={paper._id} style={styles.paperCard}>
                  <h4 style={styles.paperTitle}>{paper.title}</h4>
                  <p style={styles.paperAbstract}>
                    {paper.abstract.length > 150 
                      ? `${paper.abstract.substring(0, 150)}...` 
                      : paper.abstract
                    }
                  </p>
                  <div style={styles.paperMeta}>
                    <span>Keywords: {paper.keywords?.slice(0, 3).join(', ') || 'N/A'}{paper.keywords?.length > 3 ? '...' : ''}</span>
                    
                    <span>Status: <span style={{...styles.status, color: getStatusColor(paper.status)}}>{paper.status?.replace('_', ' ').toUpperCase()}</span></span>
                    {paper.fileName && <span>File: {paper.fileName}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          style={styles.backButton} 
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f2f5",
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "1200px",
  },
  title: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a73e8",
    marginBottom: "4px",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "24px",
    fontSize: "14px",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  sectionTitle: {
    margin: "0 0 20px 0",
    fontSize: "20px",
    fontWeight: "600",
    color: "#1a73e8",
  },
  papersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "20px",
  },
  paperCard: {
    backgroundColor: "#f8f9fa",
    border: "1px solid #e9ecef",
    borderRadius: "12px",
    padding: "20px",
    transition: "all 0.2s",
  },
  paperTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1a73e8",
    margin: "0 0 12px 0",
  },
  paperAbstract: {
    fontSize: "14px",
    color: "#555",
    lineHeight: "1.5",
    margin: "0 0 12px 0",
  },
  paperMeta: {
    fontSize: "13px",
    color: "#666",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  status: {
    fontWeight: "500",
  },
  loading: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
  },
  noPapers: {
    textAlign: "center",
    color: "#999",
    fontSize: "16px",
    padding: "40px",
  },
  link: {
    color: "#1a73e8",
    textDecoration: "underline",
  },
  backButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

