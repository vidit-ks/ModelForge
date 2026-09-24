import React, { useState } from "react";
import { FileText, Copy, Check, BarChart3, Minimize2 } from "lucide-react";
import { useToast } from "../../common/Toast";

export function SummarizationOutput({ result }) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  const summary = result?.summaryText || (typeof result === "string" ? result : JSON.stringify(result));
  const origWords = result?.originalWordCount || 100;
  const sumWords = result?.summaryWordCount || summary.split(/\s+/).length;
  const compression = result?.compressionRatio || `${Math.round((1 - sumWords / origWords) * 100)}%`;

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    addToast("Summary copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#FFCE32]" />
          Abstractive Executive Summary
        </span>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs border border-white/10 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Original Words</div>
          <div className="text-base font-bold text-slate-200">{origWords}</div>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Summary Words</div>
          <div className="text-base font-bold text-[#FFCE32]">{sumWords}</div>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
          <div className="text-[10px] text-slate-400 uppercase font-mono">Compression</div>
          <div className="text-base font-bold text-emerald-400">{compression}</div>
        </div>
      </div>

      {/* Output Content */}
      <div className="p-5 rounded-2xl bg-[#060913]/90 border border-white/15 text-slate-100 text-sm leading-relaxed whitespace-pre-wrap">
        {summary}
      </div>
    </div>
  );
}
