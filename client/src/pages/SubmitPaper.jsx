import { useState } from "react";

export default function SubmitPaper() {
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    keywords: "",
    submittedBy: "",
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      setFile(null);
      return;
    }
    setError("");
    setFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!file) {
      setError("Please upload a PDF file");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("abstract", formData.abstract);
    data.append("keywords", formData.keywords);
    data.append("submittedBy", formData.submittedBy);
    data.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/paper/submit", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message);
      } else {
        setMessage("Paper submitted successfully!");
        setFormData({ title: "", abstract: "", keywords: "", submittedBy: "" });
        setFile(null);
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
        <p style={styles.subtitle}>Submit Your Paper</p>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Author Email</label>
            <input
              style={styles.input}
              type="email"
              name="submittedBy"
              placeholder="Your registered email"
              value={formData.submittedBy}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Paper Title</label>
            <input
              style={styles.input}
              type="text"
              name="title"
              placeholder="Enter paper title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Abstract</label>
            <textarea
              style={styles.textarea}
              name="abstract"
              placeholder="Enter paper abstract"
              value={formData.abstract}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Keywords</label>
            <input
              style={styles.input}
              type="text"
              name="keywords"
              placeholder="e.g. machine learning, NLP, deep learning"
              value={formData.keywords}
              onChange={handleChange}
              required
            />
            <p style={styles.hint}>Separate keywords with commas</p>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Upload PDF</label>
            <input
              style={styles.fileInput}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              required
            />
          </div>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Paper"}
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
    maxWidth: "600px",
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
  textarea: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "10px",
    border: "2px solid #e0e0e0",
    fontSize: "16px",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    resize: "vertical",
    minHeight: "120px",
    transition: "border-color 0.3s ease",
  },
  fileInput: {
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