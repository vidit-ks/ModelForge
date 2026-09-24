import React from "react";
import { Link } from "react-router-dom";
import { Zap, Play, Bookmark, Sparkles, Clock, Layers, ArrowUpRight, Scale } from "lucide-react";
import { motion } from "framer-motion";

export function ModelCard({ model, onRunClick, onCompareClick, isFavorite = false, onToggleFavorite }) {
  const getCategoryColor = (cat) => {
    switch (cat.toLowerCase()) {
      case "llm & reasoning":
      case "text-generation":
        return "from-amber-500/20 to-orange-500/10 text-amber-300 border-amber-500/30";
      case "vision":
        return "from-blue-500/20 to-cyan-500/10 text-cyan-300 border-cyan-500/30";
      case "multimodal":
        return "from-purple-500/20 to-pink-500/10 text-purple-300 border-purple-500/30";
      case "audio":
        return "from-emerald-500/20 to-teal-500/10 text-emerald-300 border-emerald-500/30";
      case "generation":
        return "from-rose-500/20 to-orange-500/10 text-rose-300 border-rose-500/30";
      default:
        return "from-[#1D63FF]/20 to-[#FFCE32]/10 text-blue-300 border-[#1D63FF]/30";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col justify-between p-5 rounded-3xl bg-[#0b1120]/80 hover:bg-[#10182c]/90 border border-white/10 hover:border-[#1D63FF]/40 shadow-xl hover:shadow-2xl hover:shadow-[#1D63FF]/15 transition-all glass-panel"
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border bg-gradient-to-r ${getCategoryColor(model.category)}`}>
              {model.category}
            </span>
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#FFCE32]" />
              {model.latencyAvg}
            </span>
          </div>

          <button
            onClick={() => onToggleFavorite && onToggleFavorite(model.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isFavorite
                ? "bg-[#FFCE32]/20 border-[#FFCE32]/50 text-[#FFCE32]"
                : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
            }`}
            title="Favorite Model"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? "fill-[#FFCE32]" : ""}`} />
          </button>
        </div>

        <h3 className="text-base font-bold text-white group-hover:text-[#FFCE32] transition-colors flex items-center gap-1.5">
          <span>{model.name}</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-[#FFCE32] transition-opacity" />
        </h3>

        <div className="text-xs text-[#1D63FF] font-medium mb-2 font-mono">
          {model.provider}
        </div>

        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {model.description}
        </p>
      </div>

      {/* Tags & Action Buttons */}
      <div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {model.tags?.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-400 font-mono"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="pt-3 border-t border-white/10 flex items-center gap-2">
          <Link
            to={`/playground?model=${encodeURIComponent(model.id)}`}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#1D63FF] to-[#1447b8] hover:from-[#2568ff] hover:to-[#174ec7] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-[#1D63FF]/20 transition-all cursor-pointer"
          >
            <Play className="w-3 h-3 text-[#FFCE32] fill-[#FFCE32]" />
            <span>Open Playground</span>
          </Link>

          <Link
            to={`/compare?modelA=${encodeURIComponent(model.id)}`}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors"
            title="Compare with another model"
          >
            <Scale className="w-4 h-4 text-[#FFCE32]" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
