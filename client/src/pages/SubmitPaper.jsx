import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SubmitPaper() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    keywords: "",
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (user.role !== "author") {
      navigate("/dashboard");
    }
  }, [token, user.role, navigate]);

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

    if (!token) {
      setError("Please login first");
      navigate("/login");
      setLoading(false);
      return;
    }

    if (!file) {
      setError("Please upload a PDF file");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("abstract", formData.abstract);
    data.append("keywords", formData.keywords);
    // Remove submittedBy - backend will use req.user.id
    data.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/paper/submit", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        console.error('Submit error:', result);
        setError(result.message || 'Submission failed');
        if (res.status === 401) {
          setError('Session expired. Please login again.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setTimeout(() => navigate("/login"), 2000);
        }
      } else {
        setMessage("Paper submitted successfully!");
        setFormData({ title: "", abstract: "", keywords: "" });
        setFile(null);
      }
    } catch (err) {
      console.error('Submit network error:', err);
      setError("Network error. Check if server is running.");
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
    backgroundColor: "#1a73e8",
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "480px",
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
  textarea: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    minHeight: "100px",
    resize: "vertical",
  },
  fileInput: {
    width: "100%",
    fontSize: "13px",
    color: "#333",
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