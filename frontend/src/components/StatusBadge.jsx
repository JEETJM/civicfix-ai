const StatusBadge = ({ status }) => {
  const className = `status-badge status-${String(status || "")
    .toLowerCase()
    .replaceAll(" ", "-")}`;

  return <span className={className}>{status || "Unknown"}</span>;
};

export default StatusBadge;