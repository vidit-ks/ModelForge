import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/common/Navbar";
import { CommandPalette } from "./components/common/CommandPalette";
import { ToastProvider } from "./components/common/Toast";
import { SinglePageWorkspace } from "./pages/SinglePageWorkspace";
import { fetchModels } from "./services/api";
import { DEFAULT_MODELS } from "./data/models";

export function AppContent() {
  const [models, setModels] = useState(DEFAULT_MODELS);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    async function getModelCatalog() {
      try {
        const res = await fetchModels();
        if (res?.models && res.models.length > 0) {
          setModels(res.models);
        }
      } catch (err) {
        console.warn("Could not fetch models from server, using built-in catalog:", err);
      }
    }
    getModelCatalog();
  }, []);

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans selection:bg-[#1D63FF] selection:text-white relative">
      {/* Fixed/Sticky Top Navbar */}
      <Navbar onOpenCommandPalette={setIsCommandPaletteOpen} />

      {/* Main Full-Width Single-Page Continuous Workspace (Zero Sidebars) */}
      <main className="w-full flex-1 overflow-x-hidden bg-mesh bg-grid-cyber">
        <Routes>
          <Route path="*" element={<SinglePageWorkspace models={models} />} />
        </Routes>
      </main>

      {/* Global Command Palette (Ctrl+K / Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={setIsCommandPaletteOpen}
        models={models}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
