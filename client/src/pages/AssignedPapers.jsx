import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
        console.log("API Response:", data); // DEBUG
        
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

  if (loading) return <div style={styles.loading}>Loading assigned papers...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Assigned Papers ({papers.length})</h2>
        
        {papers.length === 0 ? (
          <p style={styles.noPapers}>No papers assigned. Update expertise first!</p>
        ) : (
          <div style={styles.grid}>
            {papers.map((paper) => (
              <PaperCard key={paper._id} paper={paper} token={token} submitReview={submitReview} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Separate component for proper state scoping
function PaperCard({ paper, token, submitReview }) {
  const [showForm, setShowForm] = useState(false);
  const [comments, setComments] = useState('');
  const [decision, setDecision] = useState('accept');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await submitReview(paper.assignmentId, comments, decision);
    setSubmitting(false);
    
    if (success) {
      setMessage('✅ Review submitted successfully!');
      setShowForm(false);
    } else {
      setMessage('❌ Failed to submit review');
    }
    
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div style={styles.paperCard}>
      <h3 style={styles.paperTitle}>{paper.title}</h3>
      <p style={styles.abstract}>{paper.abstract?.substring(0, 150)}...</p>
      <div style={styles.meta}>
        <span>Status: <strong>{paper.status}</strong></span>
        {paper.filePath && (
          <a 
            href={`http://localhost:5000/${paper.filePath}`} 
            target="_blank" 
            rel="noopener noreferrer"
            style={styles.pdfBtn}
          >
            📄 View PDF
          </a>
        )}
      </div>
      
      {paper.status !== 'completed' && (
        <div>
          <button 
            style={styles.reviewBtn} 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Submit Review'}
          </button>
          
          {showForm && (
            <form onSubmit={handleSubmit} style={styles.form}>
              <textarea
                style={styles.textarea}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter your detailed review comments..."
                rows="4"
                required
              />
              <select 
                style={styles.select}
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
              >
                <option value="accept">Accept</option>
                <option value="reject">Reject</option>
              </select>
              <button type="submit" disabled={submitting} style={styles.submitBtn}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      )}
      
      {message && <p style={styles[message.startsWith('✅') ? 'success' : 'errorMsg']}>{message}</p>}
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', padding: '20px', background: '#f5f5f5' },
  card: { maxWidth: '1200px', margin: '0 auto', background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  title: { textAlign: 'center', color: '#1a73e8', marginBottom: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' },
  paperCard: { border: '1px solid #eee', borderRadius: '8px', padding: '20px', background: '#fafbfc' },
  paperTitle: { margin: '0 0 10px 0', color: '#333', fontSize: '16px' },
  abstract: { color: '#666', margin: '0 0 15px 0', fontSize: '14px' },
  meta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', fontSize: '13px' },
  pdfBtn: { color: '#1a73e8', textDecoration: 'none', padding: '6px 12px', background: '#e8f4fd', borderRadius: '4px' },
  reviewBtn: { background: '#1a73e8', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', marginBottom: '10px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  textarea: { border: '1px solid #ddd', borderRadius: '6px', padding: '10px', fontSize: '14px', resize: 'vertical' },
  select: { padding: '10px', border: '1px solid #ddd', borderRadius: '6px' },
  submitBtn: { background: '#28a745', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  success: { color: '#28a745', background: '#d4edda', padding: '10px', borderRadius: '6px', marginTop: '10px' },
  errorMsg: { color: '#dc3545', background: '#f8d7da', padding: '10px', borderRadius: '6px', marginTop: '10px' },
  loading: { textAlign: 'center', padding: '50px', fontSize: '18px', color: '#666' },
  error: { textAlign: 'center', padding: '50px', color: '#dc3545', fontSize: '18px' },
  noPapers: { textAlign: 'center', padding: '50px', color: '#999', fontSize: '16px' }
};
