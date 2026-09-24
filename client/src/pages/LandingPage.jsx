import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FlaskConical, 
  ArrowRight, 
  Play, 
  Layers, 
  Scale, 
  History, 
  Code2, 
  Zap, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  ChevronRight,
  Activity,
  Sliders,
  Eye,
  Volume2,
  Image as ImageIcon,
  Languages,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";

export function LandingPage({ models = [] }) {
  const [activeTab, setActiveTab] = useState("all");
  const [activeHeroModel, setActiveHeroModel] = useState("llm");

  const categories = ["all", "LLM & Reasoning", "Vision", "Multimodal", "Audio", "Generation"];

  const filteredModels = models.filter(m => activeTab === "all" || m.category === activeTab);

  const heroLiveExamples = {
    llm: {
      model: "GPT-OSS 120B",
      task: "Text Generation",
      input: "Evaluate sub-millisecond inference routing over distributed GPU nodes.",
      output: "Distributed vector mesh active. Latency profile indicates 99.4th percentile response envelopes under 4.2ms with zero dropped memory frames.",
      speed: "1.1s",
      icon: Cpu,
      color: "text-amber-400"
    },
    sentiment: {
      model: "DistilBERT SST-2",
      task: "Sentiment Analysis",
      input: "The neural latency and fidelity across all multi-modal endpoints is outstanding!",
      output: "POSITIVE (99.84% Confidence Score)",
      speed: "110ms",
      icon: Activity,
      color: "text-emerald-400"
    },
    translation: {
      model: "OPUS-MT En → Fr",
      task: "Neural Translation",
      input: "ModelForge accelerates multi-modal artificial intelligence experiments.",
      output: "« ModelForge accélère les expérimentations d'intelligence artificielle multi-modales. »",
      speed: "240ms",
      icon: Languages,
      color: "text-blue-400"
    },
    vision: {
      model: "DETR ResNet-50",
      task: "Object Detection",
      input: "High-resolution urban scene visual stream",
      output: "Detected 4 Entities: Person (98%), Laptop (96%), Desk (92%), Monitor (89%)",
      speed: "580ms",
      icon: Eye,
      color: "text-purple-400"
    }
  };

  const activeExample = heroLiveExamples[activeHeroModel];

  return (
    <div className="relative min-h-screen bg-[#060913] text-white selection:bg-[#1D63FF] selection:text-white overflow-hidden">
      {/* Background Lights & Cyber Grid */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-gradient-to-b from-[#1D63FF]/25 via-[#FFCE32]/12 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-96 -left-48 w-96 h-96 bg-[#1D63FF]/20 rounded-full blur-[130px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-[850px] -right-48 w-96 h-96 bg-[#FFCE32]/15 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Top Product Announcement Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#1D63FF]/50 text-xs font-medium text-slate-300 mb-8 backdrop-blur-md cursor-default shadow-lg"
        >
          <span className="w-2 h-2 rounded-full bg-[#FFCE32] animate-ping" />
          <span className="text-[#FFCE32] font-mono font-bold">ModelForge Studio</span>
          <span className="text-slate-500">|</span>
          <span className="font-mono text-[11px] text-slate-300">10 Hugging Face Inference Providers</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl mx-auto leading-[1.08]"
        >
          Explore. Run. Compare. <br />
          <span className="bg-gradient-to-r from-white via-[#FFCE32] to-[#1D63FF] bg-clip-text text-transparent">
            Connect AI Models.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Benchmark, experiment, and chain next-generation multi-modal models. From LLMs and audio transcription to computer vision and diffusion pipelines.
        </motion.p>

        {/* Main CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/playground"
            className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#1D63FF] to-[#1447b8] hover:from-[#2568ff] hover:to-[#174ec7] text-white text-sm font-bold shadow-xl shadow-[#1D63FF]/35 hover:shadow-[#1D63FF]/60 transition-all hover:scale-[1.03] cursor-pointer"
          >
            <FlaskConical className="w-4 h-4 text-[#FFCE32]" />
            <span>Launch Playground</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/workflows"
            className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-white text-sm font-semibold backdrop-blur-md transition-all hover:scale-[1.02]"
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Visual Workflows</span>
          </Link>
        </motion.div>

        {/* Dynamic Interactive Hero Sandbox */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 p-1 rounded-3xl bg-gradient-to-b from-white/20 via-[#1D63FF]/30 to-transparent shadow-2xl relative"
        >
          <div className="rounded-[22px] bg-[#0b1120] border border-white/10 p-6 sm:p-8 overflow-hidden glass-panel text-left space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FFCE32]">
                  Live Interactive Architecture Preview
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  Multi-Modal Ingress & Execution Trace
                </h3>
              </div>

              {/* Interactive Modality Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/50 border border-white/10">
                {[
                  { id: "llm", label: "LLM", icon: Cpu },
                  { id: "sentiment", label: "Sentiment", icon: Activity },
                  { id: "translation", label: "Translation", icon: Languages },
                  { id: "vision", label: "Vision", icon: Eye }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveHeroModel(item.id)}
                      className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                        activeHeroModel === item.id
                          ? "bg-[#1D63FF] text-white shadow-md shadow-[#1D63FF]/30"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Interactive Preview Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* Input Card */}
              <div className="p-5 rounded-2xl bg-[#060913]/90 border border-white/10 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                    <span className="text-[#FFCE32] font-bold">SOURCE INGRESS</span>
                    <span>{activeExample.model}</span>
                  </div>
                  <div className="text-xs font-mono text-slate-200 bg-white/5 p-3 rounded-xl border border-white/5 leading-relaxed">
                    "{activeExample.input}"
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Task: {activeExample.task}</span>
                  <span className="text-emerald-400">Status: Active</span>
                </div>
              </div>

              {/* Output Telemetry Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1D63FF]/15 via-[#0b1120] to-[#FFCE32]/10 border border-[#1D63FF]/30 space-y-3 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                    <span className="text-emerald-400 font-bold">SYNTHESIS OUTPUT</span>
                    <span className="text-[#FFCE32] flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {activeExample.speed}
                    </span>
                  </div>
                  <div className="text-xs text-slate-100 font-sans leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                    {activeExample.output}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-[#1D63FF] font-mono">Zero Token Exposure</span>
                  <Link
                    to="/playground"
                    className="flex items-center gap-1 text-xs font-bold text-[#FFCE32] hover:underline"
                  >
                    <span>Open in Playground</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Pillar Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFCE32]">
            Core Modules
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 tracking-tight">
            Built for High-Velocity AI Experimentation
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            A unified workbench combining model execution, multi-model benchmarking, visual graph orchestration, and code generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Link
            to="/playground"
            className="p-8 rounded-3xl bg-[#0b1120]/80 border border-white/10 hover:border-[#1D63FF]/50 transition-all glass-panel group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#1D63FF]/20 text-[#1D63FF] group-hover:bg-[#1D63FF] group-hover:text-white flex items-center justify-center mb-6 transition-colors shadow-lg">
                <FlaskConical className="w-6 h-6 text-[#FFCE32]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#FFCE32] transition-colors">
                Dynamic Playground
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Task-tailored interfaces adapt automatically. Live microphone recording for Whisper, bounding box overlays for DETR, and vector dimensional heatmaps for embeddings.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#1D63FF] group-hover:text-[#2568ff]">
              <span>Launch Playground</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            to="/compare"
            className="p-8 rounded-3xl bg-[#0b1120]/80 border border-white/10 hover:border-[#FFCE32]/50 transition-all glass-panel group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFCE32]/20 text-[#FFCE32] group-hover:bg-[#FFCE32] group-hover:text-black flex items-center justify-center mb-6 transition-colors shadow-lg">
                <Scale className="w-6 h-6 text-[#FFCE32]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#FFCE32] transition-colors">
                Comparison Arena
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Benchmark multiple models simultaneously on identical inputs. Measure response latency, synthesis fidelity, and execution metrics side-by-side.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#FFCE32] group-hover:text-white">
              <span>Open Arena</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 3 */}
          <Link
            to="/workflows"
            className="p-8 rounded-3xl bg-[#0b1120]/80 border border-white/10 hover:border-purple-500/50 transition-all glass-panel group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 group-hover:bg-purple-500 group-hover:text-white flex items-center justify-center mb-6 transition-colors shadow-lg">
                <Layers className="w-6 h-6 text-[#FFCE32]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#FFCE32] transition-colors">
                Visual Workflow Graph
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect models into autonomous multi-stage pipelines using React Flow. Pipe audio speech recognition outputs into sentiment analysis and LLM summaries.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-purple-400 group-hover:text-purple-300">
              <span>Build Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* Model Catalog Grid Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFCE32]">
              Inference Registry
            </span>
            <h2 className="text-3xl font-black text-white mt-1 tracking-tight">
              10 Integrated Architectures
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`text-xs py-1.5 px-3.5 rounded-xl font-medium transition-all capitalize cursor-pointer ${
                  activeTab === cat
                    ? "bg-[#1D63FF] text-white shadow-md shadow-[#1D63FF]/30 font-semibold"
                    : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Model Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.slice(0, 6).map((m) => (
            <div
              key={m.id}
              className="p-6 rounded-3xl bg-[#0b1120]/80 border border-white/10 hover:border-[#1D63FF]/40 transition-all flex flex-col justify-between glass-panel group hover:shadow-xl hover:shadow-[#1D63FF]/15"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold font-mono uppercase px-2.5 py-1 rounded-full bg-[#1D63FF]/20 text-[#1D63FF] border border-[#1D63FF]/30">
                    {m.category}
                  </span>
                  <span className="text-xs font-mono text-[#FFCE32]">{m.latencyAvg}</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-[#FFCE32] transition-colors">
                  {m.name}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {m.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">{m.provider}</span>
                <Link
                  to={`/playground?model=${encodeURIComponent(m.id)}`}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#FFCE32] hover:text-white transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Execute</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/models"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-bold transition-all hover:scale-105"
          >
            <span>Explore All 10 Models in Catalog</span>
            <ChevronRight className="w-4 h-4 text-[#FFCE32]" />
          </Link>
        </div>
      </section>

      {/* Developer API Code Export Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FFCE32]">
              Developer Native
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 leading-tight tracking-tight">
              Export Production API Code in Seconds
            </h2>
            <p className="text-slate-300 text-sm mt-4 leading-relaxed">
              Every experiment generates copy-paste ready Python, JavaScript, and cURL snippets with parameter bindings. Never expose secrets on the client.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero token leakage using backend inference proxy</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automatic type definitions and payload schema validation</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Full experiment persistence and telemetry auditing</span>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/api-docs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1D63FF] hover:bg-[#2568ff] text-white text-xs font-bold shadow-lg shadow-[#1D63FF]/30 transition-all"
              >
                <Code2 className="w-4 h-4 text-[#FFCE32]" />
                <span>Open API Code Generator</span>
              </Link>
            </div>
          </div>

          {/* Code Viewer Preview */}
          <div className="rounded-3xl bg-[#0b1120] border border-white/15 p-5 shadow-2xl font-mono text-xs text-slate-200 overflow-hidden glass-panel">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-slate-400 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-white font-semibold">inference_client.py</span>
              </div>
              <span className="text-[#FFCE32]">Python 3.11</span>
            </div>
            <pre className="mt-4 text-slate-300 leading-relaxed overflow-x-auto">
{`from huggingface_hub import InferenceClient

client = InferenceClient(
    provider="auto",
    api_key=os.environ.get("HF_TOKEN")
)

# Run GPT-OSS 120B Inference
response = client.post(
    model="openai/gpt-oss-120b",
    json={
        "inputs": "Analyze distributed consensus protocols",
        "parameters": {"max_new_tokens": 512, "temperature": 0.7}
    }
)`}
            </pre>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#060913]/90 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1D63FF] to-[#FFCE32] p-[1.5px]">
              <div className="w-full h-full bg-[#060913] rounded-[10px] flex items-center justify-center">
                <Cpu className="w-4 h-4 text-[#FFCE32]" />
              </div>
            </div>
            <span className="font-extrabold text-white text-base">
              Model<span className="text-[#FFCE32]">Forge</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">| AI Experimentation Studio</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
            <Link to="/playground" className="hover:text-white">Playground</Link>
            <Link to="/compare" className="hover:text-white">Comparison</Link>
            <Link to="/workflows" className="hover:text-white">Workflows</Link>
            <Link to="/api-docs" className="hover:text-white">API Docs</Link>
            <Link to="/settings" className="hover:text-white">Settings</Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center text-xs text-slate-500 font-mono">
          ModelForge AI Platform • Multi-Modal Inference Engine
        </div>
      </footer>
    </div>
  );
}
