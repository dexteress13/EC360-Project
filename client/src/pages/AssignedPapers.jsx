import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AssignedPapers() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [papers, setPapers] = useState([]);
  const [papersLoading, setPapersLoading] = useState(true);
  const [papersError, setPapersError] = useState("");

  useEffect(() => {
    const fetchPapers = async () => {
      if (!token) {
        navigate("/login");
        return;
      }
      setPapersLoading(true);
      setPapersError("");
      try {
        const res = await fetch("http://localhost:5000/api/reviewer/dashboard", {
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
  }, [token, navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Assigned Papers</h2>
        <p style={styles.subtitle}>Review these papers ({papers.length})</p>
        


        {papersLoading && <p style={styles.loading}>Loading papers...</p>}
        {papersError && <p style={styles.error}>{papersError}</p>}
        {papers.length === 0 && !papersLoading && (
          <p style={styles.noPapers}>No papers assigned yet. Complete your expertise profile!</p>
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
                  <span>Authors: {paper.authors?.join(', ') || 'N/A'}</span>
                  <span>Status: <span style={styles.status}>{paper.status}</span></span>
                  {paper.deadline && (
                    <span>Deadline: {new Date(paper.deadline).toLocaleDateString()}</span>
                  )}
                  {paper.filePath && (
                    <button 
                      style={styles.viewPdfButton}
                      onClick={() => window.open(`http://localhost:5000/${paper.filePath}`, "_blank")}
                    >
                      📄 View Paper (PDF)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
  backButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    marginBottom: "24px",
    cursor: "pointer",
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
  },
  status: {
    fontWeight: "500",
    color: "#28a745",
  },
  viewPdfButton: {
    marginTop: "12px",
    padding: "8px 16px",
    backgroundColor: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    width: "fit-content",
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
  error: {
    backgroundColor: "#fce8e6",
    color: "#c5221f",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "16px",
  },
};
