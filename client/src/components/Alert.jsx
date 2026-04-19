export default function Alert({ type = "info", message, onClose }) {
  const typeMap = {
    success: { icon: "✓", className: "alert-success" },
    danger: { icon: "✕", className: "alert-danger" },
    warning: { icon: "⚠", className: "alert-warning" },
    info: { icon: "ℹ", className: "alert-info" },
  };

  const { icon, className } = typeMap[type];

  return (
    <div style={styles.alert} className={className}>
      <span style={styles.icon}>{icon}</span>
      <span style={styles.message}>{message}</span>
      {onClose && (
        <button style={styles.closeBtn} onClick={onClose} aria-label="Close alert">
          ✕
        </button>
      )}
    </div>
  );
}

const styles = {
  alert: {
    padding: "var(--spacing-md)",
    borderRadius: "var(--radius-lg)",
    display: "flex",
    alignItems: "center",
    gap: "var(--spacing-md)",
    marginBottom: "var(--spacing-lg)",
    animation: "slideInDown var(--transition-fast)",
  },
  icon: {
    fontSize: "18px",
    fontWeight: "bold",
    flexShrink: 0,
  },
  message: {
    fontSize: "14px",
    flex: 1,
  },
  closeBtn: {
    backgroundColor: "transparent",
    border: "none",
    color: "inherit",
    cursor: "pointer",
    fontSize: "16px",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
