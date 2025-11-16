"use client"

import type React from "react"

interface IncidentFeedProps {
  reports: any[]
}

export default function IncidentFeed({ reports }: IncidentFeedProps) {
  const getIncidentIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      "power-outage": (
        // Lightning bolt icon for power outages
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      fire: (
        // Flame icon for fire incidents
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 18.657L17.657 9.343a4 4 0 00-5.656-5.656l-.707.707a2 2 0 11-2.828-2.829l.707-.707a6 6 0 018.485 8.485l-8.485 8.485a2 2 0 11-2.829-2.829l.707-.707a4 4 0 015.656 5.656l-9.9 9.9"
          />
        </svg>
      ),
      flood: (
        // Water droplet icon for flood incidents
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      ),
      drought: (
        // Sun icon for drought incidents
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    }
    return icons[type] || null
  }

  const getIncidentColor = (type: string) => {
    const colors: Record<string, string> = {
      "power-outage": "from-yellow-400 to-orange-500",
      fire: "from-red-400 to-red-600",
      flood: "from-blue-400 to-blue-600",
      drought: "from-amber-400 to-amber-600",
    }
    return colors[type] || "from-primary to-accent"
  }

  return (
    // Premium incident feed container with glass effect
    <div className="glass-effect-strong rounded-2xl border border-white/20 overflow-hidden shadow-lg animate-scale-in hover-lift">
      {/* Header section with icon and title */}
      <div className="glass-effect p-5 border-b border-white/10">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-3">
          {/* Bolt icon for incidents */}
          <div className="p-2 rounded-lg bg-primary/20 text-primary">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          Recent Reports ({reports.length})
        </h2>
      </div>

      {/* Feed content - scrollable list of incident reports */}
      <div className="max-h-96 overflow-y-auto">
        {reports.length === 0 ? (
          // Empty state when no reports exist
          <div className="p-8 text-center animate-fade-in">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted/50 flex items-center justify-center">
              <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-muted-foreground font-medium">No reports yet</p>
            <p className="text-xs text-muted-foreground mt-1">Be the first to report an incident</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
             {[...reports]
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((report, index)=> (
              <div
                key={report.id}
                className={`p-4 hover:bg-white/5 transition-all duration-300 cursor-pointer animate-slide-up-fade ${
                  index === 0
                    ? "animate-stagger-1"
                    : index === 1
                      ? "animate-stagger-2"
                      : index === 2
                        ? "animate-stagger-3"
                        : "animate-stagger-4"
                }`}
              >
                {/* Icon and main content container */}
                <div className="flex items-start gap-4 mb-3">
                  {/* Icon with color background - gradient based on incident type */}
                  <div
                    className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${getIncidentColor(
                      report.type,
                    )} text-white shadow-md`}
                  >
                    {getIncidentIcon(report.type)}
                  </div>

                  {/* Report details */}
                  <div className="flex-1 min-w-0">
                    {/* Title and severity badge row */}
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground capitalize text-sm">
                        {report.type ? report.type.replace("-", " ") : "Unknown"}

                      </h3>
                      {/* Severity badge with dynamic coloring */}
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold transform animate-soft-glow
                          ${
                            report.severity === "critical"
                              ? "bg-red-500/20 text-red-600 dark:text-red-400"
                              : report.severity === "high"
                                ? "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                                : report.severity === "medium"
                                  ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                                  : "bg-green-500/20 text-green-600 dark:text-green-400"
                          }
                        `}
                      >
                        {report.severity}
                      </span>
                    </div>

                    {/* Location with icon */}
                    <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {report.location}
                    </p>
                  </div>
                </div>

                {/* Description preview if available */}
                {report.description && (
                  <p className="text-sm text-foreground/75 mb-2 line-clamp-2 ml-14">{report.description}</p>
                )}

                {/* Timestamp with icon */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground ml-14">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {report.timestamp}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
