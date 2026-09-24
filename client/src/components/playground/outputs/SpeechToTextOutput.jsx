import React, { useState } from "react";
import { Mic, Copy, Check, Volume2, Globe, Clock } from "lucide-react";
import { useToast } from "../../common/Toast";

export function SpeechToTextOutput({ result }) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  const transcription = result?.transcription || (typeof result === "string" ? result : JSON.stringify(result));
  const language = result?.language || "english";
  const duration = result?.durationEstimated || "6.8s";

  const handleCopy = () => {
    navigator.clipboard.writeText(transcription);
    setCopied(true);
    addToast("Audio transcript copied!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Mic className="w-3.5 h-3.5 text-[#FFCE32]" />
          Whisper Large v3 Transcription
        </span>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs border border-white/10 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      {/* Metadata Badges */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
          <Globe className="w-3 h-3 text-[#1D63FF]" />
          <span>Language: <strong className="text-white capitalize">{language}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
          <Clock className="w-3 h-3 text-[#FFCE32]" />
          <span>Duration: <strong className="text-white">{duration}</strong></span>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-[#060913]/90 border border-white/15 text-sm text-slate-100 leading-relaxed">
        "{transcription}"
      </div>
    </div>
  );
}
