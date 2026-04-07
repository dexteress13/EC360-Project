import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ReviewerDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const [expertiseStr, setExpertiseStr] = useState(user.expertise?.join(", ") || "");
  const [currentExpertise, setCurrentExpertise] = useState(user.expertise || []);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [papers, setPapers] = useState([]);
  const [papersLoading, setPapersLoading] = useState(true);
  const [papersError, setPapersError] = useState("");

  useEffect(() => {
    if (user.role !== "reviewer") {
      navigate("/dashboard");
    }
  }, [user.role, navigate]);

  useEffect(() => {
    const fetchPapers = async () => {
      if (!token) return;
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
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const expertiseArray = expertiseStr
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    try {
      const res = await fetch("http://localhost:5000/api/reviewer/expertise", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ expertise: expertiseArray }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
        setMessage("Expertise updated successfully!");
        // Update localStorage
        localStorage.setItem("user", JSON.stringify({ ...user, expertise: expertiseArray }));
        setCurrentExpertise(expertiseArray);
        setExpertiseStr(expertiseArray.join(", "));
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>RevMatch</h2>
<p style={styles.subtitle}>Reviewer Dashboard ({user.name})</p>

        {/* Assigned Papers Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Assigned Papers ({papers.length})</h3>
          {papersLoading && <p style={styles.loading}>Loading papers...</p>}
          {papersError && <p style={styles.error}>{papersError}</p>}
          {papers.length === 0 && !papersLoading && (
            <p style={styles.noPapers}>No papers assigned yet. Complete your expertise profile to get matched!</p>
          )}
          {!papersLoading && papers.length > 0 && (
            <div style={styles.papersGrid}>
              {papers.map((paper) => (
                <div key={paper._id} style={styles.paperCard} onClick={() => navigate(`/review/${paper._id}`)}>
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expertise Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Manage Expertise</h3>

        {currentExpertise.length > 0 && (
          <div style={styles.currentSection}>
            <h4 style={styles.currentTitle}>Current Expertise:</h4>
            <div style={styles.expertiseTags}>
              {currentExpertise.map((tag, index) => (
                <span key={index} style={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
        )}

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Update Expertise Keywords</label>
            <input
              style={styles.input}
              type="text"
              value={expertiseStr}
              onChange={(e) => setExpertiseStr(e.target.value)}
              placeholder="e.g. machine learning, NLP, computer vision"
              required
              disabled={loading}
            />
            <p style={styles.hint}>Separate multiple keywords with commas</p>
          </div>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Expertise"}
          </button>
        </form>

      </div>
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
  currentSection: {
    backgroundColor: "#f0f8ff",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "24px",
  },
  currentTitle: {
    margin: "0 0 12px 0",
    color: "#1a73e8",
    fontSize: "16px",
  },
  expertiseTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  tag: {
    backgroundColor: "#1a73e8",
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "13px",
  },
  inputGroup: { marginBottom: "16px" },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  hint: {
    fontSize: "12px",
    color: "#999",
    marginTop: "6px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "16px",
  },
  backButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    cursor: "pointer",
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
    cursor: "pointer",
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
  success: {
    backgroundColor: "#e6f4ea",
    color: "#2d7a3a",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "16px",
  },
  error: {
    backgroundColor: "#fce8e6",
    color: "#c5221f",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "16px",
  },
};
