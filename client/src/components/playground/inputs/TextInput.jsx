import React from "react";
import { Terminal, Sliders } from "lucide-react";

export function TextInput({ value, onChange, placeholder = "Enter prompt...", sampleInputs = [], onSelectSample, minRows = 4, label = "Input Prompt / Text" }) {
  const charCount = value ? value.length : 0;
  const wordCount = value && value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-mono">
          <Terminal className="w-3.5 h-3.5 text-[#FFCE32]" />
          {label}
        </label>
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} chars</span>
        </div>
      </div>

      <div className="relative">
        <textarea
          rows={minRows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-4 rounded-2xl glass-input text-xs sm:text-sm leading-relaxed resize-y focus:ring-1 focus:ring-[#1D63FF]"
        />
      </div>

      {/* Preset sample buttons */}
      {sampleInputs && sampleInputs.length > 0 && (
        <div className="pt-1 space-y-1.5">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Sample Presets:
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleInputs.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectSample(sample.prompt || sample)}
                className="text-xs py-1 px-3 rounded-lg bg-white/5 hover:bg-[#1D63FF]/20 border border-white/10 hover:border-[#1D63FF]/40 text-slate-300 hover:text-white transition-all text-left font-mono"
              >
                {sample.title || sample.prompt?.slice(0, 32) || "Sample"}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
