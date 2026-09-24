import React, { useState } from "react";
import { Network, Copy, Check, Binary, Cpu } from "lucide-react";
import { useToast } from "../../common/Toast";

export function EmbeddingsOutput({ result }) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const vector = result?.vector || [];
  const dims = result?.dimensions || 384;
  const sampleHead = result?.sampleHead || vector.slice(0, 8);

  const handleCopyVector = () => {
    navigator.clipboard.writeText(JSON.stringify(vector));
    setCopied(true);
    addToast("384-dim vector array copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Network className="w-3.5 h-3.5 text-[#FFCE32]" />
            Dense Vector Coordinate Space
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1D63FF]/20 text-[#1D63FF] border border-[#1D63FF]/30 font-mono">
            {dims} Dimensions
          </span>
        </div>

        <button
          onClick={handleCopyVector}
          className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs border border-white/10 transition-colors font-mono"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy Vector"}</span>
        </button>
      </div>

      {/* Vector Heatmap Visualizer */}
      <div className="p-4 rounded-2xl bg-[#060913]/90 border border-white/15 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono">Dimensional Heatmap Preview (64 cells)</span>
          {hoveredIndex !== null && (
            <span className="text-[#FFCE32] font-mono">
              dim[{hoveredIndex}]: {vector[hoveredIndex]}
            </span>
          )}
        </div>

        <div className="grid grid-cols-16 sm:grid-cols-16 gap-1 bg-black/50 p-3 rounded-xl border border-white/5">
          {vector.slice(0, 64).map((val, idx) => {
            const intensity = Math.min(Math.max((val + 1) / 2, 0), 1);
            const isPos = val >= 0;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  backgroundColor: isPos
                    ? `rgba(29, 99, 255, ${Math.max(intensity, 0.2)})`
                    : `rgba(255, 206, 50, ${Math.max(1 - intensity, 0.2)})`
                }}
                className="h-4 rounded-xs transition-all hover:scale-125 hover:z-10 cursor-pointer"
                title={`Dim ${idx}: ${val}`}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#FFCE32]" />
            <span>Negative values</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#1D63FF]" />
            <span>Positive values</span>
          </div>
        </div>
      </div>

      {/* Sample Coordinate Values */}
      <div className="p-4 rounded-2xl bg-[#060913]/90 border border-white/10 space-y-2">
        <div className="text-xs font-semibold text-slate-400 font-mono">Coordinates [0..7]:</div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {sampleHead.map((v, i) => (
            <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/5 text-center">
              <div className="text-[9px] text-slate-500 font-mono">d[{i}]</div>
              <div className="text-xs font-bold font-mono text-slate-200">
                {typeof v === "number" ? v.toFixed(3) : v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
