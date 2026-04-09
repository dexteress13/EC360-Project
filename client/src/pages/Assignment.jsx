import { useState, useEffect } from "react";

export default function Assignment() {
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState("");
  const [result, setResult] = useState(null);
  const [potentialMatches, setPotentialMatches] = useState([]);
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

  // Fetch matches when a paper is selected
  useEffect(() => {
    if (selectedPaper) {
      fetch(`http://localhost:5000/api/assignment/potential-matches/${selectedPaper}`)
        .then(res => res.json())
        .then(data => setPotentialMatches(data))
        .catch(() => setError("Failed to fetch reviewer matches"));
    } else {
      setPotentialMatches([]);
    }
  }, [selectedPaper]);

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

  const handleManualAssign = async (reviewerId) => {
    setLoading(true);
    setError("");
    setMessage("");
    
    try {
      const res = await fetch("http://localhost:5000/api/assignment/assign-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paperId: selectedPaper, reviewerId })
      });
      
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
      } else {
        setMessage("Reviewer assigned successfully!");
        setResult(data.assignment);
        setPotentialMatches([]);
      }
    } catch (err) {
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={{...styles.card, maxWidth: potentialMatches.length > 0 && !result ? "900px" : "480px"}}>
        <h2 style={styles.title}>RevMatch</h2>
        <p style={styles.subtitle}>Reviewer Assignment Management</p>

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

        {!result && selectedPaper && (
          <button style={styles.button} onClick={handleAssign} disabled={loading}>
            {loading ? "Assigning..." : "Auto-Assign Best Match"}
          </button>
        )}

        {selectedPaper && potentialMatches.length > 0 && !result && (
          <div style={styles.matchesSection}>
            <h3 style={styles.resultTitle}>Potential Reviewers (by expertise match)</h3>
            <div style={styles.matchesTable}>
              <div style={styles.tableHeader}>
                <span>Reviewer</span>
                <span>Expertise</span>
                <span>Match</span>
                <span>Action</span>
              </div>
              {potentialMatches.map((match) => (
                <div key={match._id} style={styles.tableRow}>
                  <div style={styles.reviewerInfo}>
                    <span style={styles.reviewerName}>{match.name}</span>
                    <span style={styles.reviewerEmail}>{match.email}</span>
                  </div>
                  <span style={styles.expertiseText}>{match.expertise.join(", ")}</span>
                  <span style={styles.scoreBadge}>{match.score} keyword(s)</span>
                  <button 
                    style={styles.smallAssignButton} 
                    onClick={() => handleManualAssign(match._id)}
                    disabled={loading}
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
        
        {result && (
           <button style={{...styles.button, backgroundColor: '#6c757d', marginTop: '20px'}} onClick={() => {setResult(null); setSelectedPaper("");}}>
             Assign Another Paper
           </button>
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
    transition: "max-width 0.3s ease",
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
  matchesSection: {
    marginTop: "30px",
  },
  matchesTable: {
    border: "1px solid #eee",
    borderRadius: "8px",
    overflow: "hidden",
  },
  tableHeader: {
    display: "grid",
    gridTemplateColumns: "1.5fr 2fr 0.8fr 0.8fr",
    padding: "12px",
    backgroundColor: "#f1f3f4",
    fontWeight: "600",
    fontSize: "13px",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1.5fr 2fr 0.8fr 0.8fr",
    padding: "12px",
    borderTop: "1px solid #eee",
    alignItems: "center",
    fontSize: "13px",
  },
  reviewerInfo: { display: "flex", flexDirection: "column" },
  reviewerName: { fontWeight: "600" },
  reviewerEmail: { fontSize: "11px", color: "#666" },
  expertiseText: { color: "#555", fontStyle: "italic" },
  scoreBadge: {
    backgroundColor: "#e8f0fe",
    color: "#1a73e8",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    width: "fit-content",
    fontWeight: "600"
  },
  smallAssignButton: {
    padding: "6px 12px",
    backgroundColor: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "12px",
    cursor: "pointer",
  },
};