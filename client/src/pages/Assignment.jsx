import { useState, useEffect } from "react";

export default function Assignment() {
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState("");
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load all papers on page load
  useEffect(() => {
    fetch("http://localhost:5000/api/paper/all")
      .then((res) => res.json())
      .then((data) => setPapers(data))
      .catch(() => setError("Could not load papers"));
  }, []);

  const handleAssign = async () => {
    if (!selectedPaper) {
      setError("Please select a paper");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setResult(null);

    try {
      const res = await fetch(
        `http://localhost:5000/api/assignment/assign/${selectedPaper}`,
        { method: "POST" }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
        setMessage("Reviewer assigned successfully!");
        setResult(data.assignment);
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
        <p style={styles.subtitle}>Automated Reviewer Assignment</p>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Select Paper</label>
          <select
            style={styles.select}
            value={selectedPaper}
            onChange={(e) => setSelectedPaper(e.target.value)}
          >
            <option value="">-- Select a paper --</option>
            {papers.map((paper) => (
              <option key={paper._id} value={paper._id}>
                {paper.title}
              </option>
            ))}
          </select>
        </div>

        <button style={styles.button} onClick={handleAssign} disabled={loading}>
          {loading ? "Assigning..." : "Assign Reviewer"}
        </button>

        {result && (
          <div style={styles.resultCard}>
            <h3 style={styles.resultTitle}>Assignment Result</h3>
            <div style={styles.resultRow}>
              <span style={styles.resultLabel}>Paper:</span>
              <span style={styles.resultValue}>{result.paperTitle}</span>
            </div>
            <div style={styles.resultRow}>
              <span style={styles.resultLabel}>Assigned Reviewer:</span>
              <span style={styles.resultValue}>{result.reviewerName}</span>
            </div>
            <div style={styles.resultRow}>
              <span style={styles.resultLabel}>Reviewer Email:</span>
              <span style={styles.resultValue}>{result.reviewerEmail}</span>
            </div>
            <div style={styles.resultRow}>
              <span style={styles.resultLabel}>Matched Keywords:</span>
              <span style={styles.resultValue}>
                {result.matchedKeywords.join(", ")}
              </span>
            </div>
            <div style={styles.resultRow}>
              <span style={styles.resultLabel}>Match Score:</span>
              <span style={styles.resultValue}>{result.matchScore} keyword(s) matched</span>
            </div>
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
    background: "linear-gradient(135deg, #1a73e8 0%, #1565c0 100%)",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: "50px",
    borderRadius: "20px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "500px",
    backdropFilter: "blur(10px)",
  },
  title: {
    textAlign: "center",
    fontSize: "32px",
    fontWeight: "800",
    background: "linear-gradient(45deg, #1a73e8, #1565c0)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "8px",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "30px",
    fontSize: "16px",
    fontWeight: "400",
  },
  inputGroup: { marginBottom: "25px" },
  label: {
    display: "block",
    marginBottom: "10px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#333",
  },
  select: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "10px",
    border: "2px solid #e0e0e0",
    fontSize: "16px",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    transition: "border-color 0.3s ease",
  },
  button: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(45deg, #1a73e8, #1565c0)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "10px",
    transition: "all 0.3s ease",
    boxShadow: "0 5px 15px rgba(102, 126, 234, 0.4)",
  },
  success: {
    backgroundColor: "#e8f5e8",
    color: "#2e7d32",
    padding: "14px",
    borderRadius: "10px",
    fontSize: "14px",
    marginBottom: "15px",
    border: "1px solid #4caf50",
  },
  error: {
    backgroundColor: "#fce8e6",
    color: "#c5221f",
    padding: "14px",
    borderRadius: "10px",
    fontSize: "14px",
    marginBottom: "15px",
    border: "1px solid #f44336",
  },
  resultCard: {
    marginTop: "30px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
  },
  resultTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "15px",
    textAlign: "center",
  },
  resultRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    fontSize: "14px",
    alignItems: "center",
  },
  resultLabel: {
    fontWeight: "600",
    color: "#555",
  },
  resultValue: {
    color: "#1a73e8",
    textAlign: "right",
    fontWeight: "500",
  },
};