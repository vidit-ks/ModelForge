import React, { useState } from "react";
import { Sparkles, Copy, Check, Eye } from "lucide-react";
import { useToast } from "../../common/Toast";

export function VisionQAOutput({ result }) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  const text = result?.response || (typeof result === "string" ? result : JSON.stringify(result, null, 2));

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast("VQA response copied!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#FFCE32]" />
            Qwen2.5-VL Multimodal Analysis
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1D63FF]/20 text-[#1D63FF] border border-[#1D63FF]/30 font-mono">
            Vision-Language Reasoning
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs border border-white/10 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      <div className="p-5 rounded-2xl bg-[#060913]/90 border border-white/15 text-sm text-slate-100 leading-relaxed overflow-x-auto whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
}
