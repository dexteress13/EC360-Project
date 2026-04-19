import { useState } from "react";
import Header from "../components/Header";
import { useNavigate, Link } from "react-router-dom";

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
        // ✅ Role validation
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


        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              onChange={handleChange}
              required
            />
          </div>

          {/* ✅ NEW ROLE DROPDOWN */}
          <div style={styles.inputGroup}>
            <label>Select Role</label>
            <select
              style={styles.input}
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="author">Author</option>
              <option value="editor">Editor</option>
              <option value="reviewer">Reviewer</option>
            </select>
          </div>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>


        <p style={styles.link}>
          Don't have an account? <Link to="/signup" style={styles.linkText}>Sign up</Link>
        </p>

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
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "420px",
  },
  title: { textAlign: "center" },
  subtitle: { textAlign: "center", marginBottom: "20px" },

  inputGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },


  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#1a73e8",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
    transition: "background-color 0.2s",
  },
  ":hover": {
    backgroundColor: "#1557b0",
  },


  success: {
    backgroundColor: "#e6f4ea",
    color: "#2d7a3a",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "13px",
    marginBottom: "12px",
  },
  error: {
    backgroundColor: "#fce8e6",
    color: "#c5221f",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "13px",
    marginBottom: "12px",
  },


  link: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
    color: "#666",
  },
  linkText: {
    color: "#1a73e8",
    textDecoration: "none",
    fontWeight: "500",
  },

};