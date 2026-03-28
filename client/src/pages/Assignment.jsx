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
    fetch("http://localhost:5000/api/assignment/papers")
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
    backgroundColor: "#f0f2f5",
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "480px",
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
  inputGroup: { marginBottom: "20px" },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#333",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#fff",
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
    marginTop: "8px",
  },
  success: {
    backgroundColor: "#e6f4ea",
    color: "#2d7a3a",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "13px",
    marginBottom: "12px",
  },
  error: {
    backgroundColor: "#fce8e6",
    color: "#c5221f",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "13px",
    marginBottom: "12px",
  },
  resultCard: {
    marginTop: "24px",
    padding: "16px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
  },
  resultTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "12px",
  },
  resultRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "13px",
  },
  resultLabel: {
    fontWeight: "500",
    color: "#555",
    marginRight: "8px",
  },
  resultValue: {
    color: "#1a73e8",
    textAlign: "right",
  },
};