import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Alert from "../components/Alert";
import LoadingSpinner from "../components/LoadingSpinner";

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
        setTimeout(() => navigate("/author-dashboard"), 2000);
      }
    } catch (err) {
      console.error('Submit network error:', err);
      setError("Network error. Check if server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>📄 Submit Your Paper</h1>
            <p style={styles.subtitle}>Share your research with our review community</p>
          </div>

          {message && <Alert type="success" message={message} />}
          {error && <Alert type="danger" message={error} onClose={() => setError("")} />}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Paper Title *</label>
              <input
                style={styles.input}
                type="text"
                name="title"
                placeholder="Enter your paper title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <p style={styles.hint}>Make your title clear and descriptive</p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Abstract *</label>
              <textarea
                style={styles.textarea}
                name="abstract"
                placeholder="Write a brief summary of your research (100-300 words)"
                value={formData.abstract}
                onChange={handleChange}
                required
              />
              <p style={styles.hint}>Help reviewers understand your work quickly</p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Keywords *</label>
              <input
                style={styles.input}
                type="text"
                name="keywords"
                placeholder="e.g., machine learning, NLP, deep learning"
                value={formData.keywords}
                onChange={handleChange}
                required
              />
              <p style={styles.hint}>Separate keywords with commas (helps with reviewer matching)</p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Upload PDF File *</label>
              <div
                style={{
                  ...styles.fileInput,
                  borderColor: file ? "var(--success-600)" : "var(--border-color)",
                  backgroundColor: file ? "rgba(16, 185, 129, 0.05)" : "var(--bg-secondary)",
                }}
              >
                <input
                  style={styles.fileInputElement}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                />
                <div style={styles.fileInputContent}>
                  <span style={styles.fileIcon}>📁</span>
                  <p style={styles.fileText}>
                    {file ? `✓ ${file.name}` : "Click or drag PDF file here"}
                  </p>
                  <p style={styles.fileSubtext}>Maximum file size: 50MB</p>
                </div>
              </div>
            </div>

            <button
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
              }}
              type="submit"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="sm" /> : "📤 Submit Paper"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    minHeight: "calc(100vh - 64px)",
    backgroundColor: "var(--bg-secondary)",
    padding: "var(--spacing-xl) var(--spacing-lg)",
  },
  card: {
    backgroundColor: "var(--bg-primary)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--shadow-lg)",
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    border: "1px solid var(--border-light)",
  },
  header: {
    padding: "var(--spacing-xl)",
    borderBottom: "1px solid var(--border-light)",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: "0 0 var(--spacing-sm) 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    margin: 0,
  },
  formGroup: {
    marginBottom: "var(--spacing-lg)",
    padding: "var(--spacing-lg)",
    borderBottom: "1px solid var(--border-light)",
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
  textarea: {
    width: "100%",
    padding: "var(--spacing-md)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border-color)",
    fontSize: "14px",
    color: "var(--text-primary)",
    backgroundColor: "var(--bg-primary)",
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: "120px",
    transition: "border-color var(--transition-fast), box-shadow var(--transition-fast)",
    boxSizing: "border-box",
  },
  hint: {
    fontSize: "12px",
    color: "var(--text-tertiary)",
    margin: "var(--spacing-sm) 0 0 0",
  },
  fileInput: {
    position: "relative",
    border: "2px dashed var(--border-color)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--spacing-xl)",
    textAlign: "center",
    backgroundColor: "var(--bg-secondary)",
    transition: "all var(--transition-fast)",
    cursor: "pointer",
  },
  fileInputElement: {
    position: "absolute",
    inset: 0,
    opacity: 0,
    cursor: "pointer",
  },
  fileInputContent: {
    pointerEvents: "none",
  },
  fileIcon: {
    fontSize: "32px",
    display: "block",
    marginBottom: "var(--spacing-md)",
  },
  fileText: {
    fontSize: "14px",
    fontWeight: "600",
    color: "var(--text-primary)",
    margin: "0 0 var(--spacing-sm) 0",
  },
  fileSubtext: {
    fontSize: "12px",
    color: "var(--text-tertiary)",
    margin: 0,
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
    margin: "var(--spacing-lg) 0",
    transition: "all var(--transition-fast)",
    boxShadow: "var(--shadow-md)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};