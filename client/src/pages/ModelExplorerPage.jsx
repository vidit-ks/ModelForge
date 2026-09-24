import React, { useState, useMemo } from "react";
import { Search, Filter, Cpu, SlidersHorizontal, Sparkles, Zap, ArrowUpDown } from "lucide-react";
import { ModelCard } from "../components/models/ModelCard";
import { useToast } from "../components/common/Toast";

export function ModelExplorerPage({ models = [] }) {
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTask, setSelectedTask] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [favoriteIds, setFavoriteIds] = useState(() => {
    const saved = localStorage.getItem("modelforge_fav_models");
    return saved ? JSON.parse(saved) : ["openai/gpt-oss-120b", "black-forest-labs/FLUX.1-schnell"];
  });

  const categories = ["All", "LLM & Reasoning", "Classification", "Translation", "Summarization", "Vision", "Multimodal", "Audio", "Embeddings", "Generation"];

  const toggleFavorite = (modelId) => {
    setFavoriteIds(prev => {
      const next = prev.includes(modelId) ? prev.filter(id => id !== modelId) : [...prev, modelId];
      localStorage.setItem("modelforge_fav_models", JSON.stringify(next));
      addToast(next.includes(modelId) ? "Added to favorite models" : "Removed from favorites", "info");
      return next;
    });
  };

  const filtered = useMemo(() => {
    let list = models.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.id.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase()) ||
        m.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));

      const matchesCat = selectedCategory === "All" || m.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesTask = selectedTask === "All" || m.task === selectedTask;

      return matchesSearch && matchesCat && matchesTask;
    });

    if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "provider") {
      list.sort((a, b) => a.provider.localeCompare(b.provider));
    }

    return list;
  }, [models, search, selectedCategory, selectedTask, sortBy]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#FFCE32] font-semibold uppercase tracking-wider mb-1">
          <Cpu className="w-3.5 h-3.5 text-[#FFCE32]" />
          Model Catalog & Inference Registry
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Explore AI Models
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Discover all 10 Hugging Face integrated model architectures. Filter by modality, benchmark parameters, and run direct in-browser experiments.
        </p>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="p-5 rounded-2xl bg-[#0b1120] border border-white/10 glass-panel space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, provider, keyword or tag..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-auto py-2.5 px-3 rounded-xl glass-input text-xs"
            >
              <option value="default" className="bg-[#0b1120]">Default Sorting</option>
              <option value="name" className="bg-[#0b1120]">Sort by Name (A-Z)</option>
              <option value="provider" className="bg-[#0b1120]">Sort by Provider</option>
            </select>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs py-1.5 px-3 rounded-xl font-medium transition-all capitalize cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#1D63FF] text-white shadow-md shadow-[#1D63FF]/30 font-semibold"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            isFavorite={favoriteIds.includes(model.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-16 rounded-3xl bg-[#0b1120]/60 border border-white/10 text-center space-y-3">
          <Search className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No models match your query</h3>
          <p className="text-xs text-slate-400">Try clearing filters or search terms.</p>
        </div>
      )}
    </div>
  );
}
