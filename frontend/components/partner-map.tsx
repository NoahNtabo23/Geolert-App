"use client";

import { useEffect, useRef } from "react";

interface PartnerMapProps {
  incidents: any[];
  selectedIncident: any;
  onSelectIncident: (incident: any) => void;
}

export default function PartnerMap({
  incidents,
  selectedIncident,
  onSelectIncident,
}: PartnerMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);
  const heatmapLayer = useRef<google.maps.visualization.HeatmapLayer | null>(
    null
  );

  // --- Initialize Map ---
  useEffect(() => {
    const init = () => {
      if (!window.google || !mapRef.current) {
        return setTimeout(init, 200);
      }

      map.current = new google.maps.Map(mapRef.current, {
        center: { lat: -0.5, lng: 37.0 },
        zoom: 6,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      drawMarkers();
      drawHeatmap();
    };

    init();
  }, []);

  // --- Update Map When Incidents or Selection Change ---
  useEffect(() => {
    drawMarkers();
    drawHeatmap();
  }, [incidents, selectedIncident]);

  // ---------------- MARKERS ----------------
  const drawMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach((m) => m.setMap(null));
    markers.current = [];

    incidents.forEach((incident) => {
      if (!incident.lat || !incident.lng) return;

      const marker = new google.maps.Marker({
        position: { lat: incident.lat, lng: incident.lng },
        map: map.current,
        title: incident.type,
        icon: {
          url:
            selectedIncident?.id === incident.id
              ? "/marker-selected.png" // highlight selected
              : `/marker-${incident.type}.png`,
          scaledSize: new google.maps.Size(
            selectedIncident?.id === incident.id ? 50 : 36,
            selectedIncident?.id === incident.id ? 50 : 36
          ),
        },
      });

      marker.addListener("click", () => onSelectIncident(incident));
      markers.current.push(marker);
    });
  };

  // ---------------- HEATMAP ----------------
  const drawHeatmap = () => {
    if (!map.current) return;

    const points = incidents
      .filter((r) => r.lat && r.lng)
      .map((r) => new google.maps.LatLng(r.lat, r.lng));

    if (!heatmapLayer.current) {
      heatmapLayer.current = new google.maps.visualization.HeatmapLayer({
        data: points,
        radius: 45,
      });
    } else {
      heatmapLayer.current.setData(points);
    }

    heatmapLayer.current.setMap(map.current);
  };

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-3xl overflow-hidden shadow-xl"
    />
  );
}
