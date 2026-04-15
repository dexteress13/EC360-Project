import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
const role = user?.role || "author";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const adminCards = [
    {
      title: "Paper Decisions",
      path: "/admin-dashboard",
      description: "View reviewer feedback and make final accept/reject decisions",
      icon: "⚖️",
    },
  ];

  const authorCards = [
    {
      title: "Submit Paper",
      path: "/submit-paper",
      description: "Upload your research paper for review assignment",
      icon: "📄",
    },
    {
      title: "View My Papers",
      path: "/author-dashboard",
      description: "Track the status of your submitted papers",
      icon: "📋",
    },
  ];

  const editorCards = adminCards;

  const reviewerCards = [
    {
      title: "Manage Expertise",
      path: "/manage-expertise",
      description: "Update your expertise keywords",
      icon: "⭐",
    },
    {
      title: "Assigned Papers",
      path: "/assigned-papers",
      description: "View papers assigned to you",
      icon: "📄",
    },
  ];

  const cards =
    (role === "admin" || role === "editor")
      ? adminCards
      : role === "reviewer"
      ? reviewerCards
      : authorCards;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>RevMatch Dashboard</h2>
            <p style={styles.subtitle}>Welcome back, {user.name || "User"} ({role})</p>
          </div>
          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div style={styles.cardsGrid}>
          {cards.map((card) => (
            <div
              key={card.path}
              style={styles.cardItem}
              onClick={() => navigate(card.path)}
            >
              <div style={styles.cardIcon}>{card.icon}</div>
              <h3 style={styles.cardTitle}>{card.title}</h3>
              <p style={styles.cardDescription}>{card.description}</p>
            </div>
          ))}
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
    backgroundColor: "#f0f2f5",
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "900px",
  },
  header: {
    padding: "40px 40px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a73e8",
    margin: 0,
  },
  subtitle: {
    color: "#666",
    fontSize: "16px",
    margin: "4px 0 0 0",
  },
  logoutButton: {
    padding: "12px 24px",
    backgroundColor: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  cardsGrid: {
    padding: "0 40px 40px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  },
  cardItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    padding: "28px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "1px solid #e9ecef",
  },
  cardIcon: {
    fontSize: "36px",
    marginBottom: "16px",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1a73e8",
    margin: "0 0 8px 0",
  },
  cardDescription: {
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.5",
    margin: 0,
  },
};

