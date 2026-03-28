import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const authorCards = [
    {
      title: "Submit Paper",
      description: "Upload your research paper with title, abstract and keywords",
      path: "/submit-paper",
      color: "#1a73e8",
      icon: "📄",
    },
  ];

  const editorCards = [
    {
      title: "Create Reviewer Profile",
      description: "Add a new reviewer with their expertise keywords",
      path: "/reviewer-profile",
      color: "#0f9d58",
      icon: "👤",
    },
    {
      title: "Assign Reviewer",
      description: "Automatically assign reviewers to papers based on expertise",
      path: "/assignment",
      color: "#f4b400",
      icon: "🔗",
    },
  ];

  const cards = role === "editor" ? editorCards : authorCards;

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>RevMatch</h1>
        <div style={styles.navRight}>
          <span style={styles.roleBadge(role)}>
            {role === "editor" ? "Editor" : "Author"}
          </span>
          <span style={styles.welcome}>
            Welcome, {user.name || "User"}
          </span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={styles.main}>
        <h2 style={styles.heading}>Dashboard</h2>
        <p style={styles.subheading}>
          Academic Paper Review Management System
        </p>

        <div style={styles.grid}>
          {cards.map((card) => (
            <div
              key={card.path}
              style={styles.card}
              onClick={() => navigate(card.path)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
              }}
            >
              <div style={{ ...styles.iconBox, backgroundColor: card.color + "15" }}>
                <span style={styles.icon}>{card.icon}</span>
              </div>
              <h3 style={{ ...styles.cardTitle, color: card.color }}>
                {card.title}
              </h3>
              <p style={styles.cardDesc}>{card.description}</p>
              <div style={{ ...styles.cardBtn, backgroundColor: card.color }}>
                Go →
              </div>
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
    backgroundColor: "#f0f2f5",
  },
  navbar: {
    backgroundColor: "#fff",
    padding: "16px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  navTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1a73e8",
    margin: 0,
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  roleBadge: (role) => ({
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    backgroundColor: role === "editor" ? "#e6f4ea" : "#e8f0fe",
    color: role === "editor" ? "#0f9d58" : "#1a73e8",
  }),
  welcome: {
    fontSize: "14px",
    color: "#555",
  },
  logoutBtn: {
    padding: "8px 16px",
    backgroundColor: "#fff",
    color: "#d93025",
    border: "1px solid #d93025",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },
  main: {
    padding: "40px 32px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  heading: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#202124",
    marginBottom: "4px",
  },
  subheading: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "32px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "28px 24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  iconBox: {
    width: "52px",
    height: "52px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
  },
  icon: { fontSize: "24px" },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  cardDesc: {
    fontSize: "13px",
    color: "#666",
    lineHeight: "1.5",
    marginBottom: "20px",
  },
  cardBtn: {
    display: "inline-block",
    padding: "8px 16px",
    color: "#fff",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
  },
};