"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
  MapPin,
  Zap,
  Flame,
  CloudRain,
  Sun,
  PlusIcon,
  MinusIcon,
  LayersIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const icons = {
  "power-outage": <Zap className="w-4 h-4" />,
  fire: <Flame className="w-4 h-4" />,
  flood: <CloudRain className="w-4 h-4" />,
  drought: <Sun className="w-4 h-4" />,
};

const getIncidentIcon = (type: string): React.ReactNode =>
  icons[type as keyof typeof icons] ?? <MapPin className="w-4 h-4" />;

export default function MiniMap({ reports }: { reports: any[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markers = useRef<google.maps.Marker[]>([]);
  const heatmapLayer = useRef<google.maps.visualization.HeatmapLayer | null>(null);

  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);

  // UseMemo ensures dynamic updates when new reports arrive
  const miniReports = useMemo(
    () => reports.filter((r) => r.lat && r.lng).slice(0, 10),
    [reports]
  );

  // ---------------- INITIALIZE MAP ----------------
  useEffect(() => {
    const initMap = () => {
      if (!window.google || !mapRef.current) {
        return setTimeout(initMap, 200);
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

    initMap();
  }, []);

  // ---------------- UPDATE VISUALS ----------------
  useEffect(() => {
    drawMarkers();
    drawHeatmap();
  }, [miniReports, showHeatmap, showMarkers]);

  // ---------------- MARKERS ----------------
  const drawMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach((m) => m.setMap(null));
    markers.current = [];

    if (!showMarkers) return;

    miniReports.forEach((report) => {
      const marker = new google.maps.Marker({
        position: { lat: report.lat, lng: report.lng },
        map: map.current!,
        title: report.type,
        icon: {
          url: `/marker-${report.type}.png`,
          scaledSize: new google.maps.Size(28, 28),
        },
      });

      markers.current.push(marker);
    });
  };

  // ---------------- HEATMAP ----------------
  const drawHeatmap = () => {
    if (!map.current) return;

    const heatPoints = miniReports.map((r) => new google.maps.LatLng(r.lat, r.lng));

    if (!heatmapLayer.current) {
      heatmapLayer.current = new google.maps.visualization.HeatmapLayer({
        data: heatPoints,
        radius: 45,
      });
    } else {
      heatmapLayer.current.setData(heatPoints);
    }

    heatmapLayer.current.setMap(showHeatmap ? map.current : null);
  };

  return (
    <div className="glass-effect-strong rounded-3xl overflow-hidden shadow-lg h-full min-h-[500px] relative">
      {/* Header */}
      <div className="glass-effect p-5 border-b border-white/10">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-3">
          <MapPin className="w-5 h-5 text-primary" />
          Live Report Overview
        </h2>
      </div>

      {/* Google Map */}
      <div ref={mapRef} className="w-full h-full min-h-[450px]" />

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <button className="glass-effect p-2.5 rounded-lg hover:bg-white/20 transition-all">
          <PlusIcon className="w-5 h-5" />
        </button>

        <button className="glass-effect p-2.5 rounded-lg hover:bg-white/20 transition-all">
          <MinusIcon className="w-5 h-5" />
        </button>

        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={cn(
            "glass-effect p-2.5 rounded-lg transition-all",
            !showHeatmap && "opacity-50"
          )}
        >
          <LayersIcon className="w-5 h-5" />
        </button>

        <button
          onClick={() => setShowMarkers(!showMarkers)}
          className="glass-effect p-2.5 rounded-lg hover:bg-white/20 transition-all"
        >
          {showMarkers ? <EyeIcon className="w-5 h-5" /> : <EyeOffIcon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
