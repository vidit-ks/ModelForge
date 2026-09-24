import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, ArrowRight, Cpu, Zap, Activity } from "lucide-react";
import { motion } from "framer-motion";

export function ModelGalleryCarousel({ models = [], onTryModel, onOpenDetails }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  const count = models.length;

  const handleNext = useCallback(() => {
    if (count === 0) return;
    setCurrentIndex((prev) => (prev + 1) % count);
  }, [count]);

  const handlePrev = useCallback(() => {
    if (count === 0) return;
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  // Keyboard navigation support (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input/textarea
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
        return;
      }
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  if (count === 0) return null;

  // Card dimensions for smooth sliding calculation
  const cardWidth = 340;
  const cardGap = 24;
  const slideStep = cardWidth + cardGap;

  return (
    <div className="relative w-full max-w-6xl mx-auto py-8 px-2 sm:px-4 select-none">
      {/* Navigation Arrows */}
      <div className="flex items-center justify-between absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 pointer-events-none px-1 sm:px-2">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Slide Left"
          className="pointer-events-auto w-12 h-12 rounded-2xl bg-[#0b1120]/90 hover:bg-[#1D63FF] border border-white/15 text-white flex items-center justify-center shadow-2xl backdrop-blur-xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer group"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Slide Right"
          className="pointer-events-auto w-12 h-12 rounded-2xl bg-[#0b1120]/90 hover:bg-[#1D63FF] border border-white/15 text-white flex items-center justify-center shadow-2xl backdrop-blur-xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer group"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Sliding Track Viewport */}
      <div 
        ref={containerRef}
        className="w-full overflow-hidden py-6 relative"
      >
        <motion.div
          className="flex items-center"
          animate={{
            x: `calc(50% - ${currentIndex * slideStep + cardWidth / 2}px)`
          }}
          transition={{
            type: "spring",
            stiffness: 240,
            damping: 26,
            mass: 0.9
          }}
          style={{
            gap: `${cardGap}px`
          }}
        >
          {models.map((model, index) => {
            const isCenter = index === currentIndex;
            const distance = Math.abs(index - currentIndex);
            const isNeighbor = distance === 1;

            return (
              <motion.div
                key={model.id}
                onClick={() => setCurrentIndex(index)}
                animate={{
                  scale: isCenter ? 1.05 : isNeighbor ? 0.92 : 0.82,
                  opacity: isCenter ? 1 : isNeighbor ? 0.65 : 0.35,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut"
                }}
                className={`shrink-0 w-[300px] sm:w-[340px] h-[320px] p-6 rounded-3xl bg-[#0b1120] border transition-shadow duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                  isCenter
                    ? "border-[#1D63FF]/70 bg-[#0f172a] shadow-2xl shadow-[#1D63FF]/30 ring-1 ring-[#1D63FF]/50"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                {/* Active Top Glowing Accent Bar */}
                {isCenter && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FFCE32] to-transparent" />
                )}

                {/* Card Top: Category Badge & Model Index */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase font-bold font-mono px-2.5 py-0.5 rounded-full bg-[#1D63FF]/20 text-[#1D63FF] border border-[#1D63FF]/30">
                      {model.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      #{index + 1} of {count}
                    </span>
                  </div>

                  {/* Model Name */}
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug line-clamp-1">
                    {model.name}
                  </h3>

                  {/* Latency & Provider */}
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] font-mono text-slate-400">
                    <span className="text-[#FFCE32] flex items-center gap-1 font-semibold">
                      <Zap className="w-3 h-3" />
                      {model.latencyAvg || "Fast"}
                    </span>
                    <span>•</span>
                    <span className="truncate">{model.provider}</span>
                  </div>

                  {/* Simplified One-Line Purpose */}
                  <p className="text-xs text-slate-300 mt-3 line-clamp-3 leading-relaxed font-normal">
                    {model.description}
                  </p>
                </div>

                {/* Card Bottom: Action Buttons */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onTryModel) onTryModel(model.id);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#1D63FF] to-[#1447b8] hover:from-[#2568ff] hover:to-[#174ec7] text-white text-xs font-bold shadow-md shadow-[#1D63FF]/30 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-[#FFCE32] fill-[#FFCE32]" />
                    <span>Try Model</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenDetails) onOpenDetails(model);
                    }}
                    className="py-2 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>More Info</span>
                    <ArrowRight className="w-3 h-3 text-[#FFCE32]" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Pagination Sliding Dots Indicator */}
      <div className="flex items-center justify-center gap-2 mt-2">
        {models.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === currentIndex
                ? "w-8 h-2 bg-[#FFCE32] shadow-sm shadow-[#FFCE32]/50"
                : "w-2 h-2 bg-white/20 hover:bg-white/50"
            }`}
            aria-label={`Slide to model ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
