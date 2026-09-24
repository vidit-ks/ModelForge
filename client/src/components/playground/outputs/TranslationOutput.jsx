import React, { useState } from "react";
import { Languages, Copy, Check, Volume2 } from "lucide-react";
import { useToast } from "../../common/Toast";

export function TranslationOutput({ result }) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  const translatedText = result?.translatedText || (typeof result === "string" ? result : JSON.stringify(result));

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    addToast("French translation copied!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeech = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = "fr-FR";
      window.speechSynthesis.speak(utterance);
      addToast("Playing French audio pronunciation...", "info");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-[#FFCE32]" />
            Target Translation (French)
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1D63FF]/20 text-[#1D63FF] border border-[#1D63FF]/30 font-mono">
            OPUS-MT English → French
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSpeech}
            className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs border border-white/10 transition-colors"
            title="Pronounce translation"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#FFCE32]" />
            <span>Listen</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs border border-white/10 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#060913]/90 border border-white/15 text-slate-100 text-base font-medium leading-relaxed italic border-l-4 border-l-[#1D63FF]">
        « {translatedText} »
      </div>
    </div>
  );
}
