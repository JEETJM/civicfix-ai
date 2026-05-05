import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTheme } from "../context/ThemeContext";

const getMarkerColor = (markerColor) => {
  if (markerColor === "red") return "#ef4444";
  if (markerColor === "yellow") return "#f59e0b";
  return "#10b981";
};

const MapComponent = ({ markers = [] }) => {
  const { isDark } = useTheme();

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRefs = useRef([]);

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;

    if (!token || !mapContainerRef.current) return;

    mapboxgl.accessToken = token;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: isDark
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/streets-v12",
      center: [88.3639, 22.5726],
      zoom: 10,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current = [];

      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.setStyle(
      isDark
        ? "mapbox://styles/mapbox/dark-v11"
        : "mapbox://styles/mapbox/streets-v12"
    );
  }, [isDark]);

  useEffect(() => {
    if (!mapRef.current) return;

    markerRefs.current.forEach((marker) => marker.remove());
    markerRefs.current = [];

    markers.forEach((marker) => {
      if (!marker.location?.lng || !marker.location?.lat) return;

      const markerElement = document.createElement("div");
      markerElement.className = "custom-map-marker";
      markerElement.style.backgroundColor = getMarkerColor(marker.markerColor);

      const popupHtml = `
        <div class="map-popup">
          <h3>${marker.title}</h3>
          <p><b>ID:</b> ${marker.complaintId}</p>
          <p><b>Status:</b> ${marker.status}</p>
          <p><b>Urgency:</b> ${marker.urgency}</p>
          <p><b>AI Score:</b> ${marker.aiScore}/100</p>
          <p><b>Department:</b> ${marker.department}</p>
          <p><b>Address:</b> ${marker.location?.address || "N/A"}</p>
        </div>
      `;

      const mapMarker = new mapboxgl.Marker(markerElement)
        .setLngLat([marker.location.lng, marker.location.lat])
        .setPopup(new mapboxgl.Popup({ offset: 18 }).setHTML(popupHtml))
        .addTo(mapRef.current);

      markerRefs.current.push(mapMarker);
    });

    const validMarkers = markers.filter(
      (marker) => marker.location?.lng && marker.location?.lat
    );

    if (validMarkers.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();

      validMarkers.forEach((marker) => {
        bounds.extend([marker.location.lng, marker.location.lat]);
      });

      mapRef.current.fitBounds(bounds, {
        padding: 80,
        maxZoom: 13,
      });
    }
  }, [markers, isDark]);

  const token = import.meta.env.VITE_MAPBOX_TOKEN;

  if (!token) {
    return (
      <div className="map-token-missing">
        <h3>Mapbox token missing</h3>
        <p>
          Add <b>VITE_MAPBOX_TOKEN</b> in frontend/.env to show the map.
        </p>
      </div>
    );
  }

  return <div ref={mapContainerRef} className="map-container"></div>;
};

export default MapComponent;