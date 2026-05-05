const HeatmapLegend = () => {
  return (
    <div className="heatmap-legend">
      <h3>Heatmap Legend</h3>

      <div className="legend-row">
        <span className="legend-dot red-dot"></span>
        <div>
          <strong>Red Zone</strong>
          <p>High complaints or critical pending issues</p>
        </div>
      </div>

      <div className="legend-row">
        <span className="legend-dot yellow-dot"></span>
        <div>
          <strong>Yellow Zone</strong>
          <p>Medium complaint density</p>
        </div>
      </div>

      <div className="legend-row">
        <span className="legend-dot green-dot"></span>
        <div>
          <strong>Green Zone</strong>
          <p>Resolved or low complaint density</p>
        </div>
      </div>
    </div>
  );
};

export default HeatmapLegend;