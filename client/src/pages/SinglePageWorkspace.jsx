import React, { useState, useEffect, useRef } from "react";
import { 
  FlaskConical, 
  Cpu, 
  Layers, 
  Scale, 
  History, 
  Code2, 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Terminal, 
  Activity, 
  ChevronRight,
  Zap,
  Sliders,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";

// Section Components
import { ModelGalleryCarousel } from "../components/models/ModelGalleryCarousel";
import { ModelDetailModal } from "../components/models/ModelDetailModal";
import { PlaygroundPage } from "./PlaygroundPage";
import { ComparePage } from "./ComparePage";
import { WorkflowBuilderPage } from "./WorkflowBuilderPage";
import { ExperimentHistoryPage } from "./ExperimentHistoryPage";
import { ApiCodePage } from "./ApiCodePage";

export function SinglePageWorkspace({ models = [], onSelectModelForPlayground }) {
  const [selectedDetailModel, setSelectedDetailModel] = useState(null);
  const [activePlaygroundModelId, setActivePlaygroundModelId] = useState("openai/gpt-oss-120b");

  const handleTryModel = (modelId) => {
    setActivePlaygroundModelId(modelId);
    const playgroundElem = document.getElementById("playground");
    if (playgroundElem) {
      playgroundElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToSection = (sectionId) => {
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full text-white selection:bg-[#1D63FF] selection:text-white pb-16">
      {/* ========================================================================= */}
      {/* 1. OVERVIEW & HERO SECTION */}
      {/* ========================================================================= */}
      <section id="overview" className="relative pt-16 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Top Product Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#1D63FF]/50 text-xs font-medium text-slate-300 mb-8 backdrop-blur-md cursor-default shadow-lg"
        >
          <span className="w-2 h-2 rounded-full bg-[#FFCE32] animate-ping" />
          <span className="text-[#FFCE32] font-mono font-bold">MODELFORGE AI STUDIO</span>
          <span className="text-slate-500">|</span>
          <span className="font-mono text-[11px] text-slate-300">10 Multi-Modal Inference Providers</span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl mx-auto leading-[1.08]"
        >
          Experiment with AI models. <br />
          <span className="bg-gradient-to-r from-white via-[#FFCE32] to-[#1D63FF] bg-clip-text text-transparent">
            Run them. Compare them. Connect them.
          </span>
        </motion.h1>

        {/* Short Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          A unified, developer-first workbench for multi-modal machine learning. Discover architectures, test inputs, compare outputs, and orchestrate visual pipelines.
        </motion.p>

        {/* Quick Hero CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => scrollToSection("playground")}
            className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#1D63FF] to-[#1447b8] hover:from-[#2568ff] hover:to-[#174ec7] text-white text-sm font-bold shadow-xl shadow-[#1D63FF]/35 hover:shadow-[#1D63FF]/60 transition-all hover:scale-[1.03] cursor-pointer"
          >
            <FlaskConical className="w-4 h-4 text-[#FFCE32]" />
            <span>Open Playground</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => scrollToSection("models")}
            className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white text-sm font-semibold backdrop-blur-md transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-[#FFCE32]" />
            <span>Explore Models</span>
          </button>
        </motion.div>

        {/* ========================================================================= */}
        {/* WHAT IS MODELFORGE? PLATFORM CAPABILITIES GUIDE */}
        {/* ========================================================================= */}
        <div className="mt-24 pt-16 border-t border-white/10 text-left">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFCE32]">
              Platform Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1.5 tracking-tight">
              What can you do with ModelForge?
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Explore the six core capabilities designed to accelerate your AI experimentation workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Capability 1 */}
            <div
              onClick={() => scrollToSection("models")}
              className="p-6 rounded-3xl bg-[#0b1120] border border-white/10 hover:border-[#1D63FF]/50 transition-all glass-panel cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#1D63FF]/20 text-[#1D63FF] flex items-center justify-center mb-4 group-hover:bg-[#1D63FF] group-hover:text-white transition-colors">
                  <Cpu className="w-5 h-5 text-[#FFCE32]" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#FFCE32] transition-colors">
                  Model Explorer
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Discover and understand available AI models. Inspect architectures, input types, and capabilities with one-click testing.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#1D63FF]">
                <span>Explore 10 Models</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Capability 2 */}
            <div
              onClick={() => scrollToSection("playground")}
              className="p-6 rounded-3xl bg-[#0b1120] border border-white/10 hover:border-[#FFCE32]/50 transition-all glass-panel cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#FFCE32]/20 text-[#FFCE32] flex items-center justify-center mb-4 group-hover:bg-[#FFCE32] group-hover:text-black transition-colors">
                  <FlaskConical className="w-5 h-5 text-[#FFCE32]" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#FFCE32] transition-colors">
                  Interactive Playground
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Run an AI model directly with your own input. Dynamic UI adapts to text, images, microphone voice audio, and diffusion prompts.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#FFCE32]">
                <span>Launch Playground</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Capability 3 */}
            <div
              onClick={() => scrollToSection("compare")}
              className="p-6 rounded-3xl bg-[#0b1120] border border-white/10 hover:border-[#1D63FF]/50 transition-all glass-panel cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#1D63FF]/20 text-[#1D63FF] flex items-center justify-center mb-4 group-hover:bg-[#1D63FF] group-hover:text-white transition-colors">
                  <Scale className="w-5 h-5 text-[#FFCE32]" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#FFCE32] transition-colors">
                  Compare Arena
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Run multiple models simultaneously against the same input. Benchmark quality, response differences, and execution speed side-by-side.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#1D63FF]">
                <span>Compare Models</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Capability 4 */}
            <div
              onClick={() => scrollToSection("workflows")}
              className="p-6 rounded-3xl bg-[#0b1120] border border-white/10 hover:border-purple-500/50 transition-all glass-panel cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <Layers className="w-5 h-5 text-[#FFCE32]" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#FFCE32] transition-colors">
                  Visual Workflows
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Connect multiple models together into autonomous multi-stage pipelines using an interactive node canvas.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-purple-400">
                <span>Build Pipelines</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Capability 5 */}
            <div
              onClick={() => scrollToSection("history")}
              className="p-6 rounded-3xl bg-[#0b1120] border border-white/10 hover:border-white/30 transition-all glass-panel cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/10 text-slate-200 flex items-center justify-center mb-4 group-hover:bg-white group-hover:text-black transition-colors">
                  <History className="w-5 h-5 text-[#FFCE32]" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#FFCE32] transition-colors">
                  Experiment History
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Review, inspect, and rerun previous experiments with JSON payload inspection and exportable telemetry logs.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-300">
                <span>View History</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Capability 6 */}
            <div
              onClick={() => scrollToSection("api-code")}
              className="p-6 rounded-3xl bg-[#0b1120] border border-white/10 hover:border-[#1D63FF]/50 transition-all glass-panel cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#1D63FF]/20 text-[#1D63FF] flex items-center justify-center mb-4 group-hover:bg-[#1D63FF] group-hover:text-white transition-colors">
                  <Code2 className="w-5 h-5 text-[#FFCE32]" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#FFCE32] transition-colors">
                  API & Code Export
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Generate copy-paste ready code in Python, JavaScript, and cURL for seamless integration into production applications.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#1D63FF]">
                <span>Generate Code</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. INFINITE MODEL GALLERY CAROUSEL SECTION */}
      {/* ========================================================================= */}
      <section id="models" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFCE32]">
            Model Explorer
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-1 tracking-tight">
            Integrated Model Gallery
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            Browse through 10 integrated architectures. Simple by default, detailed on demand.
          </p>
        </div>

        {/* 3D Infinite Circular Model Gallery */}
        <ModelGalleryCarousel
          models={models}
          onTryModel={handleTryModel}
          onOpenDetails={setSelectedDetailModel}
        />
      </section>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE PLAYGROUND SECTION */}
      {/* ========================================================================= */}
      <section id="playground" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFCE32]">
            Live Execution Studio
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-1 tracking-tight">
            AI Playground
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Run any supported AI model directly with your own input. Select a model, provide an input, execute the inference, and explore the output synthesis.
          </p>
        </div>

        <PlaygroundPage models={models} activeModelId={activePlaygroundModelId} />
      </section>

      {/* ========================================================================= */}
      {/* 4. COMPARE ARENA SECTION */}
      {/* ========================================================================= */}
      <section id="compare" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFCE32]">
            Multi-Model Benchmarking
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-1 tracking-tight">
            Compare Arena
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Run multiple AI models against the same input simultaneously and observe how their outputs, response styles, and execution latencies differ.
          </p>
        </div>

        <ComparePage models={models} />
      </section>

      {/* ========================================================================= */}
      {/* 5. VISUAL WORKFLOWS SECTION */}
      {/* ========================================================================= */}
      <section id="workflows" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFCE32]">
            Visual Pipeline Orchestration
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-1 tracking-tight">
            Visual AI Workflows
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Connect multiple AI models together and turn them into an autonomous pipeline with live data flow between nodes.
          </p>
        </div>

        <WorkflowBuilderPage models={models} />
      </section>

      {/* ========================================================================= */}
      {/* 6. EXPERIMENT HISTORY SECTION */}
      {/* ========================================================================= */}
      <section id="history" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFCE32]">
            Audit & Telemetry Ledger
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-1 tracking-tight">
            Experiment History
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Your AI experiment timeline — revisit, inspect request/response payloads, and rerun previous experiments with one click.
          </p>
        </div>

        <ExperimentHistoryPage />
      </section>

      {/* ========================================================================= */}
      {/* 7. API / CODE GENERATOR SECTION */}
      {/* ========================================================================= */}
      <section id="api-code" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFCE32]">
            Developer Integration
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-1 tracking-tight">
            API & Code Generator
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Turn any experiment into production-ready code with pre-configured headers and parameter payloads.
          </p>
        </div>

        <ApiCodePage models={models} />
      </section>

      {/* ========================================================================= */}
      {/* 8. FINAL CTA & FOOTER */}
      {/* ========================================================================= */}
      <footer className="mt-20 border-t border-white/10 bg-[#060913]/90 pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#1D63FF]/20 via-[#0b1120] to-[#060913] border border-[#1D63FF]/30 text-center space-y-6 shadow-2xl mb-12 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1D63FF] to-[#FFCE32] p-1 mx-auto flex items-center justify-center">
            <Cpu className="w-6 h-6 text-black" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Start Experimenting with ModelForge
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Launch multi-modal pipelines, test computer vision models, benchmark LLMs, and export production code.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection("playground")}
              className="py-3 px-8 rounded-xl bg-[#1D63FF] hover:bg-[#2568ff] text-white text-xs font-bold shadow-lg shadow-[#1D63FF]/30 transition-all cursor-pointer"
            >
              Open Live Playground
            </button>
            <button
              onClick={() => scrollToSection("overview")}
              className="py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Back to Top ↑
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Model<span className="text-[#FFCE32]">Forge</span></span>
            <span>• Full-Stack AI Experimentation Studio</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => scrollToSection("overview")} className="hover:text-white cursor-pointer">Overview</button>
            <button onClick={() => scrollToSection("models")} className="hover:text-white cursor-pointer">Models</button>
            <button onClick={() => scrollToSection("playground")} className="hover:text-white cursor-pointer">Playground</button>
            <button onClick={() => scrollToSection("compare")} className="hover:text-white cursor-pointer">Compare</button>
            <button onClick={() => scrollToSection("workflows")} className="hover:text-white cursor-pointer">Workflows</button>
            <button onClick={() => scrollToSection("history")} className="hover:text-white cursor-pointer">History</button>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      <ModelDetailModal
        model={selectedDetailModel}
        isOpen={Boolean(selectedDetailModel)}
        onClose={() => setSelectedDetailModel(null)}
        onTryModel={handleTryModel}
      />
    </div>
  );
}
