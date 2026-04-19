import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ReviewerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user.role !== "reviewer") {
      navigate("/dashboard");
    }
  }, [user.role, navigate]);

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.content}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>Reviewer Dashboard 👁️</h1>
            <p style={styles.subtitle}>Manage your review assignments and expertise</p>
          </div>

          {/* Cards Grid */}
          <div style={styles.cardsGrid}>
            {/* Assigned Papers Card */}
            <div
              style={styles.card}
              onClick={() => navigate("/assigned-papers")}
            >
              <div style={{ ...styles.cardIcon, backgroundColor: "#ec494920" }}>
                <span style={styles.iconText}>📚</span>
              </div>
              <h3 style={styles.cardTitle}>Assigned Papers</h3>
              <p style={styles.cardDescription}>
                View and review papers assigned to you based on your expertise
              </p>
              <div style={styles.cardArrow}>→</div>
            </div>

            {/* Manage Expertise Card */}
            <div
              style={styles.card}
              onClick={() => navigate("/manage-expertise")}
            >
              <div style={{ ...styles.cardIcon, backgroundColor: "#8b5cf620" }}>
                <span style={styles.iconText}>⭐</span>
              </div>
              <h3 style={styles.cardTitle}>Expertise Profile</h3>
              <p style={styles.cardDescription}>
                Update your research keywords to improve paper recommendations
              </p>
              <div style={styles.cardArrow}>→</div>
            </div>
          </div>

          {/* Info Section */}
          <div style={styles.infoSection}>
            <h3 style={styles.infoTitle}>💡 Tips for Better Matches</h3>
            <ul style={styles.infoList}>
              <li>Keep your expertise keywords up-to-date</li>
              <li>Review papers in your research area</li>
              <li>Provide constructive feedback to authors</li>
              <li>Complete reviews on time to help the process</li>
            </ul>
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
    maxWidth: "1000px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "var(--spacing-xl)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: "0 0 var(--spacing-md) 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    margin: 0,
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "var(--spacing-lg)",
    marginBottom: "var(--spacing-xl)",
  },
  card: {
    backgroundColor: "var(--bg-primary)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--spacing-lg)",
    cursor: "pointer",
    transition: "all var(--transition-base)",
    border: "1px solid var(--border-light)",
    position: "relative",
    overflow: "hidden",
  },
  cardIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "var(--radius-lg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "var(--spacing-lg)",
  },
  iconText: {
    fontSize: "32px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: "0 0 var(--spacing-sm) 0",
  },
  cardDescription: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    lineHeight: "1.5",
    margin: 0,
  },
  cardArrow: {
    fontSize: "24px",
    color: "var(--primary-600)",
    opacity: 0,
    transition: "opacity var(--transition-fast)",
    position: "absolute",
    bottom: "var(--spacing-lg)",
    right: "var(--spacing-lg)",
  },
  infoSection: {
    backgroundColor: "var(--bg-primary)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--spacing-lg)",
    border: "1px solid var(--border-light)",
    borderLeft: "4px solid var(--info-600)",
  },
  infoTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: "0 0 var(--spacing-md) 0",
  },
  infoList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
};
