import React, { useState } from "react";
import { ChevronDown, Cpu, Check, Search } from "lucide-react";

export function ModelSelector({ models = [], selectedModelId, onSelectModel, filterCategory = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = models
    .filter(m => !filterCategory || m.category === filterCategory || filterCategory === "All")
    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.task.toLowerCase().includes(search.toLowerCase()));

  const selectedModel = models.find(m => m.id === selectedModelId) || models[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#0b1120] border border-white/15 hover:border-[#1D63FF]/50 text-left transition-all glass-panel cursor-pointer"
      >
        <div className="flex items-center gap-3 truncate">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#1D63FF]/30 to-[#FFCE32]/20 border border-[#FFCE32]/30 text-[#FFCE32] shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="text-xs text-[#1D63FF] font-semibold uppercase tracking-wider font-mono">
              {selectedModel?.category}
            </div>
            <div className="text-sm font-bold text-white truncate flex items-center gap-2">
              <span>{selectedModel?.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono font-normal">
                {selectedModel?.task}
              </span>
            </div>
          </div>
        </div>

        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 top-full mt-2 bg-[#0b1120] border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden glass-panel max-h-80 flex flex-col">
            <div className="p-2.5 border-b border-white/10 flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#FFCE32]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter models..."
                className="w-full bg-transparent text-xs text-white focus:outline-none placeholder-slate-500"
                autoFocus
              />
            </div>

            <div className="overflow-y-auto p-1.5 space-y-1">
              {filtered.map((m) => {
                const isSelected = m.id === selectedModel?.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onSelectModel(m.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                      isSelected
                        ? "bg-[#1D63FF]/20 border border-[#1D63FF]/40 text-white"
                        : "hover:bg-white/5 text-slate-300 hover:text-white"
                    }`}
                  >
                    <div className="truncate">
                      <div className="text-xs font-semibold flex items-center gap-2">
                        <span>{m.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({m.task})</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{m.description}</div>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-[#FFCE32] shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
