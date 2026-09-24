import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Scale, Play, Clock, Sparkles, Plus, Trash2, Cpu, CheckCircle2, ArrowRight, Terminal } from "lucide-react";
import { compareModels } from "../services/api";
import { useToast } from "../components/common/Toast";

export function ComparePage({ models = [], defaultModelA = null, defaultModelB = null }) {
  const { addToast } = useToast();

  const initialModelA = defaultModelA || models[0]?.id || "openai/gpt-oss-120b";
  const initialModelB = defaultModelB || models[3]?.id || "facebook/bart-large-cnn";

  const [selectedModelIds, setSelectedModelIds] = useState([initialModelA, initialModelB]);
  const [sharedPrompt, setSharedPrompt] = useState(
    "Quantum computing paradigms leverage superposition and entanglement to execute combinatorial optimization benchmarks at unprecedented speeds. As neural architectures integrate distributed vector memory, real-time telemetry processing achieves exponential gains."
  );
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleAddModel = () => {
    if (selectedModelIds.length >= 3) {
      addToast("Comparison arena supports up to 3 concurrent models", "info");
      return;
    }
    const available = models.find(m => !selectedModelIds.includes(m.id));
    if (available) {
      setSelectedModelIds(prev => [...prev, available.id]);
    }
  };

  const handleRemoveModel = (idx) => {
    if (selectedModelIds.length <= 2) {
      addToast("Arena requires at least 2 models for benchmarking", "info");
      return;
    }
    setSelectedModelIds(prev => prev.filter((_, i) => i !== idx));
  };

  const handleModelSelect = (idx, newId) => {
    setSelectedModelIds(prev => {
      const next = [...prev];
      next[idx] = newId;
      return next;
    });
  };

  const handleRunComparison = async () => {
    setLoading(true);
    setResults(null);
    try {
      const benchmarkData = await compareModels(selectedModelIds, { prompt: sharedPrompt });
      setResults(benchmarkData.results || []);
      addToast(`Completed parallel benchmark across ${selectedModelIds.length} models!`, "success");
    } catch (err) {
      console.error(err);
      addToast(err.message || "Benchmark execution failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#FFCE32] uppercase tracking-wider mb-1">
          <Scale className="w-3.5 h-3.5" />
          Model Benchmark & Side-by-Side Arena
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Multi-Model Comparison
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Evaluate concurrent model outputs, response fidelity, and execution latency side-by-side using unified input vectors.
        </p>
      </div>

      {/* Arena Setup Card */}
      <div className="p-6 rounded-3xl bg-[#0b1120] border border-white/10 glass-panel space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#1D63FF]" />
            Select Competing Model Pipelines ({selectedModelIds.length}/3)
          </div>

          {selectedModelIds.length < 3 && (
            <button
              onClick={handleAddModel}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#FFCE32] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add 3rd Model Slot</span>
            </button>
          )}
        </div>

        {/* Model Selectors in Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-${selectedModelIds.length} gap-4`}>
          {selectedModelIds.map((modelId, idx) => {
            const current = models.find(m => m.id === modelId) || models[0];
            return (
              <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 relative">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="font-bold text-[#FFCE32]">SLOT {String.fromCharCode(65 + idx)}</span>
                  {selectedModelIds.length > 2 && (
                    <button
                      onClick={() => handleRemoveModel(idx)}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Remove Slot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  value={modelId}
                  onChange={(e) => handleModelSelect(idx, e.target.value)}
                  className="w-full py-2 px-3 rounded-xl glass-input text-xs font-bold text-white bg-[#0b1120]"
                >
                  {models.map(m => (
                    <option key={m.id} value={m.id} className="bg-[#0b1120] text-white">
                      {m.name} ({m.task})
                    </option>
                  ))}
                </select>

                <div className="text-[11px] text-slate-400 truncate">{current?.description}</div>
              </div>
            );
          })}
        </div>

        {/* Shared Unified Input Text */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-mono">
            <Terminal className="w-3.5 h-3.5 text-[#FFCE32]" />
            Shared Test Vector Input
          </label>
          <textarea
            rows={3}
            value={sharedPrompt}
            onChange={(e) => setSharedPrompt(e.target.value)}
            placeholder="Enter input text to run concurrently through all selected models..."
            className="w-full p-3.5 rounded-2xl glass-input text-xs leading-relaxed"
          />
        </div>

        {/* Benchmark Execution Trigger */}
        <button
          onClick={handleRunComparison}
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#1D63FF] to-[#1447b8] hover:from-[#2568ff] hover:to-[#174ec7] text-white text-sm font-bold shadow-xl shadow-[#1D63FF]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Running Parallel Inference Benchmark...</span>
            </div>
          ) : (
            <>
              <Play className="w-4 h-4 text-[#FFCE32] fill-[#FFCE32]" />
              <span>Execute Side-by-Side Arena Comparison</span>
            </>
          )}
        </button>
      </div>

      {/* Comparison Results Area */}
      {results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Benchmark Telemetry & Comparative Synthesis</span>
            </h3>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-${results.length} gap-6`}>
            {results.map((r, idx) => {
              const textOutput = r.output?.text || r.output?.summaryText || r.output?.translatedText || JSON.stringify(r.output, null, 2);
              const isFastest = Math.min(...results.map(x => x.executionTimeMs || 9999)) === r.executionTimeMs;

              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-[#0b1120] border border-white/10 hover:border-[#1D63FF]/40 transition-all glass-panel flex flex-col justify-between space-y-4 shadow-xl relative"
                >
                  {isFastest && (
                    <div className="absolute -top-3 right-5 px-2.5 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-wider font-mono shadow-md">
                      Fastest Execution
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[10px] font-mono uppercase text-[#FFCE32] font-bold">
                          Slot {String.fromCharCode(65 + idx)}
                        </div>
                        <h4 className="text-base font-bold text-white">{r.modelName || r.modelId}</h4>
                        <div className="text-xs text-[#1D63FF] font-mono">{r.task}</div>
                      </div>
                    </div>

                    {/* Latency Gauge */}
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between font-mono text-xs">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#FFCE32]" />
                        Response Latency:
                      </span>
                      <span className="font-bold text-white">{r.executionTimeMs}ms</span>
                    </div>

                    {/* Output Render */}
                    <div className="p-4 rounded-2xl bg-[#060913]/90 border border-white/10 text-xs text-slate-200 leading-relaxed max-h-72 overflow-y-auto whitespace-pre-wrap font-sans">
                      {textOutput}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Provider: {r.provider}</span>
                    <span className="text-emerald-400">Completed</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
