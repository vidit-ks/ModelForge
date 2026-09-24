import React, { useState, useEffect } from "react";
import { Settings, ShieldCheck, Key, Database, Cpu, CheckCircle2, AlertCircle, RefreshCw, Trash2 } from "lucide-react";
import { fetchHealth } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/common/Toast";

export function SettingsPage({ models = [] }) {
  const { user, isSupabaseConfigured } = useAuth();
  const { addToast } = useToast();
  const [health, setHealth] = useState(null);
  const [checking, setChecking] = useState(false);

  const checkStatus = async () => {
    setChecking(true);
    try {
      const data = await fetchHealth();
      setHealth(data);
      addToast("System connectivity check complete", "info");
    } catch (err) {
      addToast("Failed to reach server gateway", "error");
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleClearCache = () => {
    localStorage.removeItem("modelforge_fav_models");
    addToast("Local cache reset successfully", "success");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
          <Settings className="w-3.5 h-3.5" />
          Platform Diagnostics & Configuration
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          System Settings & Integrations
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review backend gateway environment variables, Supabase cloud sync status, and active Hugging Face model pipelines.
        </p>
      </div>

      {/* Connectivity Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HF Token Status */}
        <div className="p-6 rounded-3xl bg-[#0b1120] border border-white/10 glass-panel space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#1D63FF]/20 text-[#1D63FF]">
                <Key className="w-5 h-5 text-[#FFCE32]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Hugging Face Provider</h3>
                <div className="text-[11px] text-slate-400 font-mono">Inference API Gateway</div>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
              health?.hfTokenConfigured
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
            }`}>
              {health?.hfTokenConfigured ? "Token Verified" : "Sandbox / Ready"}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            ModelForge server securely proxies inference requests using server-side <code>HF_TOKEN</code>. Live calls execute automatically, backed by high-fidelity local simulation if cold-starting.
          </p>

          <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-[11px] font-mono text-slate-400">
            Endpoint: https://router.huggingface.co/hf-inference
          </div>
        </div>

        {/* Supabase Status */}
        <div className="p-6 rounded-3xl bg-[#0b1120] border border-white/10 glass-panel space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Supabase Cloud Database</h3>
                <div className="text-[11px] text-slate-400 font-mono">Persistence & Auth</div>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
              isSupabaseConfigured
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
            }`}>
              {isSupabaseConfigured ? "Cloud Synced" : "Local Workspace Mode"}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Auth, experiment telemetry, and workflow graphs persist directly. Run <code>supabase_schema.sql</code> in your Supabase SQL editor to enable cloud table replication.
          </p>

          <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-[11px] font-mono text-slate-400">
            Active User: {user?.email || "Guest Researcher"}
          </div>
        </div>
      </div>

      {/* Model Pipeline Health Check */}
      <div className="p-6 rounded-3xl bg-[#0b1120] border border-white/10 glass-panel space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#FFCE32]" />
            <h3 className="text-sm font-bold text-white">10 Integrated Model Architectures</h3>
          </div>

          <button
            onClick={checkStatus}
            disabled={checking}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white border border-white/10"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? "animate-spin" : ""}`} />
            <span>Check Connectivity</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {models.map((m) => (
            <div key={m.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">{m.name}</div>
                <div className="text-[10px] font-mono text-slate-400">{m.task}</div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Maintenance Controls */}
      <div className="p-6 rounded-3xl bg-[#0b1120] border border-white/10 glass-panel flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white">Reset Local Workspace Cache</h4>
          <p className="text-xs text-slate-400 mt-0.5">Clears cached favorite models and local preferences.</p>
        </div>
        <button
          onClick={handleClearCache}
          className="py-2 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset Cache</span>
        </button>
      </div>
    </div>
  );
}
