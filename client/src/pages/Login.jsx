import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Alert from "../components/Alert";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "author",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
        if (data.user.role !== formData.role) {
          setError("Selected role does not match account");
          setLoading(false);
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <Header />

        <h1 style={styles.title}>Login to RevMatch</h1>
        <p style={styles.subtitle}>Enter your credentials to continue</p>

        {message && <Alert type="success" message={message} />}
        {error && <Alert type="danger" message={error} onClose={() => setError("")} />}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Your Role</label>
            <select
              style={styles.input}
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="author">👨‍🔬 Author</option>
              <option value="reviewer">👁️ Reviewer</option>
              <option value="editor">✏️ Editor</option>
            </select>
          </div>

          <button
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="sm" /> : "Sign In"}
          </button>
        </form>

        <p style={styles.divider}>Don't have an account?</p>

        <Link to="/signup" style={styles.signupLink}>
          Create a new account
        </Link>
      </div>

      <div style={styles.decorative}></div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--bg-secondary)",
    padding: "var(--spacing-lg)",
    position: "relative",
  },
  decorative: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "300px",
    background: "linear-gradient(135deg, var(--primary-600) 0%, var(--primary-400) 100%)",
    opacity: 0.05,
    zIndex: -1,
  },
  card: {
    backgroundColor: "var(--bg-primary)",
    padding: "var(--spacing-2xl)",
    borderRadius: "var(--radius-xl)",
    boxShadow: "var(--shadow-lg)",
    width: "100%",
    maxWidth: "420px",
    border: "1px solid var(--border-light)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: "var(--spacing-lg) 0 var(--spacing-sm) 0",
    textAlign: "center",
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    textAlign: "center",
    margin: "0 0 var(--spacing-xl) 0",
  },
  formGroup: {
    marginBottom: "var(--spacing-lg)",
  },
  label: {
    display: "block",
    marginBottom: "var(--spacing-sm)",
    fontSize: "14px",
    fontWeight: "600",
    color: "var(--text-primary)",
  },
  input: {
    width: "100%",
    padding: "var(--spacing-md)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border-color)",
    fontSize: "14px",
    color: "var(--text-primary)",
    backgroundColor: "var(--bg-primary)",
    transition: "border-color var(--transition-fast), box-shadow var(--transition-fast)",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "var(--spacing-md)",
    backgroundColor: "var(--primary-600)",
    color: "white",
    border: "none",
    borderRadius: "var(--radius-lg)",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "var(--spacing-md)",
    transition: "all var(--transition-fast)",
    boxShadow: "var(--shadow-md)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    textAlign: "center",
    margin: "var(--spacing-xl) 0 var(--spacing-lg) 0",
    fontSize: "13px",
    color: "var(--text-tertiary)",
  },
  signupLink: {
    display: "block",
    textAlign: "center",
    padding: "var(--spacing-md)",
    backgroundColor: "var(--bg-secondary)",
    color: "var(--primary-600)",
    textDecoration: "none",
    borderRadius: "var(--radius-lg)",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all var(--transition-fast)",
    border: "1px solid var(--border-color)",
  },
};