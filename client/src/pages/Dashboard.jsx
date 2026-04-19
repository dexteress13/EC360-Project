import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || "author";

  const adminCards = [
    {
      title: "Paper Decisions",
      path: "/admin-dashboard",
      description: "Review submissions and make final accept/reject decisions",
      icon: "⚖️",
      color: "#f59e0b",
    },
  ];

  const authorCards = [
    {
      title: "Submit Paper",
      path: "/submit-paper",
      description: "Upload your research paper for review assignment",
      icon: "📄",
      color: "#10b981",
    },
    {
      title: "My Papers",
      path: "/author-dashboard",
      description: "Track the status and feedback on your submissions",
      icon: "📋",
      color: "#3b82f6",
    },
  ];

  const editorCards = adminCards;

  const reviewerCards = [
    {
      title: "Expertise Profile",
      path: "/manage-expertise",
      description: "Update your research keywords to improve matches",
      icon: "⭐",
      color: "#8b5cf6",
    },
    {
      title: "Assigned Papers",
      path: "/assigned-papers",
      description: "View and review papers assigned to you",
      icon: "📚",
      color: "#ec4899",
    },
  ];

  const cards =
    (role === "admin" || role === "editor")
      ? adminCards
      : role === "reviewer"
      ? reviewerCards
      : authorCards;

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.content}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerContent}>
              <h1 style={styles.title}>Welcome back! 👋</h1>
              <p style={styles.subtitle}>
                {user.name || "User"} • {role.charAt(0).toUpperCase() + role.slice(1)}
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <div style={styles.cardsGrid}>
            {cards.map((card) => (
              <div
                key={card.path}
                style={styles.cardItem}
                onClick={() => navigate(card.path)}
              >
                <div
                  style={{
                    ...styles.cardIcon,
                    backgroundColor: `${card.color}20`,
                  }}
                >
                  <span style={styles.iconText}>{card.icon}</span>
                </div>
                <h3 style={styles.cardTitle}>{card.title}</h3>
                <p style={styles.cardDescription}>{card.description}</p>
                <div style={styles.cardArrow}>→</div>
              </div>
            ))}
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
  headerContent: {
    backgroundColor: "var(--bg-primary)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--spacing-xl)",
    border: "1px solid var(--border-light)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: "0 0 var(--spacing-md) 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--text-tertiary)",
    margin: 0,
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "var(--spacing-lg)",
  },
  cardItem: {
    backgroundColor: "var(--bg-primary)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--spacing-lg)",
    cursor: "pointer",
    transition: "all var(--transition-base)",
    border: "1px solid var(--border-light)",
    position: "relative",
    overflow: "hidden",
  },
  cardItemHover: {
    boxShadow: "var(--shadow-lg)",
    transform: "translateY(-4px)",
  },
  cardIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "var(--radius-lg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "var(--spacing-lg)",
    transition: "transform var(--transition-fast)",
  },
  iconText: {
    fontSize: "32px",
    lineHeight: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
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
    margin: "0 0 var(--spacing-md) 0",
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
};

