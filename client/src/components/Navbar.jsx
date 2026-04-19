import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/magnifying-glass-logo.svg";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navItems = user.role === "author"
    ? [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Submit Paper", path: "/submit-paper" },
        { label: "My Papers", path: "/author-dashboard" },
      ]
    : user.role === "reviewer"
    ? [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Assigned Papers", path: "/assigned-papers" },
        { label: "Manage Expertise", path: "/manage-expertise" },
      ]
    : user.role === "editor" || user.role === "admin"
    ? [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Paper Decisions", path: "/admin-dashboard" },
      ]
    : [];

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        {/* Logo & Brand */}
        <div
          style={styles.brand}
          onClick={() => navigate("/dashboard")}
        >
          <img src={logo} alt="RevMatch" style={styles.logo} />
          <span style={styles.brandText}>RevMatch</span>
        </div>

        {/* Desktop Navigation */}
        <div style={styles.navItems}>
          {navItems.map((item) => (
            <button
              key={item.path}
              style={{
                ...styles.navLink,
                ...(isActive(item.path) ? styles.navLinkActive : {}),
              }}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* User Menu */}
        <div style={styles.userMenu}>
          <span style={styles.userName}>{user.name || "User"}</span>
          <span style={styles.userRole}>({user.role})</span>
          <button
            style={styles.logoutBtn}
            onClick={handleLogout}
            title="Logout"
          >
            ↓ Logout
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          style={styles.mobileMenuBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={styles.mobileMenu}>
          {navItems.map((item) => (
            <button
              key={item.path}
              style={{
                ...styles.mobileNavLink,
                ...(isActive(item.path) ? styles.mobileNavLinkActive : {}),
              }}
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
          <button
            style={styles.mobileLogoutBtn}
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: "var(--bg-primary)",
    borderBottom: "1px solid var(--border-light)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 var(--spacing-lg)",
    height: "64px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "var(--spacing-md)",
    cursor: "pointer",
    textDecoration: "none",
    transition: "opacity var(--transition-fast)",
  },
  logo: {
    height: "40px",
    width: "auto",
  },
  brandText: {
    fontSize: "20px",
    fontWeight: "700",
    color: "var(--primary-600)",
    userSelect: "none",
  },
  navItems: {
    display: "flex",
    gap: "var(--spacing-lg)",
    alignItems: "center",
    "@media (max-width: 768px)": {
      display: "none",
    },
  },
  navLink: {
    backgroundColor: "transparent",
    color: "var(--text-secondary)",
    padding: "8px 12px",
    borderRadius: "var(--radius-md)",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all var(--transition-fast)",
    cursor: "pointer",
    border: "none",
  },
  navLinkActive: {
    color: "var(--primary-600)",
    backgroundColor: "rgba(26, 115, 232, 0.1)",
    fontWeight: "600",
  },
  userMenu: {
    display: "flex",
    alignItems: "center",
    gap: "var(--spacing-md)",
    "@media (max-width: 768px)": {
      display: "none",
    },
  },
  userName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "var(--text-primary)",
  },
  userRole: {
    fontSize: "12px",
    color: "var(--text-tertiary)",
  },
  logoutBtn: {
    padding: "8px 16px",
    backgroundColor: "var(--danger-600)",
    color: "white",
    border: "none",
    borderRadius: "var(--radius-md)",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color var(--transition-fast)",
  },
  mobileMenuBtn: {
    display: "none",
    backgroundColor: "transparent",
    color: "var(--text-primary)",
    fontSize: "24px",
    border: "none",
    cursor: "pointer",
    "@media (max-width: 768px)": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  mobileMenu: {
    display: "none",
    backgroundColor: "var(--bg-secondary)",
    borderTop: "1px solid var(--border-light)",
    flexDirection: "column",
    gap: "var(--spacing-sm)",
    padding: "var(--spacing-md)",
    "@media (max-width: 768px)": {
      display: "flex",
    },
  },
  mobileNavLink: {
    width: "100%",
    padding: "12px var(--spacing-md)",
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-secondary)",
    border: "1px solid var(--border-light)",
    borderRadius: "var(--radius-md)",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
    textAlign: "left",
  },
  mobileNavLinkActive: {
    backgroundColor: "rgba(26, 115, 232, 0.1)",
    color: "var(--primary-600)",
    borderColor: "var(--primary-600)",
    fontWeight: "600",
  },
  mobileLogoutBtn: {
    width: "100%",
    padding: "12px var(--spacing-md)",
    backgroundColor: "var(--danger-600)",
    color: "white",
    border: "none",
    borderRadius: "var(--radius-md)",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "var(--spacing-md)",
  },
};
