import searchingGif from "../assets/file-searching.gif";

export default function SearchingState({ message = "Searching papers...", description }) {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <img src={searchingGif} alt="Searching" style={styles.gif} />
        <h2 style={styles.message}>{message}</h2>
        {description && <p style={styles.description}>{description}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    backgroundColor: "var(--bg-secondary)",
    borderRadius: "var(--radius-lg)",
    padding: "var(--spacing-xl)",
  },
  content: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "var(--spacing-lg)",
  },
  gif: {
    maxWidth: "200px",
    height: "auto",
  },
  message: {
    fontSize: "20px",
    fontWeight: "600",
    color: "var(--text-primary)",
    margin: 0,
  },
  description: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    margin: 0,
    maxWidth: "400px",
  },
};
