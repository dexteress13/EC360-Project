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

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
        setMessage("Signup successful!");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch {
      setError("Server error");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Signup</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <br /><br />

        <input name="email" placeholder="Email" onChange={handleChange} required />
        <br /><br />

        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <br /><br />

        {/* 🔥 ROLE DROPDOWN */}
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="author">Author</option>
          <option value="editor">Editor</option>
          <option value="reviewer">Reviewer</option>
        </select>

        <br /><br />

        <button type="submit">Signup</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}