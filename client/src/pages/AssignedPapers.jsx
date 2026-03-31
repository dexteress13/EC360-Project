import { useEffect, useState } from "react";

export default function AssignedPapers() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.email || user.role !== "reviewer") {
      setError("You must be signed in as a reviewer to view this page.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/assignment/reviewer/${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message && data.message.includes("No assignments")) {
          setAssignments([]);
        } else {
          setAssignments(data);
        }
      })
      .catch(() => setError("Failed to load assigned papers."))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div style={styles.loading}>Loading assigned papers...</div>;

  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Assigned Papers</h2>
      {assignments.length === 0 ? (
        <p style={styles.subtitle}>No papers assigned yet.</p>
      ) : (
        assignments.map((assignment) => (
          <div key={assignment._id} style={styles.card}>
            <div style={styles.row}>
              <span style={styles.label}>Paper:</span>
              <span style={styles.value}>{assignment.paperTitle}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Matched Keywords:</span>
              <span style={styles.value}> {assignment.matchedKeywords.join(", ")}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Match Score:</span>
              <span style={styles.value}>{assignment.matchScore}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Assigned At:</span>
              <span style={styles.value}>{new Date(assignment.createdAt).toLocaleString()}</span>
            </div>

            <div style={styles.actionRow}>
              {assignment.paperFilePath ? (
                <a
                  style={styles.linkBtn}
                  href={`http://localhost:5000/${assignment.paperFilePath}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View PDF
                </a>
              ) : (
                <span style={styles.noFile}>No PDF attached</span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "50px auto",
    padding: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
    backdropFilter: "blur(10px)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    marginBottom: "15px",
    color: "#333",
    fontSize: "28px",
    fontWeight: "800",
    textAlign: "center",
    background: "linear-gradient(45deg, #1a73e8, #1565c0)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "#666",
    fontSize: "16px",
    textAlign: "center",
    marginBottom: "30px",
  },
  loading: {
    margin: "60px",
    fontSize: "18px",
    textAlign: "center",
    color: "#666",
  },
  error: {
    margin: "60px",
    color: "#c5221f",
    fontSize: "16px",
    textAlign: "center",
    backgroundColor: "#fce8e6",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #f44336",
  },
  card: {
    border: "1px solid #e0e0e0",
    borderRadius: "15px",
    padding: "20px 25px",
    marginBottom: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
    transition: "box-shadow 0.3s ease",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    alignItems: "center",
  },
  label: {
    fontWeight: "700",
    color: "#555",
    fontSize: "14px",
  },
  value: {
    color: "#333",
    textAlign: "right",
    fontSize: "14px",
    fontWeight: "500",
  },
  actionRow: {
    display: "flex",
    gap: "15px",
    marginTop: "15px",
  },
  linkBtn: {
    display: "inline-block",
    padding: "10px 18px",
    borderRadius: "8px",
    background: "linear-gradient(45deg, #1a73e8, #1565c0)",
    color: "#fff",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(26, 115, 232, 0.3)",
  },
  noFile: {
    color: "#999",
    fontSize: "14px",
    fontStyle: "italic",
  },
};