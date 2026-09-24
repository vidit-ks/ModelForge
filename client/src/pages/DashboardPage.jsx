import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FlaskConical, 
  Cpu, 
  Layers, 
  History, 
  Scale, 
  Activity, 
  Zap, 
  ArrowRight, 
  Play, 
  Clock, 
  Code2,
  Terminal,
  CheckCircle2
} from "lucide-react";
import { fetchExperiments, fetchWorkflows } from "../services/api";
import { useToast } from "../components/common/Toast";

export function DashboardPage({ models = [] }) {
  const { addToast } = useToast();
  const [recentExperiments, setRecentExperiments] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [expRes, wfRes] = await Promise.all([
          fetchExperiments().catch(() => ({ experiments: [] })),
          fetchWorkflows().catch(() => ({ workflows: [] }))
        ]);
        setRecentExperiments(expRes.experiments || []);
        setWorkflows(wfRes.workflows || []);
      } catch (err) {
        console.warn("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const featuredQuickLaunch = models.slice(0, 4);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFCE32] font-bold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            AI Workspace Online
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Research Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Multi-modal model telemetry, latency profiling, and visual graph execution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/playground"
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#1D63FF] to-[#1447b8] hover:from-[#2568ff] hover:to-[#174ec7] text-white text-xs font-bold shadow-lg shadow-[#1D63FF]/30 transition-all hover:scale-[1.02]"
          >
            <FlaskConical className="w-4 h-4 text-[#FFCE32]" />
            <span>Open Playground</span>
          </Link>
          <Link
            to="/workflows"
            className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold transition-all hover:scale-[1.02]"
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Build Workflow</span>
          </Link>
        </div>
      </div>

      {/* Metric Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-white/10 glass-panel">
          <div className="flex items-center justify-between text-slate-400 mb-2 font-mono">
            <span className="text-xs uppercase">Active Models</span>
            <Cpu className="w-4 h-4 text-[#1D63FF]" />
          </div>
          <div className="text-2xl font-black text-white">{models.length || 10}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            100% Ingress Ready
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1120] border border-white/10 glass-panel">
          <div className="flex items-center justify-between text-slate-400 mb-2 font-mono">
            <span className="text-xs uppercase">Recorded Runs</span>
            <History className="w-4 h-4 text-[#FFCE32]" />
          </div>
          <div className="text-2xl font-black text-white">{recentExperiments.length}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">Telemetry ledger</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1120] border border-white/10 glass-panel">
          <div className="flex items-center justify-between text-slate-400 mb-2 font-mono">
            <span className="text-xs uppercase">Average Latency</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">~340ms</div>
          <div className="text-[11px] text-[#FFCE32] mt-1 font-mono">Accelerated inference</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b1120] border border-white/10 glass-panel">
          <div className="flex items-center justify-between text-slate-400 mb-2 font-mono">
            <span className="text-xs uppercase">Workflows</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{workflows.length || 3}</div>
          <div className="text-[11px] text-purple-300 mt-1 font-mono">Multi-stage pipelines</div>
        </div>
      </div>

      {/* Quick Launch Sandbox Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#FFCE32]" />
            <h2 className="text-base font-bold text-white">Quick Launch Sandbox</h2>
          </div>
          <Link to="/models" className="text-xs text-[#1D63FF] hover:underline flex items-center gap-1 font-semibold">
            <span>Explore all 10 models</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredQuickLaunch.map((m) => (
            <Link
              key={m.id}
              to={`/playground?model=${encodeURIComponent(m.id)}`}
              className="p-5 rounded-2xl bg-[#0b1120] hover:bg-[#10182c] border border-white/10 hover:border-[#1D63FF]/50 transition-all flex flex-col justify-between glass-panel group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[#FFCE32]">{m.category}</span>
                  <span>{m.latencyAvg}</span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-[#FFCE32] transition-colors truncate">
                  {m.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {m.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-[#1D63FF] group-hover:text-[#2568ff]">
                <span>Run In Playground</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Timeline vs Workflows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Recent Experiments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#FFCE32]" />
              <h2 className="text-base font-bold text-white">Recent Experiment Runs</h2>
            </div>
            <Link to="/experiments" className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
              <span>View full ledger</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentExperiments.slice(0, 4).map((exp) => (
              <div
                key={exp.id}
                className="p-4 rounded-2xl bg-[#0b1120] border border-white/10 hover:border-white/20 transition-all glass-panel flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{exp.modelName || exp.modelId}</span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-[#1D63FF]/20 text-[#1D63FF]">
                      {exp.task}
                    </span>
                    <span className="text-[10px] font-mono text-[#FFCE32]">
                      {exp.executionTimeMs}ms
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-1 italic font-mono">
                    "{exp.inputData?.prompt || exp.inputData?.imageUrl || "Media Input"}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/playground?model=${encodeURIComponent(exp.modelId)}`}
                    className="py-1.5 px-3 rounded-xl bg-white/5 hover:bg-[#1D63FF]/20 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3 h-3 text-[#FFCE32]" />
                    <span>Re-run</span>
                  </Link>
                </div>
              </div>
            ))}

            {recentExperiments.length === 0 && (
              <div className="p-8 rounded-2xl bg-[#0b1120]/50 border border-white/10 text-center text-slate-400 text-xs">
                No experiments recorded yet. Launch any model from the Playground to start logging telemetry.
              </div>
            )}
          </div>
        </div>

        {/* Right: Pipelines */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <h2 className="text-base font-bold text-white">Suggested Pipelines</h2>
            </div>
            <Link to="/workflows" className="text-xs text-slate-400 hover:text-white">
              Canvas
            </Link>
          </div>

          <div className="space-y-3">
            {workflows.map((wf) => (
              <div
                key={wf.id}
                className="p-4 rounded-2xl bg-[#0b1120] border border-white/10 hover:border-purple-500/40 transition-all glass-panel space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{wf.title}</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {wf.nodes?.length || 4} Nodes
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                  {wf.description}
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">{wf.category}</span>
                  <Link
                    to="/workflows"
                    className="text-xs font-semibold text-[#FFCE32] hover:underline flex items-center gap-1"
                  >
                    <span>Load Graph</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
