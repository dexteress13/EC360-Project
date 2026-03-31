import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
        // Auto-login after successful registration
        const loginRes = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        });

        const loginData = await loginRes.json();

        if (!loginRes.ok) {
          setMessage("Registration successful! Please log in manually.");
          setTimeout(() => navigate("/login"), 1500);
        } else {
          localStorage.setItem("token", loginData.token);
          localStorage.setItem("user", JSON.stringify(loginData.user));

          setMessage("Registration and login successful! Redirecting...");
          setTimeout(() => navigate("/dashboard"), 1000);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>RevMatch</h2>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input style={styles.input} name="name" placeholder="Name" onChange={handleChange} required />
          <input style={styles.input} name="email" placeholder="Email" onChange={handleChange} required />
          <input style={styles.input} type="password" name="password" placeholder="Password" onChange={handleChange} required />

          {/* ✅ ROLE DROPDOWN */}
          <select style={styles.input} name="role" value={formData.role} onChange={handleChange}>
            <option value="author">Author</option>
            <option value="editor">Editor</option>
            <option value="reviewer">Reviewer</option>
            <option value="admin">Admin</option>
          </select>

          <button style={styles.button} disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p style={styles.link}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { 
    minHeight: "100vh", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    background: "linear-gradient(135deg, #1a73e8 0%, #1565c0 100%)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: { 
    background: "rgba(255, 255, 255, 0.95)", 
    padding: 50, 
    borderRadius: 20, 
    width: 400,
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
    backdropFilter: "blur(10px)",
  },
  title: { 
    textAlign: "center", 
    color: "#1a73e8",
    fontSize: "32px",
    fontWeight: "800",
    background: "linear-gradient(45deg, #1a73e8, #1565c0)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: 10,
  },
  input: { 
    width: "100%", 
    padding: 12, 
    marginBottom: 15,
    borderRadius: 10,
    border: "2px solid #e0e0e0",
    fontSize: 16,
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  button: { 
    width: "100%", 
    padding: 14, 
    background: "linear-gradient(45deg, #1a73e8, #1565c0)", 
    color: "#fff", 
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 5px 15px rgba(26, 115, 232, 0.4)",
  },
  success: { 
    color: "green",
    marginBottom: 15,
    backgroundColor: "#e8f5e8",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #4caf50",
  },
  error: { 
    color: "red",
    marginBottom: 15,
    backgroundColor: "#fce8e6",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #f44336",
  },
  link: { 
    textAlign: "center", 
    marginTop: 20,
    color: "#666",
    fontSize: 14,
  },
};