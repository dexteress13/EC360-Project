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
    backgroundColor: "#f0f2f5",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "420px",
  },
  title: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a73e8",
    marginBottom: "4px",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "24px",
    fontSize: "14px",
  },
  inputGroup: { marginBottom: "16px" },
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
  hint: {
    fontSize: "11px",
    color: "#999",
    marginTop: "4px",
  },
};