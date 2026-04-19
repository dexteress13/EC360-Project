import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Alert from "../components/Alert";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ManageExpertise() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const [expertiseStr, setExpertiseStr] = useState(user.expertise?.join(", ") || "");
  const [currentExpertise, setCurrentExpertise] = useState(user.expertise || []);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user.role?.toLowerCase() !== "reviewer") {
      navigate("/dashboard");
    }
    setExpertiseStr(currentExpertise.join(", "));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!expertiseStr.trim()) {
      setError("Please enter at least one expertise area");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    const expertiseArray = expertiseStr
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    try {
      const res = await fetch("http://localhost:5000/api/reviewer/expertise", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ expertise: expertiseArray }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to update expertise");
      } else {
        setMessage("✓ Expertise updated successfully!");
        // Save the complete user object returned from server
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        setCurrentExpertise(expertiseArray);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.content}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>🎓 Research Expertise</h1>
            <p style={styles.subtitle}>
              Define your research interests to receive relevant papers for review
            </p>
          </div>

          {/* Cards Section */}
          <div style={styles.cardsRow}>
            {/* Info Card */}
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>📚</div>
              <h3 style={styles.infoTitle}>Why Update Expertise?</h3>
              <p style={styles.infoText}>
                Your expertise areas help the system match you with papers that align with your research interests, ensuring you review papers you're qualified to assess.
              </p>
            </div>

            {/* Tips Card */}
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>💡</div>
              <h3 style={styles.infoTitle}>Tips</h3>
              <ul style={styles.tipsList}>
                <li>Be specific with keywords</li>
                <li>Separate topics with commas</li>
                <li>Include related areas</li>
                <li>Update regularly as interests change</li>
              </ul>
            </div>
          </div>

          {/* Main Form Card */}
          <div style={styles.formCard}>
            {/* Current Expertise */}
            {currentExpertise.length > 0 && (
              <div style={styles.currentSection}>
                <h3 style={styles.currentTitle}>📌 Current Expertise Areas</h3>
                <div style={styles.expertiseTags}>
                  {currentExpertise.map((tag, index) => (
                    <span key={index} style={styles.tag}>
                      {tag} ✓
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {message && (
              <Alert
                type="success"
                message={message}
                onClose={() => setMessage("")}
              />
            )}
            {error && (
              <Alert
                type="danger"
                message={error}
                onClose={() => setError("")}
              />
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Research Areas *</label>
                <textarea
                  style={styles.textarea}
                  value={expertiseStr}
                  onChange={(e) => setExpertiseStr(e.target.value)}
                  placeholder="e.g., machine learning, natural language processing, computer vision, deep learning, AI ethics"
                  rows="4"
                  disabled={loading}
                />
                <p style={styles.hint}>
                  💬 Separate multiple keywords with commas. Be as specific as possible for better paper matching.
                </p>
              </div>

              <button
                style={{
                  ...styles.button,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span style={styles.buttonContent}>
                    <span style={styles.spinner}>⟳</span> Updating...
                  </span>
                ) : (
                  "✓ Update Expertise"
                )}
              </button>
            </form>

            {/* Example Section */}
            <div style={styles.exampleSection}>
              <h4 style={styles.exampleTitle}>📝 Examples</h4>
              <div style={styles.exampleGrid}>
                <div style={styles.example}>
                  <span style={styles.exampleLabel}>Fine:</span>
                  <span style={styles.exampleText}>
                    ML, NLP, CV
                  </span>
                </div>
                <div style={styles.example}>
                  <span style={styles.exampleLabel}>Better:</span>
                  <span style={styles.exampleText}>
                    Convolutional Neural Networks, Transfer Learning, Image Classification, Object Detection
                  </span>
                </div>
              </div>
            </div>
          </div>
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
  content: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "var(--spacing-xl)",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: "0 0 var(--spacing-md) 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    margin: 0,
  },
  cardsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "var(--spacing-lg)",
    marginBottom: "var(--spacing-xl)",
  },
  infoCard: {
    backgroundColor: "var(--bg-primary)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--spacing-lg)",
    border: "1px solid var(--border-light)",
  },
  infoIcon: {
    fontSize: "32px",
    marginBottom: "var(--spacing-md)",
  },
  infoTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: "0 0 var(--spacing-sm) 0",
  },
  infoText: {
    fontSize: "13px",
    color: "var(--text-secondary)",
    lineHeight: "1.6",
    margin: 0,
  },
  tipsList: {
    fontSize: "13px",
    color: "var(--text-secondary)",
    paddingLeft: "20px",
    margin: "0",
    textAlign: "left",
    listStylePosition: "outside",
  },
  formCard: {
    backgroundColor: "var(--bg-primary)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border-light)",
    padding: "var(--spacing-xl)",
  },
  currentSection: {
    backgroundColor: "rgba(26, 115, 232, 0.05)",
    borderLeft: "4px solid var(--primary-600)",
    padding: "var(--spacing-lg)",
    borderRadius: "var(--radius-md)",
    marginBottom: "var(--spacing-xl)",
  },
  currentTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: "0 0 var(--spacing-md) 0",
  },
  expertiseTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "var(--spacing-md)",
  },
  tag: {
    backgroundColor: "var(--primary-600)",
    color: "white",
    padding: "var(--spacing-sm) var(--spacing-md)",
    borderRadius: "var(--radius-full)",
    fontSize: "13px",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--spacing-lg)",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--spacing-sm)",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "var(--text-primary)",
  },
  textarea: {
    padding: "var(--spacing-md)",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--radius-lg)",
    fontSize: "13px",
    color: "var(--text-primary)",
    backgroundColor: "var(--bg-primary)",
    fontFamily: "inherit",
    resize: "vertical",
    transition: "border-color var(--transition-fast)",
  },
  hint: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    margin: 0,
    fontStyle: "italic",
  },
  button: {
    padding: "var(--spacing-md)",
    backgroundColor: "var(--primary-600)",
    color: "white",
    border: "none",
    borderRadius: "var(--radius-lg)",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
    minHeight: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContent: {
    display: "flex",
    alignItems: "center",
    gap: "var(--spacing-sm)",
  },
  spinner: {
    display: "inline-block",
    animation: "spin 1s linear infinite",
  },
  exampleSection: {
    marginTop: "var(--spacing-xl)",
    paddingTop: "var(--spacing-xl)",
    borderTop: "1px solid var(--border-light)",
  },
  exampleTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "var(--text-primary)",
    margin: "0 0 var(--spacing-lg) 0",
  },
  exampleGrid: {
    display: "grid",
    gap: "var(--spacing-lg)",
  },
  example: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--spacing-sm)",
    padding: "var(--spacing-md)",
    backgroundColor: "var(--bg-secondary)",
    borderRadius: "var(--radius-md)",
  },
  exampleLabel: {
    fontSize: "12px",
    fontWeight: "700",
    color: "var(--text-secondary)",
  },
  exampleText: {
    fontSize: "13px",
    color: "var(--text-primary)",
    lineHeight: "1.5",
  },
};
