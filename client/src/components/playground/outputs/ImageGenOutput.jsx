import React, { useState } from "react";
import { Download, Maximize2, RefreshCw, X, ImageIcon } from "lucide-react";
import { useToast } from "../../common/Toast";

export function ImageGenOutput({ result, onRegenerate }) {
  const { addToast } = useToast();
  const [isZoomed, setIsZoomed] = useState(false);

  const imgUrl = result?.imageUrl || result?.imageDataUrl;
  const prompt = result?.prompt || "FLUX.1 Schnell Generated Visual";

  const handleDownload = () => {
    if (!imgUrl) return;
    const a = document.createElement("a");
    a.href = imgUrl;
    a.download = `modelforge-flux-${Date.now()}.png`;
    a.click();
    addToast("Image downloaded successfully", "success");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <ImageIcon className="w-3.5 h-3.5 text-[#FFCE32]" />
            FLUX.1-schnell Latent Synthesis
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1D63FF]/20 text-[#1D63FF] border border-[#1D63FF]/30 font-mono">
            4 Inference Steps
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs border border-white/10 transition-colors font-mono"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
          )}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 py-1 px-3 rounded-lg bg-[#1D63FF] hover:bg-[#2568ff] text-white text-xs font-bold shadow-md shadow-[#1D63FF]/30 transition-all font-mono"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download High-Res</span>
          </button>
        </div>
      </div>

      {/* Generated Image Container */}
      <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-black/60 group max-h-[460px] flex items-center justify-center">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={prompt}
            className="w-full h-auto max-h-[460px] object-contain rounded-2xl"
          />
        ) : (
          <div className="p-12 text-slate-400 text-xs font-mono">No image generated yet.</div>
        )}

        <button
          onClick={() => setIsZoomed(true)}
          className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
          title="Zoom image"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Fullscreen Zoom Modal */}
      {isZoomed && imgUrl && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={imgUrl}
            alt={prompt}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-white/20"
          />
        </div>
      )}
    </div>
  );
}
