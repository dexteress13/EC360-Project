import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    if (user.role !== "reviewer") {
      navigate("/dashboard");
    }
    setExpertiseStr(currentExpertise.join(", "));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        setError(data.message);
      } else {
        setMessage("Expertise updated successfully!");
        localStorage.setItem("user", JSON.stringify({ ...user, expertise: expertiseArray }));
        setCurrentExpertise(expertiseArray);
        setExpertiseStr(expertiseArray.join(", "));
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
        <h2 style={styles.title}>Manage Expertise</h2>
        <p style={styles.subtitle}>Update your research areas ({user.name})</p>
        


        {currentExpertise.length > 0 && (
          <div style={styles.currentSection}>
            <h4 style={styles.currentTitle}>Current Expertise:</h4>
            <div style={styles.expertiseTags}>
              {currentExpertise.map((tag, index) => (
                <span key={index} style={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
        )}

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Update Expertise Keywords</label>
            <input
              style={styles.input}
              type="text"
              value={expertiseStr}
              onChange={(e) => setExpertiseStr(e.target.value)}
              placeholder="e.g. machine learning, NLP, computer vision"
              required
              disabled={loading}
            />
            <p style={styles.hint}>Separate multiple keywords with commas</p>
          </div>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Expertise"}
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
    padding: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "500px",
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
  backButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    marginBottom: "24px",
    cursor: "pointer",
  },
  currentSection: {
    backgroundColor: "#f0f8ff",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "24px",
  },
  currentTitle: {
    margin: "0 0 12px 0",
    color: "#1a73e8",
    fontSize: "16px",
  },
  expertiseTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  tag: {
    backgroundColor: "#1a73e8",
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "13px",
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
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  hint: {
    fontSize: "12px",
    color: "#999",
    marginTop: "6px",
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
  },
  success: {
    backgroundColor: "#e6f4ea",
    color: "#2d7a3a",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "16px",
  },
  error: {
    backgroundColor: "#fce8e6",
    color: "#c5221f",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "16px",
  },
};
