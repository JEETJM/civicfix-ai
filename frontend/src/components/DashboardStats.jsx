const DashboardStats = ({ stats = [] }) => {
  return (
    <div className="dashboard-stats-grid">
      {stats.map((item) => (
        <div className="dashboard-stat-card" key={item.label}>
          <div className="stat-icon">{item.icon}</div>
          <div>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;