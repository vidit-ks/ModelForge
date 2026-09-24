import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Code2, Copy, Check, Terminal, Sparkles, Cpu, Layers, ExternalLink } from "lucide-react";
import { generateCode } from "../services/api";
import { useToast } from "../components/common/Toast";

export function ApiCodePage({ models = [] }) {
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();

  const initialModelId = searchParams.get("model") || models[0]?.id || "openai/gpt-oss-120b";
  const [selectedModelId, setSelectedModelId] = useState(initialModelId);
  const [activeLang, setActiveLang] = useState("python");
  const [codeData, setCodeData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentModel = models.find(m => m.id === selectedModelId) || models[0];

  useEffect(() => {
    async function loadSnippets() {
      if (!selectedModelId) return;
      setLoading(true);
      try {
        const res = await generateCode(selectedModelId, currentModel?.sampleInputs?.[0]?.prompt || "");
        setCodeData(res.snippets);
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    }
    loadSnippets();
  }, [selectedModelId]);

  const activeSnippet = codeData?.[activeLang] || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet);
    setCopied(true);
    addToast(`Copied ${activeLang.toUpperCase()} code snippet!`, "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#1D63FF] uppercase tracking-wider mb-1">
          <Code2 className="w-3.5 h-3.5" />
          Developer SDK & Code Generator
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          API & Code Generation
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Export production-grade API code snippets configured for your selected model. Embed directly into Python pipelines, Node microservices, or frontend web applications.
        </p>
      </div>

      {/* Model Selector Ribbon */}
      <div className="p-4 rounded-2xl bg-[#0b1120] border border-white/10 glass-panel flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-[#1D63FF]/30 to-[#FFCE32]/20 border border-[#FFCE32]/30 text-[#FFCE32]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono">Selected Inference Target:</div>
            <div className="text-sm font-bold text-white">{currentModel?.name}</div>
          </div>
        </div>

        <select
          value={selectedModelId}
          onChange={(e) => setSelectedModelId(e.target.value)}
          className="py-2 px-3.5 rounded-xl glass-input text-xs font-semibold text-white bg-[#0b1120]"
        >
          {models.map(m => (
            <option key={m.id} value={m.id} className="bg-[#0b1120] text-white">
              {m.name} ({m.task})
            </option>
          ))}
        </select>
      </div>

      {/* Code Viewer Container */}
      <div className="rounded-3xl bg-[#0b1120] border border-white/15 overflow-hidden shadow-2xl glass-panel">
        {/* Top Language Tabs Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#060913]/90 border-b border-white/10">
          <div className="flex items-center gap-2">
            {[
              { id: "python", label: "Python (InferenceClient)" },
              { id: "javascript", label: "JavaScript / ES6" },
              { id: "curl", label: "cURL" },
              { id: "sdk", label: "ModelForge SDK" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveLang(tab.id)}
                className={`text-xs py-1.5 px-3.5 rounded-xl font-mono font-medium transition-all cursor-pointer ${
                  activeLang === tab.id
                    ? "bg-[#1D63FF] text-white shadow-md shadow-[#1D63FF]/30 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white text-xs font-semibold border border-white/10 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Code"}</span>
          </button>
        </div>

        {/* Code Content Box */}
        <div className="p-6 bg-[#060913]/95 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed overflow-x-auto selection:bg-[#1D63FF]/40">
          {loading ? (
            <div className="py-12 text-center text-slate-400">Loading code definitions...</div>
          ) : (
            <pre className="text-slate-300">
              <code>{activeSnippet}</code>
            </pre>
          )}
        </div>

        {/* Footer Endpoint Guide */}
        <div className="px-6 py-3.5 bg-black/40 border-t border-white/5 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[#FFCE32]">POST</span>
            <span>https://router.huggingface.co/hf-inference/models/{selectedModelId}</span>
          </div>
          <span className="text-slate-500">Authorization: Bearer $HF_TOKEN</span>
        </div>
      </div>
    </div>
  );
}
