import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, MapPinned, RefreshCw, Search } from "lucide-react";
import { getPublicHeatmapData } from "../services/heatmapService";
import MapComponent from "../components/MapComponent";
import HeatmapLegend from "../components/HeatmapLegend";
import Loader from "../components/Loader";
import StatusBadge from "../components/StatusBadge";
import UrgencyBadge from "../components/UrgencyBadge";

const MapView = () => {
  const [zones, setZones] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");

  const fetchHeatmap = async () => {
    setLoading(true);

    try {
      const data = await getPublicHeatmapData();
      setZones(data.zones || []);
      setMarkers(data.markers || []);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatmap();
  }, []);

  const filteredMarkers = useMemo(() => {
    return markers.filter((marker) => {
      const text = `${marker.title} ${marker.category} ${marker.status} ${marker.department} ${marker.location?.address}`.toLowerCase();

      const matchesKeyword = text.includes(keyword.toLowerCase());
      const matchesUrgency = urgencyFilter
        ? marker.urgency === urgencyFilter
        : true;

      return matchesKeyword && matchesUrgency;
    });
  }, [markers, keyword, urgencyFilter]);

  const redZones = zones.filter((zone) => zone.heatLevel === "Red").length;
  const yellowZones = zones.filter((zone) => zone.heatLevel === "Yellow").length;
  const greenZones = zones.filter((zone) => zone.heatLevel === "Green").length;

  if (loading) {
    return <Loader text="Loading public heatmap..." />;
  }

  return (
    <main className="map-page">
      <section className="map-header">
        <div>
          <span>Public Civic Heatmap</span>
          <h1>Live Civic Issue Map</h1>
          <p>
            Explore complaint hotspots, urgency markers, and area-wise civic
            issue zones.
          </p>
        </div>

        <button className="secondary-action-btn" onClick={fetchHeatmap}>
          <RefreshCw size={18} />
          Refresh
        </button>
      </section>

      <section className="map-summary-grid">
        <div className="map-summary-card red-zone-card">
          <strong>{redZones}</strong>
          <span>Red Zones</span>
        </div>

        <div className="map-summary-card yellow-zone-card">
          <strong>{yellowZones}</strong>
          <span>Yellow Zones</span>
        </div>

        <div className="map-summary-card green-zone-card">
          <strong>{greenZones}</strong>
          <span>Green Zones</span>
        </div>

        <div className="map-summary-card">
          <strong>{markers.length}</strong>
          <span>Total Markers</span>
        </div>
      </section>

      <section className="map-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by title, category, area..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>

        <select
          value={urgencyFilter}
          onChange={(event) => setUrgencyFilter(event.target.value)}
        >
          <option value="">All Urgency</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </section>

      <section className="map-layout">
        <div className="map-card">
          <MapComponent markers={filteredMarkers} />
        </div>

        <aside className="map-side">
          <HeatmapLegend />

          <div className="zone-list-card">
            <h3>Area Zones</h3>

            {zones.length === 0 ? (
              <div className="zone-empty">
                <AlertTriangle size={24} />
                <p>No zone data yet. Submit complaints with location.</p>
              </div>
            ) : (
              <div className="zone-list">
                {zones.slice(0, 8).map((zone) => (
                  <div className="zone-item" key={`${zone.zoneName}-${zone.area}`}>
                    <div>
                      <h4>{zone.zoneName}</h4>
                      <p>{zone.area}</p>
                    </div>

                    <span className={`zone-pill zone-${zone.heatLevel.toLowerCase()}`}>
                      {zone.heatLevel}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </section>

      <section className="marker-list-section">
        <h2>
          <MapPinned size={24} />
          Complaint Markers
        </h2>

        {filteredMarkers.length === 0 ? (
          <p className="marker-empty">No markers found.</p>
        ) : (
          <div className="marker-list-grid">
            {filteredMarkers.slice(0, 12).map((marker) => (
              <div className="marker-card" key={marker.id}>
                <span className="complaint-id">{marker.complaintId}</span>
                <h3>{marker.title}</h3>

                <div className="marker-badges">
                  <UrgencyBadge urgency={marker.urgency} />
                  <StatusBadge status={marker.status} />
                </div>

                <p>{marker.location?.address}</p>
                <small>{marker.department}</small>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default MapView;