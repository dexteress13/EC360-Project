import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ReviewerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user.role !== "reviewer") {
      navigate("/dashboard");
    }
  }, [user.role, navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>RevMatch</h2>
        <p style={styles.subtitle}>Reviewer Dashboard ({user.name})</p>

        {/* Assigned Papers Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Assigned Papers</h3>
          <p style={styles.sectionDesc}>View your assigned papers for review</p>
          <button 
            style={styles.largeButton}
            onClick={() => navigate("/assigned-papers")}
          >
            👁️ View Assigned Papers
          </button>
        </div>

        {/* Manage Expertise Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Manage Expertise</h3>
          <p style={styles.sectionDesc}>Update your research keywords to get better matches</p>
          <button 
            style={styles.largeButton}
            onClick={() => navigate("/manage-expertise")}
          >
            ✏️ Update Expertise Profile
          </button>
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
    backgroundColor: "#1a73e8",
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "800px",
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
    marginBottom: "32px",
    fontSize: "14px",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "32px",
    marginBottom: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    textAlign: "center",
  },
  sectionTitle: {
    margin: "0 0 8px 0",
    fontSize: "22px",
    fontWeight: "600",
    color: "#1a73e8",
  },
  sectionDesc: {
    color: "#666",
    fontSize: "15px",
    margin: "0 0 24px 0",
    lineHeight: "1.5",
  },
  largeButton: {
    width: "100%",
    padding: "16px 24px",
    backgroundColor: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(26, 115, 232, 0.3)",
  },
};
