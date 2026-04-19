import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Alert from "../components/Alert";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AdminPaperDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paper, setPaper] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [decidingOn, setDecidingOn] = useState(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user.role?.toLowerCase() !== "editor") {
      navigate("/dashboard");
      return;
    }
    fetchPaper();
  }, [id, token, user.role, navigate]);

  const fetchPaper = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/editor/paper/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPaper(data.paper);
        setReviews(data.reviews || []);
      } else {
        setError(data.message || "Failed to load paper");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const makeDecision = async (status) => {
    setDecidingOn(status);
    try {
      const res = await fetch(`http://localhost:5000/api/paper/${id}/decision`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(`Paper ${status.toUpperCase()} successfully!`);
        setTimeout(() => navigate("/admin-dashboard"), 2000);
      } else {
        setError(data.message || "Decision failed");
      }
    } catch (err) {
      setError("Decision failed");
    } finally {
      setDecidingOn(null);
    }
  };

  if (loading)
    return (
      <>
        <Navbar />
        <div style={styles.container}>
          <LoadingSpinner size="lg" label="Loading paper details..." />
        </div>
      </>
    );

  if (!paper)
    return (
      <>
        <Navbar />
        <div style={styles.container}>
          <div style={styles.errorState}>
            <div style={styles.errorIcon}>⚠️</div>
            <h3>Paper Not Found</h3>
            <button
              style={styles.backLink}
              onClick={() => navigate("/admin-dashboard")}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </>
    );

  const isDecided = paper.status === "accepted" || paper.status === "rejected";
  const statusColor =
    paper.status === "accepted"
      ? "#10b981"
      : paper.status === "rejected"
      ? "#ef4444"
      : "#f59e0b";

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.content}>
          {/* Header */}
          <div style={styles.header}>
            <button
              style={styles.backButton}
              onClick={() => navigate("/admin-dashboard")}
            >
              ← Back
            </button>
            <h1 style={styles.title}>📋 Paper Decision</h1>
          </div>

          {error && (
            <Alert type="danger" message={error} onClose={() => setError("")} />
          )}
          {successMsg && (
            <Alert
              type="success"
              message={successMsg}
              onClose={() => setSuccessMsg("")}
            />
          )}

          {/* Paper Details Card */}
          <div style={styles.paperCard}>
            {/* Status Badge */}
            <div style={styles.statusRow}>
              <span
                style={{
                  ...styles.statusBadge,
                  backgroundColor: statusColor,
                }}
              >
                {paper.status.replace("_", " ").toUpperCase()}
              </span>
            </div>

            {/* Title and Author */}
            <h2 style={styles.paperTitle}>{paper.title}</h2>
            <div style={styles.authorSection}>
              <div style={styles.authorInfo}>
                <span style={styles.label}>Author:</span>
                <span style={styles.value}>{paper.submittedBy?.name}</span>
              </div>
              <div style={styles.authorInfo}>
                <span style={styles.label}>Email:</span>
                <span style={styles.value}>{paper.submittedBy?.email}</span>
              </div>
            </div>

            {/* Abstract */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>📝 Abstract</h3>
              <p style={styles.abstract}>{paper.abstract}</p>
            </div>

            {/* Keywords */}
            {paper.keywords && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>🏷️ Keywords</h3>
                <div style={styles.keywords}>
                  {(Array.isArray(paper.keywords) ? paper.keywords : paper.keywords.split(",")).map((kw, i) => (
                    <span key={i} style={styles.keyword}>
                      {typeof kw === 'string' ? kw.trim() : kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Download Link */}
            {paper.filePath && (
              <div style={styles.section}>
                <a
                  href={`http://localhost:5000/${paper.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.downloadLink}
                >
                  📄 Download Full Paper PDF
                </a>
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div style={styles.reviewsSection}>
            <h2 style={styles.sectionTitle}>
              👥 Reviewer Feedback ({reviews.length})
            </h2>

            {reviews.length === 0 ? (
              <div style={styles.emptyReviews}>
                <span style={styles.emptyIcon}>📭</span>
                <p>No reviews submitted yet</p>
              </div>
            ) : (
              <div style={styles.reviewsList}>
                {reviews.map((review, idx) => (
                  <div key={idx} style={styles.reviewCard}>
                    <div style={styles.reviewHeader}>
                      <h4 style={styles.reviewerName}>
                        {review.reviewerName || "Anonymous Reviewer"}
                      </h4>
                      <span
                        style={{
                          ...styles.decisionBadge,
                          backgroundColor:
                            review.decision === "accept"
                              ? "#10b981"
                              : "#ef4444",
                        }}
                      >
                        {review.decision?.toUpperCase() || "NO DECISION"}
                      </span>
                    </div>

                    <p style={styles.reviewText}>
                      {review.review || "No detailed comments provided"}
                    </p>

                    {review.submittedAt && (
                      <div style={styles.reviewMeta}>
                        📅{" "}
                        {new Date(review.submittedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Decision Section */}
          {!isDecided && (
            <div style={styles.decisionCard}>
              <h2 style={styles.sectionTitle}>⚖️ Make Final Decision</h2>
              <p style={styles.decisionSubtitle}>
                Based on the reviews above, decide the final status of this
                paper
              </p>

              <div style={styles.decisionButtons}>
                <button
                  style={styles.acceptButton}
                  onClick={() => makeDecision("accepted")}
                  disabled={decidingOn !== null}
                >
                  {decidingOn === "accepted" ? "Processing..." : "✓ Accept Paper"}
                </button>
                <button
                  style={styles.rejectButton}
                  onClick={() => makeDecision("rejected")}
                  disabled={decidingOn !== null}
                >
                  {decidingOn === "rejected" ? "Processing..." : "✕ Reject Paper"}
                </button>
              </div>
            </div>
          )}

          {isDecided && (
            <div style={styles.decidedCard}>
              <div style={styles.decidedIcon}>✓</div>
              <p style={styles.decidedText}>
                Decision already made: <strong>{paper.status.toUpperCase()}</strong>
              </p>
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
    backgroundColor: "var(--bg-secondary)",
    padding: "var(--spacing-xl) var(--spacing-lg)",
  },
  content: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "var(--spacing-lg)",
    marginBottom: "var(--spacing-xl)",
  },
  backButton: {
    padding: "var(--spacing-md) var(--spacing-lg)",
    backgroundColor: "var(--bg-primary)",
    border: "1px solid var(--border-light)",
    borderRadius: "var(--radius-lg)",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    color: "var(--text-primary)",
    transition: "all var(--transition-fast)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: 0,
  },
  paperCard: {
    backgroundColor: "var(--bg-primary)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border-light)",
    padding: "var(--spacing-xl)",
    marginBottom: "var(--spacing-xl)",
  },
  statusRow: {
    marginBottom: "var(--spacing-lg)",
    display: "flex",
    alignItems: "center",
    gap: "var(--spacing-md)",
  },
  statusBadge: {
    fontSize: "12px",
    fontWeight: "700",
    color: "white",
    padding: "6px 16px",
    borderRadius: "var(--radius-full)",
  },
  paperTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: "0 0 var(--spacing-lg) 0",
  },
  authorSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "var(--spacing-lg)",
    padding: "var(--spacing-lg)",
    backgroundColor: "var(--bg-secondary)",
    borderRadius: "var(--radius-md)",
    marginBottom: "var(--spacing-lg)",
  },
  authorInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--spacing-sm)",
  },
  label: {
    fontSize: "12px",
    fontWeight: "700",
    color: "var(--text-secondary)",
  },
  value: {
    fontSize: "14px",
    color: "var(--text-primary)",
  },
  section: {
    marginBottom: "var(--spacing-xl)",
    paddingBottom: "var(--spacing-xl)",
    borderBottom: "1px solid var(--border-light)",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: "0 0 var(--spacing-lg) 0",
  },
  abstract: {
    fontSize: "14px",
    lineHeight: "1.8",
    color: "var(--text-secondary)",
    margin: 0,
  },
  keywords: {
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--spacing-md)",
  },
  keyword: {
    fontSize: "13px",
    backgroundColor: "rgba(26, 115, 232, 0.1)",
    color: "var(--primary-600)",
    padding: "var(--spacing-sm) var(--spacing-md)",
    borderRadius: "var(--radius-full)",
  },
  downloadLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--spacing-sm)",
    padding: "var(--spacing-md) var(--spacing-lg)",
    backgroundColor: "rgba(26, 115, 232, 0.1)",
    color: "var(--primary-600)",
    textDecoration: "none",
    borderRadius: "var(--radius-md)",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all var(--transition-fast)",
  },
  reviewsSection: {
    marginBottom: "var(--spacing-xl)",
  },
  emptyReviews: {
    textAlign: "center",
    padding: "var(--spacing-2xl)",
    backgroundColor: "var(--bg-primary)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border-light)",
  },
  emptyIcon: {
    fontSize: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "var(--spacing-md)",
    lineHeight: "1",
    height: "48px",
  },
  reviewsList: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--spacing-lg)",
  },
  reviewCard: {
    backgroundColor: "var(--bg-primary)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border-light)",
    padding: "var(--spacing-lg)",
    borderLeft: "4px solid var(--primary-600)",
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "var(--spacing-md)",
    gap: "var(--spacing-lg)",
  },
  reviewerName: {
    fontSize: "14px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: 0,
  },
  decisionBadge: {
    fontSize: "11px",
    fontWeight: "700",
    color: "white",
    padding: "4px 12px",
    borderRadius: "var(--radius-full)",
    whiteSpace: "nowrap",
  },
  reviewText: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "var(--text-secondary)",
    margin: "var(--spacing-md) 0",
  },
  reviewMeta: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    marginTop: "var(--spacing-lg)",
    paddingTop: "var(--spacing-lg)",
    borderTop: "1px solid var(--border-light)",
  },
  decisionCard: {
    backgroundColor: "var(--bg-primary)",
    borderRadius: "var(--radius-lg)",
    border: "2px solid var(--primary-600)",
    padding: "var(--spacing-xl)",
  },
  decisionSubtitle: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    margin: "0 0 var(--spacing-lg) 0",
  },
  decisionButtons: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "var(--spacing-lg)",
  },
  acceptButton: {
    padding: "var(--spacing-md) var(--spacing-lg)",
    backgroundColor: "var(--success-600)",
    color: "white",
    border: "none",
    borderRadius: "var(--radius-lg)",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
  },
  rejectButton: {
    padding: "var(--spacing-md) var(--spacing-lg)",
    backgroundColor: "var(--danger-600)",
    color: "white",
    border: "none",
    borderRadius: "var(--radius-lg)",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
  },
  decidedCard: {
    textAlign: "center",
    padding: "var(--spacing-2xl)",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderRadius: "var(--radius-lg)",
    border: "2px solid var(--success-600)",
  },
  decidedIcon: {
    fontSize: "48px",
    marginBottom: "var(--spacing-md)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: "1",
    height: "48px",
  },
  decidedText: {
    fontSize: "16px",
    color: "var(--success-600)",
    fontWeight: "600",
    margin: 0,
  },
  errorState: {
    textAlign: "center",
    padding: "var(--spacing-2xl)",
    backgroundColor: "var(--bg-primary)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border-light)",
  },
  errorIcon: {
    fontSize: "64px",
    marginBottom: "var(--spacing-lg)",
  },
  backLink: {
    marginTop: "var(--spacing-lg)",
    padding: "var(--spacing-md) var(--spacing-lg)",
    backgroundColor: "var(--primary-600)",
    color: "white",
    border: "none",
    borderRadius: "var(--radius-lg)",
    cursor: "pointer",
    fontWeight: "600",
  },
};

