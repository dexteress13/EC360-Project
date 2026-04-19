import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EditorDashboard() {
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user.role) user.role = user.role.toLowerCase();

  useEffect(() => {
if (user.role !== "editor") {
  navigate("/dashboard");
  return;
}
    fetchPapers();
  }, [token, user.role, navigate]);

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

  if (loading) return <div style={styles.loading}>Loading papers for review...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>RevMatch Admin Dashboard</h2>
        <p style={styles.subtitle}>Papers ready for decision ({papers.length})</p>

        {papers.length === 0 ? (
          <p style={styles.noPapers}>No pending papers.</p>
        ) : (
          <>
            {papers.map((paper) => {
              let buttonText = 'View Reviews & Decide';
              let buttonColor = styles.viewBtn;
              let needsAssignment = paper.status === 'submitted' && paper.reviews.length === 0;
              
              if (needsAssignment) {
                buttonText = 'Assign Reviewer';
                buttonColor = { ...styles.viewBtn, backgroundColor: '#ffc107', color: '#000' };
              } else if (paper.reviews.length > 0) {
                buttonText = 'View Reviews & Decide';
              } else {
                buttonText = 'Monitoring Review';
                buttonColor = { ...styles.viewBtn, backgroundColor: '#17a2b8' };
              }
              
              return (
                <div key={paper._id} style={styles.paperCard}>
                  <h3 style={styles.paperTitle}>{paper.title}</h3>
                  <p style={styles.paperStatus}>Status: {paper.status.replace('_', ' ').toUpperCase()}</p>
                  <p>Reviews: {paper.reviews.length}</p>
                  <p>Author: {paper.submittedBy?.name}</p>
                  <button 
                    style={buttonColor}
                    onClick={() => needsAssignment 
                      ? navigate('/assignment') 
                      : navigate(`/admin-paper/${paper._id}`)
                    }
                  >
                    {buttonText}
                  </button>
                </div>
              );
            })}
          </>
        )}

        <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
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
    backgroundColor: "#1a73e8",
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
    marginBottom: "8px",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "32px",
  },
  papersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  paperCard: {
    backgroundColor: "#f8f9fa",
    border: "1px solid #e9ecef",
    borderRadius: "12px",
    padding: "24px",
  },
  paperTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    margin: "0 0 12px 0",
  },
  paperStatus: {
    color: "#1a73e8",
    fontWeight: "500",
    margin: "0 0 8px 0",
  },
  viewBtn: {
    padding: "8px 16px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    marginTop: "12px",
minWidth: "240px",
  },
  backBtn: {


    width: "100%",
    padding: "12px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "24px",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
    fontSize: "18px",
    color: "#666",
  },
  error: {
    textAlign: "center",
    padding: "50px",
    color: "#dc3545",
  },
  noPapers: {
    textAlign: "center",
    color: "#999",
    fontSize: "18px",
    padding: "60px",
  },
};

