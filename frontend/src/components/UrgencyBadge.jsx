const UrgencyBadge = ({ urgency }) => {
  const className = `urgency-badge urgency-${String(urgency || "")
    .toLowerCase()
    .replaceAll(" ", "-")}`;

  return <span className={className}>{urgency || "Medium"}</span>;
};

export default UrgencyBadge;