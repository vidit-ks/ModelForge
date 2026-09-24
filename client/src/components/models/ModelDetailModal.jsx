import React from "react";
import { X, Cpu, Clock, Layers, ArrowRight, Play, ExternalLink, CheckCircle2, Sliders, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ModelDetailModal({ model, isOpen, onClose, onTryModel }) {
  if (!isOpen || !model) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-2xl bg-[#0b1120] border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 relative overflow-hidden glass-panel max-h-[90vh] flex flex-col"
        >
          {/* Top Decorative Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-[#1D63FF] via-[#FFCE32] to-[#1D63FF] rounded-full" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#1D63FF]/30 to-[#FFCE32]/20 border border-[#FFCE32]/30 text-[#FFCE32] shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold font-mono px-2.5 py-0.5 rounded-full bg-[#1D63FF]/20 text-[#1D63FF] border border-[#1D63FF]/30">
                  {model.category}
                </span>
                <span className="text-xs font-mono text-[#FFCE32]">
                  Avg: {model.latencyAvg}
                </span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">{model.name}</h2>
              <div className="text-xs text-slate-400 font-mono mt-0.5">{model.id} • {model.provider}</div>
            </div>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto space-y-5 pr-1 font-sans text-xs text-slate-300">
            {/* Description */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 leading-relaxed text-sm text-slate-200">
              {model.description}
            </div>

            {/* Spec Matrix Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] font-mono uppercase text-slate-400">Task Type</div>
                <div className="text-xs font-bold text-white mt-0.5 font-mono">{model.task}</div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] font-mono uppercase text-slate-400">Input Modality</div>
                <div className="text-xs font-bold text-white mt-0.5 capitalize">{model.inputType}</div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] font-mono uppercase text-slate-400">Output Modality</div>
                <div className="text-xs font-bold text-white mt-0.5 capitalize">{model.outputType}</div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                <div className="text-[10px] font-mono uppercase text-slate-400">Context Window</div>
                <div className="text-xs font-bold text-[#FFCE32] mt-0.5 font-mono">{model.contextLength || "Standard"}</div>
              </div>
            </div>

            {/* Tags */}
            {model.tags && (
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase font-mono mb-2">Capabilities & Tags</div>
                <div className="flex flex-wrap gap-1.5">
                  {model.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs py-1 px-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sample Prompts */}
            {model.sampleInputs && model.sampleInputs.length > 0 && (
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase font-mono mb-2">Sample Evaluation Presets</div>
                <div className="space-y-2">
                  {model.sampleInputs.map((sample, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="text-xs font-bold text-white mb-1">{sample.title || `Preset ${idx + 1}`}</div>
                      <div className="text-xs text-slate-300 font-mono italic">
                        "{sample.prompt || sample.imageUrl || "Media Preset"}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              Close
            </button>

            <button
              onClick={() => {
                onClose();
                if (onTryModel) onTryModel(model.id);
              }}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#1D63FF] to-[#1447b8] hover:from-[#2568ff] hover:to-[#174ec7] text-white text-xs font-bold shadow-lg shadow-[#1D63FF]/30 transition-all flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 text-[#FFCE32] fill-[#FFCE32]" />
              <span>Load In Playground</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
