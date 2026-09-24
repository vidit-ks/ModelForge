import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FlaskConical, 
  Layers, 
  Scale, 
  History, 
  Code2, 
  Cpu, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  Activity
} from "lucide-react";

export function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();

  const navItems = [
    { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { label: "AI Models", path: "/models", icon: Cpu, badge: "10" },
    { label: "Playground", path: "/playground", icon: FlaskConical },
    { label: "Compare Arena", path: "/compare", icon: Scale },
    { label: "Visual Workflows", path: "/workflows", icon: Layers, badge: "Graph" },
    { label: "Experiment Ledger", path: "/experiments", icon: History },
    { label: "API & Code", path: "/api-docs", icon: Code2 },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-white/10 bg-[#060913]/90 backdrop-blur-2xl transition-all duration-300 relative z-30 shrink-0 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-[#0b1120] border border-white/20 text-slate-300 hover:text-white flex items-center justify-center shadow-lg z-50 hover:bg-[#1D63FF] transition-all"
        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        {!collapsed && (
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            Navigation
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                isActive
                  ? "bg-gradient-to-r from-[#1D63FF]/25 to-transparent text-white border-l-2 border-[#FFCE32] shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <div
                className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                  isActive
                    ? "text-[#FFCE32] bg-[#FFCE32]/10"
                    : "text-slate-400 group-hover:text-white group-hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {!collapsed && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#1D63FF]/20 text-[#1D63FF] border border-[#1D63FF]/30">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* System Status Card */}
      {!collapsed ? (
        <div className="p-3.5 m-3 rounded-2xl bg-[#0b1120] border border-white/10 glass-panel">
          <div className="flex items-center justify-between text-xs mb-2 font-mono">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Inference
            </span>
            <span className="text-[10px] text-[#FFCE32]">10 Models</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            Hugging Face multi-modal inference router online.
          </p>
          <Link
            to="/playground"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#1D63FF] to-[#1447b8] hover:from-[#2568ff] hover:to-[#174ec7] text-white text-xs font-bold shadow-md shadow-[#1D63FF]/25 transition-all"
          >
            <FlaskConical className="w-3.5 h-3.5 text-[#FFCE32]" />
            <span>Open Playground</span>
          </Link>
        </div>
      ) : (
        <div className="p-2 flex flex-col items-center gap-2 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        </div>
      )}
    </aside>
  );
}
