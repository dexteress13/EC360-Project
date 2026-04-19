import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Alert from "../components/Alert";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Assignment() {
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState("");
  const [result, setResult] = useState(null);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user.role?.toLowerCase() !== "editor") {
      navigate("/dashboard");
      return;
    }
    // Load unassigned papers only for editors
    fetch("http://localhost:5000/api/assignment/papers", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setPapers(data.filter(p => p.status === 'submitted') || []))
      .catch(() => setError("Could not load papers"))
      .finally(() => setInitialLoading(false));
  }, []);

  // Fetch matches when a paper is selected
  useEffect(() => {
    if (selectedPaper) {
      fetch(`http://localhost:5000/api/assignment/potential-matches/${selectedPaper}`)
        .then(res => res.json())
        .then(data => setPotentialMatches(data || []))
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
        setMessage("✓ Reviewer assigned successfully!");
        setResult(data.assignment);
        setTimeout(() => setMessage(""), 3000);
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
        setMessage("✓ Reviewer assigned successfully!");
        setResult(data.assignment);
        setPotentialMatches([]);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSelectedPaper("");
    setMessage("");
    setError("");
  };

  if (initialLoading)
    return (
      <>
        <Navbar />
        <div style={styles.container}>
          <LoadingSpinner size="lg" label="Loading unassigned papers..." />
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.content}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>🎯 Assign Reviewers</h1>
            <p style={styles.subtitle}>
              Match papers with qualified reviewers
            </p>
          </div>

          {/* Alerts */}
          {message && (
            <Alert type="success" message={message} onClose={() => setMessage("")} />
          )}
          {error && (
            <Alert type="danger" message={error} onClose={() => setError("")} />
          )}

          <div style={styles.mainGrid}>
            {/* Left Panel - Selection */}
            <div style={styles.leftPanel}>
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>📄 Select Paper</h2>

                {papers.length === 0 ? (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>📭</div>
                    <p style={styles.emptyText}>
                      No papers pending reviewer assignment
                    </p>
                  </div>
                ) : (
                  <>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Paper *</label>
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
                      <button
                        style={{
                          ...styles.button,
                          opacity: loading ? 0.7 : 1,
                        }}
                        onClick={handleAssign}
                        disabled={loading}
                      >
                        {loading ? "Finding best match..." : "🔍 Auto-Assign Best Match"}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Right Panel - Results */}
            {selectedPaper && !result && potentialMatches.length > 0 && (
              <div style={styles.rightPanel}>
                <div style={styles.card}>
                  <h2 style={styles.cardTitle}>
                    👥 Potential Reviewers ({potentialMatches.length})
                  </h2>
                  <p style={styles.matchesSubtitle}>
                    Ranked by expertise match
                  </p>

                  <div style={styles.matchesContainer}>
                    {potentialMatches.map((match, index) => (
                      <div key={match._id} style={styles.matchCard}>
                        <div style={styles.matchHeader}>
                          <div>
                            <div style={styles.matchRank}>#{index + 1}</div>
                            <h4 style={styles.matchName}>{match.name}</h4>
                            <p style={styles.matchEmail}>{match.email}</p>
                          </div>
                          <div
                            style={{
                              ...styles.matchScore,
                              backgroundColor:
                                match.score >= 3
                                  ? "#10b98130"
                                  : match.score === 2
                                  ? "#f59e0b30"
                                  : "#6b728030",
                            }}
                          >
                            {match.score}
                            <br />
                            match
                          </div>
                        </div>

                        <div style={styles.matchExpertise}>
                          <span style={styles.expertiseLabel}>Expertise:</span>
                          <div style={styles.expertiseTags}>
                            {match.expertise.slice(0, 4).map((exp, i) => (
                              <span key={i} style={styles.expertiseTag}>
                                {exp}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          style={styles.assignButton}
                          onClick={() => handleManualAssign(match._id)}
                          disabled={loading}
                        >
                          {loading ? "Assigning..." : "✓ Assign This Reviewer"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Result Panel */}
            {result && (
              <div style={styles.rightPanel}>
                <div style={styles.resultCard}>
                  <div style={styles.resultIcon}>✓</div>
                  <h2 style={styles.resultTitle}>Assignment Complete</h2>

                  <div style={styles.resultContent}>
                    <div style={styles.resultItem}>
                      <span style={styles.resultLabel}>📄 Paper:</span>
                      <span style={styles.resultValue}>{result.paperTitle}</span>
                    </div>
                    <div style={styles.resultItem}>
                      <span style={styles.resultLabel}>👤 Assigned Reviewer:</span>
                      <span style={styles.resultValue}>{result.reviewerName}</span>
                    </div>
                    <div style={styles.resultItem}>
                      <span style={styles.resultLabel}>📧 Email:</span>
                      <span style={styles.resultValue}>{result.reviewerEmail}</span>
                    </div>
                    <div style={styles.resultItem}>
                      <span style={styles.resultLabel}>🔗 Matched Keywords:</span>
                      <div style={styles.matchedKeywords}>
                        {result.matchedKeywords.map((kw, i) => (
                          <span key={i} style={styles.keyword}>
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={styles.resultItem}>
                      <span style={styles.resultLabel}>⭐ Match Score:</span>
                      <span style={styles.resultValue}>
                        {result.matchScore} keyword(s) matched
                      </span>
                    </div>
                  </div>

                  <button
                    style={styles.resetButton}
                    onClick={handleReset}
                  >
                    Assign Another Paper
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    minHeight: "calc(100vh - 64px)",
    backgroundColor: "var(--bg-secondary)",
    padding: "var(--spacing-xl) var(--spacing-lg)",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "var(--spacing-xl)",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: "0 0 var(--spacing-md) 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    margin: 0,
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: "var(--spacing-xl)",
  },
  leftPanel: {
    minHeight: "200px",
  },
  rightPanel: {
    minHeight: "200px",
  },
  card: {
    backgroundColor: "var(--bg-primary)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border-light)",
    padding: "var(--spacing-xl)",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: "0 0 var(--spacing-lg) 0",
  },
  formGroup: {
    marginBottom: "var(--spacing-lg)",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "var(--text-primary)",
    marginBottom: "var(--spacing-sm)",
  },
  select: {
    width: "100%",
    padding: "var(--spacing-md)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border-color)",
    fontSize: "14px",
    color: "var(--text-primary)",
    backgroundColor: "var(--bg-primary)",
    fontFamily: "inherit",
  },
  button: {
    width: "100%",
    padding: "var(--spacing-md)",
    backgroundColor: "var(--primary-600)",
    color: "white",
    border: "none",
    borderRadius: "var(--radius-lg)",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
  },
  emptyState: {
    textAlign: "center",
    padding: "var(--spacing-2xl)",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "var(--spacing-md)",
  },
  emptyText: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    margin: 0,
  },
  matchesSubtitle: {
    fontSize: "13px",
    color: "var(--text-secondary)",
    margin: "0 0 var(--spacing-lg) 0",
  },
  matchesContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--spacing-md)",
  },
  matchCard: {
    backgroundColor: "var(--bg-secondary)",
    borderRadius: "var(--radius-md)",
    padding: "var(--spacing-lg)",
    border: "1px solid var(--border-light)",
  },
  matchHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "var(--spacing-md)",
    gap: "var(--spacing-lg)",
  },
  matchRank: {
    display: "inline-block",
    backgroundColor: "var(--primary-600)",
    color: "white",
    fontSize: "12px",
    fontWeight: "700",
    padding: "2px 8px",
    borderRadius: "var(--radius-full)",
    marginBottom: "var(--spacing-sm)",
  },
  matchName: {
    fontSize: "14px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: "0 0 var(--spacing-xs) 0",
  },
  matchEmail: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    margin: 0,
  },
  matchScore: {
    textAlign: "center",
    padding: "var(--spacing-md)",
    borderRadius: "var(--radius-md)",
    fontSize: "12px",
    fontWeight: "700",
    color: "var(--text-primary)",
  },
  matchExpertise: {
    marginBottom: "var(--spacing-md)",
  },
  expertiseLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "var(--text-secondary)",
    display: "block",
    marginBottom: "var(--spacing-sm)",
  },
  expertiseTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--spacing-sm)",
  },
  expertiseTag: {
    fontSize: "11px",
    backgroundColor: "rgba(26, 115, 232, 0.1)",
    color: "var(--primary-600)",
    padding: "3px 8px",
    borderRadius: "var(--radius-full)",
  },
  assignButton: {
    width: "100%",
    padding: "var(--spacing-md)",
    backgroundColor: "var(--success-600)",
    color: "white",
    border: "none",
    borderRadius: "var(--radius-md)",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
  },
  resultCard: {
    backgroundColor: "var(--bg-primary)",
    borderRadius: "var(--radius-lg)",
    border: "2px solid var(--success-600)",
    padding: "var(--spacing-xl)",
    textAlign: "center",
  },
  resultIcon: {
    fontSize: "64px",
    marginBottom: "var(--spacing-lg)",
  },
  resultTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: "0 0 var(--spacing-lg) 0",
  },
  resultContent: {
    textAlign: "left",
    marginBottom: "var(--spacing-xl)",
    paddingBottom: "var(--spacing-xl)",
    borderBottom: "1px solid var(--border-light)",
  },
  resultItem: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--spacing-sm)",
    marginBottom: "var(--spacing-lg)",
  },
  resultLabel: {
    fontSize: "12px",
    fontWeight: "700",
    color: "var(--text-secondary)",
  },
  resultValue: {
    fontSize: "14px",
    color: "var(--text-primary)",
    fontWeight: "600",
  },
  matchedKeywords: {
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--spacing-sm)",
    marginTop: "var(--spacing-sm)",
  },
  keyword: {
    fontSize: "12px",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    color: "var(--success-600)",
    padding: "3px 10px",
    borderRadius: "var(--radius-full)",
  },
  resetButton: {
    width: "100%",
    padding: "var(--spacing-md)",
    backgroundColor: "var(--primary-600)",
    color: "white",
    border: "none",
    borderRadius: "var(--radius-lg)",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
  },
};

