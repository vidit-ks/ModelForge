import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  History, 
  Search, 
  Bookmark, 
  Play, 
  Trash2, 
  Download, 
  Eye, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Filter,
  FileJson
} from "lucide-react";
import { fetchExperiments, deleteExperiment, toggleFavoriteExperiment } from "../services/api";
import { useToast } from "../components/common/Toast";

export function ExperimentHistoryPage() {
  const { addToast } = useToast();
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTask, setSelectedTask] = useState("All");
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [activeModalExp, setActiveModalExp] = useState(null);

  const loadExperiments = async () => {
    setLoading(true);
    try {
      const res = await fetchExperiments({
        search,
        task: selectedTask !== "All" ? selectedTask : undefined,
        favoriteOnly: favoriteOnly ? "true" : undefined
      });
      setExperiments(res.experiments || []);
    } catch (err) {
      console.warn("Failed to load experiments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiments();
  }, [search, selectedTask, favoriteOnly]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteExperiment(id);
      setExperiments(prev => prev.filter(x => x.id !== id));
      addToast("Experiment deleted from ledger", "info");
    } catch (err) {
      addToast(err.message || "Failed to delete", "error");
    }
  };

  const handleToggleFavorite = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await toggleFavoriteExperiment(id);
      setExperiments(prev => prev.map(x => x.id === id ? { ...x, isFavorite: res.experiment.isFavorite } : x));
      addToast(res.experiment.isFavorite ? "Marked as favorite" : "Removed from favorites", "info");
    } catch (err) {
      addToast(err.message || "Failed to update favorite", "error");
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(experiments, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `modelforge-experiments-${Date.now()}.json`;
    a.click();
    addToast("Exported experiments to JSON", "success");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFCE32] uppercase tracking-wider mb-1">
            <History className="w-3.5 h-3.5" />
            Telemetry Ledger & Audit Log
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Experiment History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Detailed chronological record of model inferences, input payloads, outputs, and execution latencies.
          </p>
        </div>

        <button
          onClick={handleExportJSON}
          className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold transition-all hover:scale-[1.02]"
        >
          <Download className="w-4 h-4 text-[#1D63FF]" />
          <span>Export JSON</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0b1120] border border-white/10 glass-panel flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search experiments by keyword or model..."
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setFavoriteOnly(!favoriteOnly)}
            className={`flex items-center gap-1.5 py-2 px-3.5 rounded-xl border text-xs font-medium transition-all ${
              favoriteOnly
                ? "bg-[#FFCE32]/20 border-[#FFCE32]/50 text-[#FFCE32]"
                : "bg-white/5 border-white/10 text-slate-300 hover:text-white"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${favoriteOnly ? "fill-[#FFCE32]" : ""}`} />
            <span>Favorites</span>
          </button>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {experiments.map((exp) => {
          const promptPreview = exp.inputData?.prompt || exp.inputData?.imageUrl || "Media Input Stream";
          const outputPreview = exp.outputData?.text || exp.outputData?.summaryText || exp.outputData?.translatedText || exp.outputData?.topLabel || JSON.stringify(exp.outputData);

          return (
            <div
              key={exp.id}
              onClick={() => setActiveModalExp(exp)}
              className="p-5 rounded-3xl bg-[#0b1120]/80 hover:bg-[#10182c] border border-white/10 hover:border-[#1D63FF]/40 transition-all glass-panel cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group shadow-lg"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-bold text-white group-hover:text-[#FFCE32] transition-colors">
                    {exp.modelName || exp.modelId}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1D63FF]/20 text-[#1D63FF] border border-[#1D63FF]/30">
                    {exp.task}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {exp.executionTimeMs}ms
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(exp.createdAt).toLocaleDateString()} {new Date(exp.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                <div className="text-xs text-slate-300 line-clamp-1 italic font-mono bg-black/30 p-2 rounded-lg border border-white/5">
                  Input: {promptPreview}
                </div>

                <div className="text-xs text-slate-400 line-clamp-1">
                  Output: {outputPreview}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => handleToggleFavorite(exp.id, e)}
                  className={`p-2 rounded-xl border transition-colors ${
                    exp.isFavorite
                      ? "bg-[#FFCE32]/20 border-[#FFCE32]/50 text-[#FFCE32]"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  }`}
                  title="Bookmark"
                >
                  <Bookmark className={`w-4 h-4 ${exp.isFavorite ? "fill-[#FFCE32]" : ""}`} />
                </button>

                <Link
                  to={`/playground?model=${encodeURIComponent(exp.modelId)}`}
                  onClick={(e) => e.stopPropagation()}
                  className="py-2 px-3 rounded-xl bg-[#1D63FF] hover:bg-[#2568ff] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Re-run</span>
                </Link>

                <button
                  onClick={(e) => handleDelete(exp.id, e)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-300 border border-white/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {experiments.length === 0 && !loading && (
          <div className="p-16 rounded-3xl bg-[#0b1120]/50 border border-white/10 text-center space-y-2">
            <History className="w-10 h-10 text-slate-500 mx-auto" />
            <div className="text-base font-bold text-white">No experiments found</div>
            <p className="text-xs text-slate-400">Run any model in the Playground to record telemetry.</p>
          </div>
        )}
      </div>

      {/* Inspect Payload Modal */}
      {activeModalExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#0b1120] border border-white/15 rounded-3xl shadow-2xl p-6 relative overflow-hidden glass-panel max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white">{activeModalExp.modelName}</h3>
                <span className="text-xs font-mono text-[#FFCE32]">{activeModalExp.task} • {activeModalExp.executionTimeMs}ms</span>
              </div>
              <button onClick={() => setActiveModalExp(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 font-mono text-xs text-slate-200">
              <div>
                <div className="text-[11px] font-bold text-[#1D63FF] uppercase mb-1">Input Payload:</div>
                <pre className="p-3 bg-black/60 rounded-xl border border-white/10 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(activeModalExp.inputData, null, 2)}
                </pre>
              </div>

              <div>
                <div className="text-[11px] font-bold text-emerald-400 uppercase mb-1">Synthesis Output:</div>
                <pre className="p-3 bg-black/60 rounded-xl border border-white/10 overflow-x-auto whitespace-pre-wrap text-slate-100">
                  {JSON.stringify(activeModalExp.outputData, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <Link
                to={`/playground?model=${encodeURIComponent(activeModalExp.modelId)}`}
                className="py-2 px-4 rounded-xl bg-[#1D63FF] text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch in Playground</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
