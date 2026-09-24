import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FlaskConical, Layers, History, Code2, Scale, Terminal, Zap, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CommandPalette({ isOpen, onClose, models = [] }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose(prev => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredModels = models.filter(m =>
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.task.toLowerCase().includes(query.toLowerCase()) ||
    m.category.toLowerCase().includes(query.toLowerCase())
  );

  const quickNav = [
    { label: "AI Playground", path: "/playground", icon: FlaskConical, desc: "Run prompts and models interactively" },
    { label: "Model Comparison Arena", path: "/compare", icon: Scale, desc: "Benchmark 2+ models on same input" },
    { label: "Visual Workflow Graph", path: "/workflows", icon: Layers, desc: "Chain models in a visual node pipeline" },
    { label: "Experiment History", path: "/experiments", icon: History, desc: "View telemetry logs and outputs" },
    { label: "API Code Generator", path: "/api-docs", icon: Code2, desc: "Export Python, JS & cURL snippets" },
    { label: "Model Catalog", path: "/models", icon: Terminal, desc: "Explore 10 Hugging Face architectures" }
  ].filter(item => item.label.toLowerCase().includes(query.toLowerCase()) || item.desc.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (path) => {
    navigate(path);
    onClose(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="w-full max-w-2xl bg-[#0b1120] border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass-panel"
        >
          {/* Search Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
            <Search className="w-5 h-5 text-[#FFCE32]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a model (e.g. 'FLUX', 'Whisper', 'GPT-OSS') or command..."
              autoFocus
              className="flex-1 bg-transparent border-none text-white text-base focus:outline-none placeholder-slate-500"
            />
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-md border border-white/10">
              <kbd>ESC</kbd>
            </div>
            <button onClick={() => onClose(false)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results List */}
          <div className="max-h-96 overflow-y-auto p-3 space-y-4">
            {/* Quick Navigation */}
            {quickNav.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
                  Platform Destinations
                </div>
                <div className="space-y-1">
                  {quickNav.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleSelect(item.path)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-white/5 hover:border hover:border-white/10 text-slate-200 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-[#1D63FF]/20 text-[#1D63FF] group-hover:bg-[#1D63FF] group-hover:text-white transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold group-hover:text-white">{item.label}</div>
                            <div className="text-xs text-slate-400">{item.desc}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AI Models */}
            {filteredModels.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
                  AI Model Pipelines ({filteredModels.length})
                </div>
                <div className="space-y-1">
                  {filteredModels.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleSelect(`/playground?model=${encodeURIComponent(m.id)}`)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left hover:bg-white/5 hover:border hover:border-[#1D63FF]/30 text-slate-200 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#FFCE32]/10 text-[#FFCE32] group-hover:bg-[#FFCE32] group-hover:text-black transition-colors">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold flex items-center gap-2">
                            <span>{m.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono">
                              {m.task}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 truncate max-w-md">{m.description}</div>
                        </div>
                      </div>
                      <span className="text-xs text-[#1D63FF] font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Launch <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {quickNav.length === 0 && filteredModels.length === 0 && (
              <div className="py-12 text-center text-slate-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#FFCE32]" />
                <p className="text-sm">No models or commands matching "{query}"</p>
              </div>
            )}
          </div>

          <div className="px-4 py-2 bg-black/40 border-t border-white/5 text-xs text-slate-500 flex items-center justify-between">
            <span>Tip: Use <kbd className="px-1.5 py-0.5 bg-white/10 rounded">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-white/10 rounded">K</kbd> anywhere to open</span>
            <span className="text-[#FFCE32] font-mono">ModelForge v1.0</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
