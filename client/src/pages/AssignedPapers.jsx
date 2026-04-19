import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Alert from "../components/Alert";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AssignedPapers() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPapers = async () => {
      if (!token) return navigate("/login");

      try {
        const res = await fetch("http://localhost:5000/api/reviewer/dashboard", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setPapers(data.papers || []);
        } else {
          setError(data.message || "Failed to load");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, [token, navigate]);

  const submitReview = async (assignmentId, comments, decision) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reviewer/submit-review/${assignmentId}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ review: comments, decision })
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  if (loading)
    return (
      <>
        <Navbar />
        <div style={styles.container}>
          <LoadingSpinner size="lg" label="Loading your assigned papers..." />
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
            <h1 style={styles.title}>📚 Assigned Papers</h1>
            <p style={styles.subtitle}>
              {papers.length} paper{papers.length !== 1 ? "s" : ""} assigned for review
            </p>
          </div>

          {error && (
            <Alert type="danger" message={error} onClose={() => setError("")} />
          )}

          {/* Papers List */}
          {papers.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📭</div>
              <h3 style={styles.emptyTitle}>No Papers Assigned Yet</h3>
              <p style={styles.emptyText}>
                Update your expertise profile to receive papers matching your research interests
              </p>
              <button
                style={styles.emptyButton}
                onClick={() => navigate("/manage-expertise")}
              >
                Update Expertise Profile
              </button>
            </div>
          ) : (
            <div style={styles.papersGrid}>
              {papers.map((paper) => (
                <PaperCard
                  key={paper._id}
                  paper={paper}
                  token={token}
                  submitReview={submitReview}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function PaperCard({ paper, token, submitReview }) {
  const [showForm, setShowForm] = useState(false);
  const [comments, setComments] = useState('');
  const [decision, setDecision] = useState('accept');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comments.trim()) {
      setMessage('Please provide review comments');
      setMessageType('danger');
      return;
    }

    setSubmitting(true);
    const success = await submitReview(paper.assignmentId, comments, decision);
    setSubmitting(false);

    if (success) {
      setMessage('✓ Review submitted successfully!');
      setMessageType('success');
      setShowForm(false);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Failed to submit review. Please try again.');
      setMessageType('danger');
    }
  };

  const isCompleted = paper.status === 'completed';

  return (
    <div style={styles.paperCard}>
      {/* Card Header */}
      <div style={styles.cardHeader}>
        <div style={styles.headerContent}>
          <h3 style={styles.paperTitle}>{paper.title}</h3>
          <span style={{ ...styles.statusBadge, backgroundColor: isCompleted ? '#10b981' : '#f59e0b' }}>
            {isCompleted ? '✓ Reviewed' : 'Pending'}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div style={styles.cardBody}>
        {/* Abstract */}
        <div style={styles.section}>
          <p style={styles.abstract}>
            {paper.abstract?.substring(0, 200)}
            {paper.abstract?.length > 200 ? '...' : ''}
          </p>
        </div>

        {/* Metadata */}
        <div style={styles.metadata}>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Author:</span>
            <span style={styles.metaValue}>{paper.submittedBy?.name || 'Unknown'}</span>
          </div>
          {paper.keywords && (
            <div style={styles.metaItem}>
              <span style={styles.metaLabel}>Keywords:</span>
              <div style={styles.keywords}>
                {paper.keywords
                  .split(',')
                  .slice(0, 3)
                  .map((kw, i) => (
                    <span key={i} style={styles.keyword}>
                      {kw.trim()}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* PDF Link */}
        {paper.filePath && (
          <div style={styles.pdfSection}>
            <a
              href={`http://localhost:5000/${paper.filePath}`}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.pdfLink}
            >
              📄 Download Paper PDF
            </a>
          </div>
        )}
      </div>

      {/* Alert Message */}
      {message && (
        <Alert
          type={messageType}
          message={message}
          onClose={() => setMessage('')}
        />
      )}

      {/* Review Form Section */}
      {!isCompleted && (
        <div style={styles.cardFooter}>
          {!showForm ? (
            <button
              style={styles.reviewButton}
              onClick={() => setShowForm(true)}
            >
              ✍️ Submit Review
            </button>
          ) : (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Your Review Comments *</label>
                <textarea
                  style={styles.textarea}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Provide detailed feedback on the paper quality, methodology, and recommendations..."
                  rows="5"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Decision *</label>
                <select
                  style={styles.select}
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                >
                  <option value="accept">✓ Accept</option>
                  <option value="reject">✕ Reject</option>
                </select>
              </div>

              <div style={styles.formButtons}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ ...styles.submitButton, opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setComments('');
                    setDecision('accept');
                  }}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {isCompleted && (
        <div style={styles.completedBadge}>
          ✓ Review submitted successfully
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "calc(100vh - 64px)",
    backgroundColor: "var(--bg-secondary)",
    padding: "var(--spacing-xl) var(--spacing-lg)",
  },
  content: {
    maxWidth: "1000px",
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
  papersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(450px, 1fr))",
    gap: "var(--spacing-lg)",
  },
  paperCard: {
    backgroundColor: "var(--bg-primary)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border-light)",
    overflow: "hidden",
    transition: "all var(--transition-base)",
    display: "flex",
    flexDirection: "column",
  },
  cardHeader: {
    padding: "var(--spacing-lg)",
    borderBottom: "1px solid var(--border-light)",
    backgroundColor: "var(--bg-secondary)",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "var(--spacing-md)",
  },
  paperTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: 0,
    flex: 1,
  },
  statusBadge: {
    fontSize: "11px",
    fontWeight: "700",
    color: "white",
    padding: "4px 12px",
    borderRadius: "var(--radius-full)",
    whiteSpace: "nowrap",
  },
  cardBody: {
    padding: "var(--spacing-lg)",
    flex: 1,
  },
  section: {
    marginBottom: "var(--spacing-lg)",
  },
  abstract: {
    fontSize: "13px",
    color: "var(--text-secondary)",
    lineHeight: "1.6",
    margin: 0,
  },
  metadata: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--spacing-md)",
    paddingBottom: "var(--spacing-lg)",
    borderBottom: "1px solid var(--border-light)",
  },
  metaItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "var(--spacing-md)",
  },
  metaLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "var(--text-secondary)",
    minWidth: "70px",
  },
  metaValue: {
    fontSize: "13px",
    color: "var(--text-primary)",
  },
  keywords: {
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--spacing-sm)",
  },
  keyword: {
    fontSize: "11px",
    backgroundColor: "rgba(26, 115, 232, 0.1)",
    color: "var(--primary-600)",
    padding: "3px 10px",
    borderRadius: "var(--radius-full)",
  },
  pdfSection: {
    paddingTop: "var(--spacing-lg)",
  },
  pdfLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--spacing-sm)",
    padding: "8px 16px",
    backgroundColor: "rgba(26, 115, 232, 0.1)",
    color: "var(--primary-600)",
    textDecoration: "none",
    borderRadius: "var(--radius-md)",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all var(--transition-fast)",
  },
  cardFooter: {
    padding: "var(--spacing-lg)",
    borderTop: "1px solid var(--border-light)",
  },
  reviewButton: {
    width: "100%",
    padding: "var(--spacing-md)",
    backgroundColor: "var(--primary-600)",
    color: "white",
    border: "none",
    borderRadius: "var(--radius-lg)",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--spacing-lg)",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--spacing-sm)",
  },
  formLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "var(--text-primary)",
  },
  textarea: {
    padding: "var(--spacing-md)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-lg)",
    fontSize: "13px",
    color: "var(--text-primary)",
    fontFamily: "inherit",
    resize: "vertical",
    transition: "border-color var(--transition-fast)",
  },
  select: {
    padding: "var(--spacing-md)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-lg)",
    fontSize: "13px",
    color: "var(--text-primary)",
    backgroundColor: "var(--bg-primary)",
  },
  formButtons: {
    display: "flex",
    gap: "var(--spacing-md)",
  },
  submitButton: {
    flex: 1,
    padding: "var(--spacing-md)",
    backgroundColor: "var(--success-600)",
    color: "white",
    border: "none",
    borderRadius: "var(--radius-lg)",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
  },
  cancelButton: {
    flex: 1,
    padding: "var(--spacing-md)",
    backgroundColor: "var(--bg-secondary)",
    color: "var(--text-primary)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-lg)",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
  },
  completedBadge: {
    padding: "var(--spacing-md)",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    color: "var(--success-600)",
    textAlign: "center",
    fontWeight: "600",
    fontSize: "13px",
    borderTop: "1px solid var(--border-light)",
  },
  emptyState: {
    textAlign: "center",
    padding: "var(--spacing-2xl)",
    backgroundColor: "var(--bg-primary)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border-light)",
  },
  emptyIcon: {
    fontSize: "64px",
    marginBottom: "var(--spacing-lg)",
  },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: "0 0 var(--spacing-md) 0",
  },
  emptyText: {
    color: "var(--text-secondary)",
    margin: "0 0 var(--spacing-lg) 0",
  },
  emptyButton: {
    padding: "var(--spacing-md) var(--spacing-lg)",
    backgroundColor: "var(--primary-600)",
    color: "white",
    border: "none",
    borderRadius: "var(--radius-lg)",
    fontWeight: "600",
    cursor: "pointer",
  },
};
