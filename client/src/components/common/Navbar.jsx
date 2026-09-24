import React, { useState, useEffect } from "react";
import { 
  FlaskConical, 
  Command, 
  Cpu, 
  Layers, 
  Scale, 
  History, 
  Code2, 
  Menu, 
  X, 
  ArrowRight
} from "lucide-react";

export function Navbar({ onOpenCommandPalette }) {
  const [activeSection, setActiveSection] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll spy to highlight active section
  useEffect(() => {
    const sectionIds = ["overview", "models", "playground", "compare", "workflows", "history", "api-code"];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const elem = document.getElementById(sectionIds[i]);
        if (elem && elem.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (sectionId) => {
    setIsMobileMenuOpen(false);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#060913]/90 backdrop-blur-2xl transition-all shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => scrollTo("overview")}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1D63FF] to-[#FFCE32] p-[1.5px] shadow-lg shadow-[#1D63FF]/25 group-hover:shadow-[#FFCE32]/40 transition-all duration-300">
              <div className="w-full h-full bg-[#060913] rounded-[14px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-[#FFCE32] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Model<span className="text-[#FFCE32]">Forge</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#1D63FF] font-mono font-bold -mt-1">
                AI Studio
              </span>
            </div>
          </button>

          {/* Top Smooth Scroll Navbar Items */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={() => scrollTo("overview")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeSection === "overview"
                  ? "bg-white/10 text-white shadow-inner font-bold border border-white/10"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Workspace
            </button>

            <button
              onClick={() => scrollTo("models")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeSection === "models"
                  ? "bg-white/10 text-white shadow-inner font-bold border border-white/10"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>Models</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#1D63FF]/20 text-[#1D63FF] font-mono">
                10
              </span>
            </button>

            <button
              onClick={() => scrollTo("playground")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeSection === "playground"
                  ? "bg-gradient-to-r from-[#1D63FF]/30 to-[#FFCE32]/20 text-white border border-[#FFCE32]/30 shadow-md font-bold"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-[#FFCE32]" />
              <span>Playground</span>
            </button>

            <button
              onClick={() => scrollTo("compare")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeSection === "compare"
                  ? "bg-white/10 text-white shadow-inner font-bold border border-white/10"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-[#1D63FF]" />
              <span>Compare Arena</span>
            </button>

            <button
              onClick={() => scrollTo("workflows")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeSection === "workflows"
                  ? "bg-white/10 text-white shadow-inner font-bold border border-white/10"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Workflows</span>
            </button>

            <button
              onClick={() => scrollTo("history")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeSection === "history"
                  ? "bg-white/10 text-white shadow-inner font-bold border border-white/10"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <History className="w-3.5 h-3.5 text-slate-400" />
              <span>History</span>
            </button>

            <button
              onClick={() => scrollTo("api-code")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                activeSection === "api-code"
                  ? "bg-white/10 text-white shadow-inner font-bold border border-white/10"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-[#1D63FF]" />
              <span>API & Code</span>
            </button>
          </nav>
        </div>

        {/* Right Search & Launch Studio Button */}
        <div className="flex items-center gap-3">
          {/* Quick Search Command Shortcut */}
          <button
            onClick={() => onOpenCommandPalette(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
          >
            <Command className="w-3.5 h-3.5 text-[#FFCE32]" />
            <span>Search</span>
            <kbd className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded border border-white/10 font-mono text-slate-400">
              Ctrl+K
            </kbd>
          </button>

          {/* Launch Studio CTA */}
          <button
            onClick={() => scrollTo("playground")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1D63FF] to-[#1447b8] hover:from-[#2568ff] hover:to-[#174ec7] text-white text-xs font-bold shadow-lg shadow-[#1D63FF]/30 hover:shadow-[#1D63FF]/50 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <FlaskConical className="w-4 h-4 text-[#FFCE32]" />
            <span>Launch Studio</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#060913]/98 px-4 py-4 space-y-2">
          <button
            onClick={() => scrollTo("overview")}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/5 font-medium"
          >
            Workspace Overview
          </button>
          <button
            onClick={() => scrollTo("models")}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/5 font-medium"
          >
            Model Explorer (10)
          </button>
          <button
            onClick={() => scrollTo("playground")}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-white hover:bg-white/5 font-medium"
          >
            Interactive Playground
          </button>
          <button
            onClick={() => scrollTo("compare")}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/5 font-medium"
          >
            Compare Arena
          </button>
          <button
            onClick={() => scrollTo("workflows")}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/5 font-medium"
          >
            Visual Workflows
          </button>
          <button
            onClick={() => scrollTo("history")}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/5 font-medium"
          >
            Experiment Ledger
          </button>
          <button
            onClick={() => scrollTo("api-code")}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/5 font-medium"
          >
            API & Code Generator
          </button>
        </div>
      )}
    </header>
  );
}
