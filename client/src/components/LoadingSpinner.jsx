export default function LoadingSpinner({ size = "md", label = "Loading..." }) {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.spinner, width: sizeMap[size], height: sizeMap[size] }} />
      {label && <p style={styles.label}>{label}</p>}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--spacing-md)",
    padding: "var(--spacing-lg)",
  },
  spinner: {
    border: "3px solid rgba(26, 115, 232, 0.2)",
    borderTopColor: "var(--primary-600)",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  label: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    margin: 0,
  },
};
