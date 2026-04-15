import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminPaperDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paper, setPaper] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [decisionStatus, setDecisionStatus] = useState("");
  const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user.role) user.role = user.role.toLowerCase();

  useEffect(() => {
if (user.role !== "editor") {
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
        setReviews(data.reviews);
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
        setDecisionStatus(`Paper ${status.toUpperCase()} successfully!`);
        setTimeout(() => navigate("/admin-dashboard"), 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Decision failed");
    }
  };

  if (loading) return <div style={styles.loading}>Loading paper details...</div>;
  if (error) return <div style={styles.error}>{error}</div>;
  if (!paper) return <div style={styles.error}>Paper not found</div>;

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#17a2b8';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Paper Review Details</h2>
        <div style={styles.paperInfo}>
          <h3 style={styles.paperTitle}>{paper.title}</h3>
          <p style={styles.paperAuthor}>Author: {paper.submittedBy?.name} ({paper.submittedBy?.email})</p>
          <p style={styles.paperAbstract}>
            <strong>Abstract:</strong> {paper.abstract.substring(0, 300)}...
          </p>
          <div style={styles.currentStatus}>
            Current Status: <span style={{ color: getStatusColor(paper.status) }}>
              {paper.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        <div style={styles.reviewsSection}>
          <h3>Reviewer Feedback ({reviews.length})</h3>
          {reviews.length === 0 ? (
            <p style={styles.noReviews}>No reviews yet.</p>
          ) : (
            <div style={styles.reviewsList}>
              {reviews.map((review, idx) => (
                <div key={idx} style={styles.reviewCard}>
                  <p><strong>{review.reviewerName}:</strong></p>
                  <p>{review.review || 'No comments'}</p>
                  {review.rating && <p>Rating: {review.rating}/5</p>}
                  {review.submittedAt && <p><small>Submitted: {new Date(review.submittedAt).toLocaleDateString()}</small></p>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.decisionSection}>
          <h3>Make Final Decision</h3>
          <div style={styles.buttons}>
            <button 
              style={styles.acceptBtn}
              onClick={() => makeDecision('accepted')}
              disabled={paper.status === 'accepted' || paper.status === 'rejected'}
            >
              ✅ Accept Paper
            </button>
            <button 
              style={styles.rejectBtn}
              onClick={() => makeDecision('rejected')}
              disabled={paper.status === 'accepted' || paper.status === 'rejected'}
            >
              ❌ Reject Paper
            </button>
          </div>
          {decisionStatus && <p style={styles.successMsg}>{decisionStatus}</p>}
        </div>

        <button style={styles.backBtn} onClick={() => navigate("/admin-dashboard")}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", padding: "20px", backgroundColor: "#f0f2f5" },
  card: { maxWidth: "800px", margin: "0 auto", background: "white", borderRadius: "12px", padding: "40px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" },
  title: { textAlign: "center", color: "#1a73e8", marginBottom: "32px" },
  paperInfo: { marginBottom: "32px", paddingBottom: "24px", borderBottom: "1px solid #eee" },
  paperTitle: { fontSize: "24px", fontWeight: "700", color: "#333", marginBottom: "12px" },
  paperAuthor: { color: "#666", marginBottom: "12px" },
  paperAbstract: { lineHeight: "1.6", color: "#555" },
  currentStatus: { marginTop: "12px", fontSize: "16px", fontWeight: "500" },
  reviewsSection: { marginBottom: "32px" },
  reviewsList: { display: "flex", flexDirection: "column", gap: "20px" },
  reviewCard: { background: "#f8f9fa", padding: "20px", borderRadius: "8px", borderLeft: "4px solid #1a73e8" },
  decisionSection: { textAlign: "center", padding: "24px", background: "#f8f9fa", borderRadius: "12px" },
  buttons: { display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap", marginTop: "16px" },
  acceptBtn: { 
    padding: "14px 28px", background: "#28a745", color: "white", border: "none", 
    borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: "pointer",
    minWidth: "160px"
  },
  rejectBtn: { 
    padding: "14px 28px", background: "#dc3545", color: "white", border: "none", 
    borderRadius: "8px", fontSize: "16px", fontWeight: "600", cursor: "pointer",
    minWidth: "160px"
  },
  backBtn: { 
    width: "100%", padding: "14px", background: "#6c757d", color: "white", 
    border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "600", 
    cursor: "pointer", marginTop: "24px" 
  },
  successMsg: { color: "#28a745", fontSize: "18px", fontWeight: "600", marginTop: "16px" },
  loading: { textAlign: "center", padding: "100px", fontSize: "18px", color: "#666" },
  error: { textAlign: "center", padding: "50px", color: "#dc3545", fontSize: "18px" },
  noReviews: { textAlign: "center", color: "#999", fontStyle: "italic", padding: "40px" },
};
