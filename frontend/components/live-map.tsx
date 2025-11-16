"use client";

import { useEffect, useRef } from "react";

interface LiveMapProps {
  incidents: any[];
  onSelectIncident: (incident: any) => void;
  showHeatmap: boolean;
}

export default function LiveMap({ incidents, onSelectIncident, showHeatmap }: LiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);
  const heatmapLayer = useRef<google.maps.visualization.HeatmapLayer | null>(null);

  // Initialize the Google Map once
  useEffect(() => {
    const init = () => {
      if (!window.google || !mapRef.current) {
        setTimeout(init, 300);
        return;
      }

      map.current = new google.maps.Map(mapRef.current, {
        center: { lat: -1.286389, lng: 36.817223 }, // Kenya (Nairobi)
        zoom: 7,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      

      drawMarkers();
      drawHeatmap();
    };

    init();
  }, []);

  // Re-draw when incidents change or heatmap toggles
  useEffect(() => {
    drawMarkers();
    drawHeatmap();
  }, [incidents, showHeatmap]);

  // ---------- MARKERS ----------
  const drawMarkers = () => {
    if (!map.current) return;

    // Clear old markers
    markers.current.forEach((m) => m.setMap(null));
    markers.current = [];

    incidents.forEach((incident) => {
      if (!incident.lat || !incident.lng) return;

      const marker = new google.maps.Marker({
        position: { lat: incident.lat, lng: incident.lng },
        map: map.current,
        title: incident.type,
        icon: {
          url: `/marker-${incident.type}.png`, // Optional custom icons
          scaledSize: new google.maps.Size(40, 40),
        },
      });

      marker.addListener("click", () => onSelectIncident(incident));
      markers.current.push(marker);
    });
  };

  // ---------- HEATMAP ----------
  const drawHeatmap = () => {
    if (!map.current || !window.google) return;

    const points = incidents
      .filter((i) => i.lat && i.lng)
      .map((i) => new google.maps.LatLng(i.lat, i.lng));

    if (!heatmapLayer.current) {
      heatmapLayer.current = new google.maps.visualization.HeatmapLayer({
        data: points,
        radius: 45,
      });
    } else {
      heatmapLayer.current.setData(points);
    }

    heatmapLayer.current.setMap(showHeatmap ? map.current : null);
  };

  return (
    <div
      ref={mapRef}
      className="w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl"
    />
  );
}
