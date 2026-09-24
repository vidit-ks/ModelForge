import React, { useState } from "react";
import { Copy, Check, Terminal, FileDown, Cpu } from "lucide-react";
import { useToast } from "../../common/Toast";

export function LLMOutput({ result, executionTimeMs }) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  const text = result?.text || (typeof result === "string" ? result : JSON.stringify(result, null, 2));

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast("Model response copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `modelforge-llm-output-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Cpu className="w-3.5 h-3.5 text-[#FFCE32]" />
            Generated Synthesis
          </span>
          {result?.tokensGenerated && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1D63FF]/20 text-[#1D63FF] border border-[#1D63FF]/30 font-mono">
              ~{result.tokensGenerated} tokens
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs transition-colors border border-white/10 font-mono"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
          <button
            onClick={handleDownload}
            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10"
            title="Download Markdown"
          >
            <FileDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-[#060913]/90 border border-white/15 font-sans text-xs sm:text-sm text-slate-100 leading-relaxed overflow-x-auto whitespace-pre-wrap selection:bg-[#1D63FF]/40 selection:text-white">
        {text}
      </div>
    </div>
  );
}
