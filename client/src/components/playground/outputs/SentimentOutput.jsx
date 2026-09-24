import React from "react";
import { ThumbsUp, ThumbsDown, Smile, Frown, Sparkles, Activity } from "lucide-react";

export function SentimentOutput({ result }) {
  const topLabel = result?.topLabel || "POSITIVE";
  const topScore = result?.topScore || 0.99;
  const isPositive = topLabel === "POSITIVE";
  const scores = result?.scores || [
    { label: "POSITIVE", score: topScore, percentage: `${(topScore * 100).toFixed(1)}%` },
    { label: "NEGATIVE", score: 1 - topScore, percentage: `${((1 - topScore) * 100).toFixed(1)}%` }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-[#FFCE32]" />
          Sentiment Polarity Assessment
        </span>
        <span className="text-xs font-mono text-[#FFCE32]">
          Confidence: {(topScore * 100).toFixed(1)}%
        </span>
      </div>

      {/* Hero Badge */}
      <div
        className={`p-6 rounded-2xl border flex items-center gap-5 ${
          isPositive
            ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
            : "bg-rose-950/30 border-rose-500/40 text-rose-300"
        }`}
      >
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
            isPositive ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
          }`}
        >
          {isPositive ? <ThumbsUp className="w-7 h-7" /> : <ThumbsDown className="w-7 h-7" />}
        </div>
        <div>
          <div className="text-xs uppercase font-bold tracking-widest text-slate-400">
            Detected Polarity
          </div>
          <div className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>{topLabel}</span>
            <span className="text-sm font-mono font-medium opacity-80">
              ({(topScore * 100).toFixed(2)}%)
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            {isPositive
              ? "DistilBERT classified input with strong optimistic / favorable sentiment markers."
              : "DistilBERT classified input with strong critical / negative sentiment indicators."}
          </p>
        </div>
      </div>

      {/* Confidence Breakdown Bars */}
      <div className="space-y-2 p-4 rounded-2xl bg-[#060913]/90 border border-white/10">
        <div className="text-xs font-semibold text-slate-400 mb-2">Class Probability Distribution</div>
        {scores.map((s, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span>{s.label}</span>
              <span className="text-[#FFCE32]">{s.percentage || `${(s.score * 100).toFixed(1)}%`}</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden border border-white/5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  s.label === "POSITIVE"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                    : "bg-gradient-to-r from-rose-500 to-orange-400"
                }`}
                style={{ width: `${Math.max(s.score * 100, 2)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
