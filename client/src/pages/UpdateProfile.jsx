import { useState, useEffect } from "react";

export default function UpdateProfile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [expertise, setExpertise] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentExpertise, setCurrentExpertise] = useState([]);
  const [initialized, setInitialized] = useState(false);

  // Load current expertise on mount (stable, no infinite updates)
  useEffect(() => {
    if (!user || !user.email || user.role !== "reviewer") {
      setError("You must be signed in as a reviewer to update your profile.");
      setInitialized(true);
      return;
    }

    // Fetch current reviewer data by email
    fetch(`http://localhost:5000/api/reviewer/${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'Reviewer not found') {
          // Profile not created yet, allow creating by submitting
          setCurrentExpertise([]);
          setExpertise("");
        } else {
          setCurrentExpertise(data.expertise || []);
          setExpertise((data.expertise || []).join(", "));
        }
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setInitialized(true));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Convert to array
    const expertiseArray = expertise
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    if (expertiseArray.length === 0) {
      setError("Please enter at least one expertise keyword");
      setLoading(false);
      return;
    }

    console.log("Submitting expertise:", expertiseArray);

    try {
      const res = await fetch("http://localhost:5000/api/reviewer/update-expertise", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, name: user.name, expertise: expertiseArray }),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (!res.ok) {
        setError(data.message);
      } else {
        setMessage("Profile updated successfully!");
        setCurrentExpertise(expertiseArray);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (error && !initialized) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Update Your Profile</h2>
        <p style={styles.subtitle}>Manage your expertise keywords for paper assignments</p>

        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.current}>
          <h3>Current Expertise:</h3>
          <p>{currentExpertise.join(", ") || "None"}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Expertise Keywords</label>
            <textarea
              style={styles.textarea}
              placeholder="e.g. machine learning, NLP, computer vision"
              value={expertise}
              onChange={(e) => {
                console.log('UpdateProfile onChange', e.target.value);
                setExpertise(e.target.value);
              }}
              required
            />
            <p style={styles.hint}>Separate multiple keywords with commas</p>
          </div>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "50px auto",
    padding: "20px",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
    backdropFilter: "blur(10px)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    marginBottom: "10px",
    color: "#333",
    fontSize: "28px",
    fontWeight: "800",
    textAlign: "center",
    background: "linear-gradient(45deg, #1a73e8, #1565c0)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "#666",
    marginBottom: "30px",
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "400",
  },
  success: {
    color: "#2e7d32",
    marginBottom: "20px",
    backgroundColor: "#e8f5e8",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #4caf50",
  },
  error: {
    color: "#c5221f",
    marginBottom: "20px",
    backgroundColor: "#fce8e6",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #f44336",
  },
  current: {
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
  },
  inputGroup: {
    marginBottom: "25px",
  },
  label: {
    display: "block",
    marginBottom: "10px",
    fontWeight: "700",
    color: "#333",
    fontSize: "15px",
  },
  textarea: {
    width: "100%",
    padding: "14px",
    border: "2px solid #e0e0e0",
    borderRadius: "10px",
    fontSize: "15px",
    minHeight: "120px",
    resize: "vertical",
    outline: "none",
    transition: "border-color 0.3s ease",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  hint: {
    fontSize: "13px",
    color: "#666",
    marginTop: "6px",
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
    transition: "all 0.3s ease",
    boxShadow: "0 5px 15px rgba(26, 115, 232, 0.4)",
  },
};