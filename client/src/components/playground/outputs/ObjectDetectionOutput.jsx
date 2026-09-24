import React, { useState } from "react";
import { Scan, Crosshair, Tag } from "lucide-react";

export function ObjectDetectionOutput({ result, originalImage }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const objects = result?.objects || [];
  const total = result?.totalDetected || objects.length;

  const colors = [
    { border: "border-amber-400", bg: "bg-amber-400/20", text: "text-amber-300", badgeBg: "bg-amber-400" },
    { border: "border-blue-400", bg: "bg-blue-400/20", text: "text-blue-300", badgeBg: "bg-blue-400" },
    { border: "border-emerald-400", bg: "bg-emerald-400/20", text: "text-emerald-300", badgeBg: "bg-emerald-400" },
    { border: "border-rose-400", bg: "bg-rose-400/20", text: "text-rose-300", badgeBg: "bg-rose-400" },
    { border: "border-purple-400", bg: "bg-purple-400/20", text: "text-purple-300", badgeBg: "bg-purple-400" }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Scan className="w-3.5 h-3.5 text-[#FFCE32]" />
          DETR ResNet-50 Object Detection
        </span>
        <span className="text-xs font-mono text-[#FFCE32]">
          {total} Objects Identified
        </span>
      </div>

      {/* Annotated Visual Display */}
      {originalImage && (
        <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-black/50 max-h-80 flex items-center justify-center">
          <img
            src={originalImage}
            alt="Detection Canvas"
            className="w-full h-auto max-h-80 object-contain rounded-2xl"
          />

          {/* Render Bounding Box Overlays */}
          {objects.map((obj, i) => {
            const color = colors[i % colors.length];
            const isHovered = hoveredIndex === i;

            // Normalized bounding box mock coordinate mapping
            const boxStyles = obj.box ? {
              left: `${Math.min(Math.max((obj.box.xmin / 600) * 100, 5), 80)}%`,
              top: `${Math.min(Math.max((obj.box.ymin / 600) * 100, 5), 75)}%`,
              width: `${Math.min(Math.max(((obj.box.xmax - obj.box.xmin) / 600) * 100, 15), 60)}%`,
              height: `${Math.min(Math.max(((obj.box.ymax - obj.box.ymin) / 600) * 100, 15), 60)}%`
            } : {
              left: `${15 + (i * 20) % 60}%`,
              top: `${20 + (i * 15) % 50}%`,
              width: "25%",
              height: "30%"
            };

            return (
              <div
                key={i}
                style={boxStyles}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`absolute border-2 rounded-lg transition-all cursor-pointer ${color.border} ${color.bg} ${
                  isHovered ? "ring-4 ring-white/40 scale-105 z-20" : "z-10 opacity-80"
                }`}
              >
                <span className={`absolute -top-5 left-0 text-[10px] font-bold font-mono px-1.5 py-0.2 rounded text-black ${color.badgeBg}`}>
                  {obj.label} ({(obj.score * 100).toFixed(0)}%)
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Detected Object Tag Pills */}
      <div className="space-y-2 p-4 rounded-2xl bg-[#060913]/90 border border-white/10">
        <div className="text-xs font-semibold text-slate-400 mb-2">Detected Entity Bounding Boxes</div>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
          {objects.map((obj, idx) => {
            const color = colors[idx % colors.length];
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isHovered
                    ? "bg-white/10 border-white/40 shadow-md"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${color.badgeBg}`} />
                  <span className="text-xs font-bold text-white capitalize">{obj.label}</span>
                </div>
                <span className="text-xs font-mono text-slate-300">
                  {(obj.score * 100).toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
