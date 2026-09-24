import React, { useRef, useState } from "react";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";

export function ImageUploader({ imageBase64, imageUrl, onChangeImage, sampleImages = [] }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChangeImage({ imageBase64: event.target?.result, imageUrl: "" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChangeImage({ imageBase64: event.target?.result, imageUrl: "" });
      };
      reader.readAsDataURL(file);
    }
  };

  const activeDisplay = imageBase64 || imageUrl;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-mono">
          <ImageIcon className="w-3.5 h-3.5 text-[#FFCE32]" />
          Visual Input Stream
        </label>
        {activeDisplay && (
          <button
            type="button"
            onClick={() => onChangeImage({ imageBase64: "", imageUrl: "" })}
            className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 font-mono"
          >
            <X className="w-3 h-3" /> Clear Image
          </button>
        )}
      </div>

      {activeDisplay ? (
        <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-black/40 group max-h-72 flex items-center justify-center">
          <img
            src={activeDisplay}
            alt="Upload Preview"
            className="w-full h-auto max-h-72 object-contain rounded-2xl"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="py-1.5 px-3.5 rounded-xl bg-[#1D63FF] text-white text-xs font-semibold shadow-lg hover:bg-[#2568ff]"
            >
              Replace Image
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? "border-[#FFCE32] bg-[#FFCE32]/10"
              : "border-white/15 bg-white/5 hover:bg-white/10 hover:border-[#1D63FF]/50"
          }`}
        >
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-[#1D63FF]/20 to-[#FFCE32]/20 border border-white/10 text-[#FFCE32]">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">
              Drop image here, or <span className="text-[#1D63FF]">browse files</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">Supports PNG, JPG, WEBP</p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Preset sample images */}
      {sampleImages.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Preset Test Images:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {sampleImages.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChangeImage({ imageUrl: s.imageUrl, imageBase64: "" })}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 hover:bg-[#1D63FF]/20 border border-white/10 text-left transition-all group"
              >
                {s.imageUrl && (
                  <img
                    src={s.imageUrl}
                    alt={s.title}
                    className="w-10 h-10 object-cover rounded-lg border border-white/10 shrink-0"
                  />
                )}
                <div className="truncate">
                  <div className="text-xs font-semibold text-white group-hover:text-[#FFCE32] truncate">
                    {s.title}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">Click to load</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
