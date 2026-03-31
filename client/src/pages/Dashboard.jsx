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
      title: "Assign Reviewer",
      description: "Automatically assign reviewers to papers based on expertise",
      path: "/assignment",
      color: "#f4b400",
      icon: "🔗",
    },
  ];

  const reviewerCards = [
    {
      title: "Assigned Papers",
      description: "View papers assigned to you",
      path: "/assigned-papers",
      color: "#34a853",
      icon: "📝",
    },
    {
      title: "Update Profile",
      description: "Manage your expertise keywords",
      path: "/update-profile",
      color: "#ea4335",
      icon: "⚙️",
    },
  ];

  let cards = [];

  if (role === "editor") {
    cards = editorCards;
  } else if (role === "author") {
    cards = authorCards;
  } else if (role === "reviewer") {
    cards = reviewerCards;
  } else if (role === "admin") {
    cards = [...editorCards, ...reviewerCards];
  }
  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>RevMatch</h1>
        <div style={styles.navRight}>
          <span style={styles.roleBadge(role)}>
            {role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"}
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
    background: "linear-gradient(135deg, #1a73e8 0%, #1565c0 100%)",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  navbar: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: "20px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    backdropFilter: "blur(10px)",
    marginBottom: "30px",
  },
  navTitle: {
    fontSize: "28px",
    fontWeight: "800",
    background: "linear-gradient(45deg, #1a73e8, #1565c0)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  roleBadge: (role) => ({
    padding: "8px 16px",
    borderRadius: "25px",
    fontSize: "14px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    backgroundColor: role === "editor" ? "#e8f5e8" : "#e3f2fd",
    color: role === "editor" ? "#2e7d32" : "#1565c0",
    border: `2px solid ${role === "editor" ? "#4caf50" : "#2196f3"}`,
  }),
  welcome: {
    fontSize: "16px",
    color: "#555",
    fontWeight: "500",
  },
  logoutBtn: {
    padding: "10px 20px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "25px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(244, 67, 54, 0.3)",
  },
  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
    backdropFilter: "blur(10px)",
  },
  heading: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#333",
    marginBottom: "8px",
    textAlign: "center",
    background: "linear-gradient(45deg, #1a73e8, #1565c0)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subheading: {
    fontSize: "18px",
    color: "#666",
    marginBottom: "40px",
    textAlign: "center",
    fontWeight: "400",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "15px",
    padding: "30px 25px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "1px solid #e0e0e0",
    position: "relative",
    overflow: "hidden",
  },
  iconBox: {
    width: "60px",
    height: "60px",
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
  icon: { fontSize: "28px" },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#333",
  },
  cardDesc: {
    fontSize: "15px",
    color: "#666",
    lineHeight: "1.6",
    marginBottom: "25px",
  },
  cardBtn: {
    display: "inline-block",
    padding: "12px 24px",
    color: "#fff",
    borderRadius: "25px",
    fontSize: "14px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  },
};