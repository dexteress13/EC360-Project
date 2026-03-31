import { useState } from "react";

export default function ReviewerProfile() {
  const [formData, setFormData] = useState({ name: "", email: "", expertise: "" });
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

    // Convert comma separated expertise string to array
    const expertiseArray = formData.expertise
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    if (expertiseArray.length === 0) {
      setError("Please enter at least one expertise keyword");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/reviewer/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, expertise: expertiseArray }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
        setMessage("Reviewer profile created successfully!");
        setFormData({ name: "", email: "", expertise: "" });
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
        <h2 style={styles.title}>RevMatch</h2>
        <p style={styles.subtitle}>Create Reviewer Profile</p>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              type="text"
              name="name"
              placeholder="Enter reviewer name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="Enter reviewer email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Expertise Keywords</label>
            <input
              style={styles.input}
              type="text"
              name="expertise"
              placeholder="e.g. machine learning, NLP, computer vision"
              value={formData.expertise}
              onChange={handleChange}
              required
            />
            <p style={styles.hint}>Separate multiple keywords with commas</p>
          </div>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Reviewer Profile"}
          </button>
        </form>
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
    background: "linear-gradient(135deg, #1a73e8 0%, #1565c0 100%)",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: "50px",
    borderRadius: "20px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "500px",
    backdropFilter: "blur(10px)",
  },
  title: {
    textAlign: "center",
    fontSize: "32px",
    fontWeight: "800",
    background: "linear-gradient(45deg, #1a73e8, #1565c0)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "8px",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "30px",
    fontSize: "16px",
    fontWeight: "400",
  },
  inputGroup: { marginBottom: "25px" },
  label: {
    display: "block",
    marginBottom: "10px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "10px",
    border: "2px solid #e0e0e0",
    fontSize: "16px",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    transition: "border-color 0.3s ease",
  },
  button: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(45deg, #1a73e8, #1565c0)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "10px",
    transition: "all 0.3s ease",
    boxShadow: "0 5px 15px rgba(102, 126, 234, 0.4)",
  },
  success: {
    backgroundColor: "#e8f5e8",
    color: "#2e7d32",
    padding: "14px",
    borderRadius: "10px",
    fontSize: "14px",
    marginBottom: "15px",
    border: "1px solid #4caf50",
  },
  error: {
    backgroundColor: "#fce8e6",
    color: "#c5221f",
    padding: "14px",
    borderRadius: "10px",
    fontSize: "14px",
    marginBottom: "15px",
    border: "1px solid #f44336",
  },
  hint: {
    fontSize: "12px",
    color: "#888",
    marginTop: "6px",
    fontWeight: "400",
  },
};