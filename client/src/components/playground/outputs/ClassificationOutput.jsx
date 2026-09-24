import React from "react";
import { Eye, Award } from "lucide-react";

export function ClassificationOutput({ result }) {
  const top = result?.topPrediction || { label: "Object", score: 0.94, percentage: "94.0%" };
  const predictions = result?.predictions || [top];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-[#FFCE32]" />
          Vision Transformer Predictions (Top 5)
        </span>
        <span className="text-xs font-mono text-[#FFCE32]">
          ViT-Base 16x16 Patches
        </span>
      </div>

      {/* Top Prediction Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#1D63FF]/20 to-[#FFCE32]/15 border border-[#1D63FF]/40 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#1D63FF] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#1D63FF]/30">
          <Award className="w-6 h-6 text-[#FFCE32]" />
        </div>
        <div>
          <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
            Primary Classification
          </div>
          <div className="text-xl font-black text-white capitalize">
            {top.label}
          </div>
          <div className="text-xs text-[#FFCE32] font-mono mt-0.5">
            Confidence: {top.percentage || `${(top.score * 100).toFixed(1)}%`}
          </div>
        </div>
      </div>

      {/* Top 5 Confidence Bars */}
      <div className="space-y-3 p-4 rounded-2xl bg-[#060913]/90 border border-white/10">
        {predictions.map((p, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="capitalize font-medium">{p.label}</span>
              <span className="font-mono text-[#FFCE32]">{p.percentage || `${(p.score * 100).toFixed(1)}%`}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  idx === 0
                    ? "bg-gradient-to-r from-[#1D63FF] to-[#FFCE32]"
                    : "bg-[#1D63FF]/60"
                }`}
                style={{ width: `${Math.max(p.score * 100, 3)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
