import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || "author";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const authorCards = [
    {
      title: "Submit Paper",
      path: "/submit-paper",
    },
  ];

  const editorCards = [
    {
      title: "Create Reviewer Profile",
      path: "/reviewer-profile",
    },
    {
      title: "Assign Reviewer",
      path: "/assignment",
    },
  ];

  const reviewerCards = [
    {
      title: "My Assigned Papers",
      path: "/assignment",
    },
  ];

  const cards =
    role === "editor"
      ? editorCards
      : role === "reviewer"
      ? reviewerCards
      : authorCards;

  return (
    <div style={{ padding: "40px" }}>
      <h1>Dashboard</h1>
      <p>Welcome, {user.name || "User"} ({role})</p>

      <button onClick={handleLogout}>Logout</button>

      <div style={{ marginTop: "20px" }}>
        {cards.map((card) => (
          <div
            key={card.path}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              cursor: "pointer",
            }}
            onClick={() => navigate(card.path)}
          >
            {card.title}
          </div>
        ))}
      </div>
    </div>
  );
}