import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { 
  FlaskConical, 
  Play, 
  Cpu, 
  Clock, 
  Sliders, 
  Code2, 
  Scale, 
  Bookmark, 
  RotateCcw, 
  Zap, 
  Terminal,
  Activity,
  Layers,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { ModelSelector } from "../components/models/ModelSelector";
import { TextInput } from "../components/playground/inputs/TextInput";
import { ImageUploader } from "../components/playground/inputs/ImageUploader";
import { AudioRecorder } from "../components/playground/inputs/AudioRecorder";
import { LLMOutput } from "../components/playground/outputs/LLMOutput";
import { SentimentOutput } from "../components/playground/outputs/SentimentOutput";
import { TranslationOutput } from "../components/playground/outputs/TranslationOutput";
import { SummarizationOutput } from "../components/playground/outputs/SummarizationOutput";
import { ClassificationOutput } from "../components/playground/outputs/ClassificationOutput";
import { ObjectDetectionOutput } from "../components/playground/outputs/ObjectDetectionOutput";
import { VisionQAOutput } from "../components/playground/outputs/VisionQAOutput";
import { SpeechToTextOutput } from "../components/playground/outputs/SpeechToTextOutput";
import { EmbeddingsOutput } from "../components/playground/outputs/EmbeddingsOutput";
import { ImageGenOutput } from "../components/playground/outputs/ImageGenOutput";
import { runModel } from "../services/api";
import { useToast } from "../components/common/Toast";

export function PlaygroundPage({ models = [], activeModelId = null }) {
  const { addToast } = useToast();

  const initialModelId = activeModelId || models[0]?.id || "openai/gpt-oss-120b";
  const [selectedModelId, setSelectedModelId] = useState(initialModelId);

  useEffect(() => {
    if (activeModelId) {
      setSelectedModelId(activeModelId);
    }
  }, [activeModelId]);

  const currentModel = models.find(m => m.id === selectedModelId) || models[0];

  // Inputs state
  const [prompt, setPrompt] = useState("");
  const [imageState, setImageState] = useState({ imageUrl: "", imageBase64: "" });
  const [audioBase64, setAudioBase64] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(350);

  // Execution state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [executionTime, setExecutionTime] = useState(null);
  const [savedId, setSavedId] = useState(null);

  // Sync with URL & load default sample inputs on model change
  useEffect(() => {
    if (currentModel) {
      setResult(null);
      setExecutionTime(null);
      setSavedId(null);
      if (currentModel.sampleInputs?.[0]) {
        const sample = currentModel.sampleInputs[0];
        if (sample.prompt) setPrompt(sample.prompt);
        if (sample.imageUrl) setImageState({ imageUrl: sample.imageUrl, imageBase64: "" });
        if (sample.audioUrl) setAudioBase64(sample.audioUrl);
      }
    }
  }, [selectedModelId]);

  const handleModelChange = (id) => {
    setSelectedModelId(id);
    setSearchParams({ model: id });
  };

  const handleRun = async () => {
    if (!currentModel) return;
    setLoading(true);
    setResult(null);

    try {
      const payload = {
        prompt,
        imageUrl: imageState.imageUrl,
        imageBase64: imageState.imageBase64,
        audioBase64,
        parameters: {
          temperature,
          max_new_tokens: maxTokens,
          ...currentModel.defaultParams
        },
        autoSave: true
      };

      const response = await runModel(currentModel.id, payload);
      setResult(response.output);
      setExecutionTime(response.executionTimeMs);
      setSavedId(response.savedExperimentId);

      if (response.isSimulated && response.metadata?.notice) {
        addToast(response.metadata.notice, "info");
      } else {
        addToast(`Inference completed in ${response.executionTimeMs}ms`, "success");
      }
    } catch (err) {
      console.error("Execution error:", err);
      addToast(err.message || "Model execution failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Playground Header & Model Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center justify-between">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFCE32] uppercase tracking-wider mb-1 font-bold">
            <FlaskConical className="w-3.5 h-3.5" />
            Interactive AI Laboratory
          </div>
          <ModelSelector
            models={models}
            selectedModelId={selectedModelId}
            onSelectModel={handleModelChange}
          />
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-start lg:justify-end gap-2.5">
          <Link
            to={`/compare?modelA=${encodeURIComponent(selectedModelId)}`}
            className="flex items-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all"
            title="Benchmark in Comparison Arena"
          >
            <Scale className="w-4 h-4 text-[#FFCE32]" />
            <span>Compare Arena</span>
          </Link>

          <Link
            to={`/api-docs?model=${encodeURIComponent(selectedModelId)}`}
            className="flex items-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all"
            title="Generate API Code"
          >
            <Code2 className="w-4 h-4 text-[#1D63FF]" />
            <span>API Code</span>
          </Link>

          <Link
            to="/workflows"
            className="flex items-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all"
            title="Connect in Visual Workflow"
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Workflows</span>
          </Link>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* LEFT: Input Panel */}
        <div className="p-6 rounded-3xl bg-[#0b1120] border border-white/10 glass-panel space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Input Configuration
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#1D63FF]/20 text-[#1D63FF] font-mono font-semibold">
                {currentModel?.inputType?.toUpperCase()} STREAM
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                if (currentModel.sampleInputs?.[0]) {
                  setPrompt(currentModel.sampleInputs[0].prompt || "");
                  if (currentModel.sampleInputs[0].imageUrl) {
                    setImageState({ imageUrl: currentModel.sampleInputs[0].imageUrl, imageBase64: "" });
                  }
                  addToast("Loaded preset sample configuration", "info");
                }
              }}
              className="text-xs text-slate-400 hover:text-[#FFCE32] flex items-center gap-1 transition-colors font-mono"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Preset</span>
            </button>
          </div>

          {/* Model Description Box */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 leading-relaxed font-sans">
            <span className="font-bold text-[#FFCE32]">{currentModel?.name}: </span>
            {currentModel?.description}
          </div>

          {/* Conditional Modality Inputs */}
          {(currentModel?.inputType === "image" || currentModel?.inputType === "multimodal") && (
            <ImageUploader
              imageUrl={imageState.imageUrl}
              imageBase64={imageState.imageBase64}
              onChangeImage={setImageState}
              sampleImages={currentModel?.sampleInputs || []}
            />
          )}

          {currentModel?.inputType === "audio" && (
            <AudioRecorder
              audioBase64={audioBase64}
              onChangeAudio={setAudioBase64}
            />
          )}

          {(currentModel?.inputType === "text" || currentModel?.inputType === "multimodal") && (
            <TextInput
              value={prompt}
              onChange={setPrompt}
              sampleInputs={currentModel?.sampleInputs || []}
              onSelectSample={(text) => setPrompt(text)}
              placeholder={
                currentModel.id === "black-forest-labs/FLUX.1-schnell"
                  ? "Describe the visual image you wish to synthesize..."
                  : currentModel.id === "Qwen/Qwen2.5-VL-3B-Instruct"
                  ? "Ask a question about the uploaded image or scene..."
                  : "Enter prompt or input text here..."
              }
              label={
                currentModel.id === "black-forest-labs/FLUX.1-schnell"
                  ? "Image Generation Prompt"
                  : currentModel.id === "Qwen/Qwen2.5-VL-3B-Instruct"
                  ? "Visual Question / Instruction"
                  : "Input Prompt Text"
              }
            />
          )}

          {/* Parameters for LLM */}
          {currentModel?.task === "text-generation" && (
            <div className="pt-3 border-t border-white/10 space-y-3">
              <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5 font-mono">
                <Sliders className="w-3.5 h-3.5" />
                <span>Hyperparameters</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1 font-mono">
                    <span>Temperature</span>
                    <span className="text-[#FFCE32]">{temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.5"
                    step="0.05"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-[#1D63FF]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1 font-mono">
                    <span>Max Tokens</span>
                    <span className="text-[#1D63FF]">{maxTokens}</span>
                  </div>
                  <input
                    type="range"
                    min="64"
                    max="1024"
                    step="32"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="w-full accent-[#FFCE32]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Primary Run Trigger */}
          <button
            type="button"
            onClick={handleRun}
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#1D63FF] to-[#1447b8] hover:from-[#2568ff] hover:to-[#174ec7] text-white text-sm font-extrabold shadow-xl shadow-[#1D63FF]/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Executing {currentModel?.name}...</span>
              </div>
            ) : (
              <>
                <Play className="w-4 h-4 text-[#FFCE32] fill-[#FFCE32]" />
                <span>Execute Model Inference</span>
              </>
            )}
          </button>
        </div>

        {/* RIGHT: Output Panel */}
        <div className="p-6 rounded-3xl bg-[#0b1120] border border-white/10 glass-panel min-h-[460px] flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            {/* Telemetry Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Telemetry & Synthesis Output
              </span>

              {executionTime && (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  {executionTime}ms
                </span>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
                <div className="relative w-16 h-16">
                  <div className="w-16 h-16 rounded-2xl border-2 border-[#1D63FF]/30 border-t-[#FFCE32] animate-spin" />
                  <Cpu className="w-6 h-6 text-[#FFCE32] absolute inset-0 m-auto" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Executing Model Pipeline</h4>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">Connecting to inference provider...</p>
                </div>
              </div>
            )}

            {/* Output Components */}
            {!loading && result && (
              <div className="space-y-4">
                {currentModel.task === "text-generation" && (
                  <LLMOutput result={result} executionTimeMs={executionTime} />
                )}
                {currentModel.task === "text-classification" && (
                  <SentimentOutput result={result} />
                )}
                {currentModel.task === "translation" && (
                  <TranslationOutput result={result} />
                )}
                {currentModel.task === "summarization" && (
                  <SummarizationOutput result={result} />
                )}
                {currentModel.task === "image-classification" && (
                  <ClassificationOutput result={result} />
                )}
                {currentModel.task === "object-detection" && (
                  <ObjectDetectionOutput
                    result={result}
                    originalImage={imageState.imageBase64 || imageState.imageUrl}
                  />
                )}
                {currentModel.task === "visual-question-answering" && (
                  <VisionQAOutput result={result} />
                )}
                {currentModel.task === "automatic-speech-recognition" && (
                  <SpeechToTextOutput result={result} />
                )}
                {currentModel.task === "feature-extraction" && (
                  <EmbeddingsOutput result={result} />
                )}
                {currentModel.task === "text-to-image" && (
                  <ImageGenOutput result={result} onRegenerate={handleRun} />
                )}
              </div>
            )}

            {/* Empty State */}
            {!loading && !result && (
              <div className="py-24 text-center text-slate-400 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-500">
                  <Play className="w-5 h-5 text-[#FFCE32]" />
                </div>
                <div className="text-sm font-bold text-white">Ready for Experimentation</div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Configure the input payload on the left and click <strong>Execute Model Inference</strong> to view real-time latency and telemetry outputs.
                </p>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          {result && (
            <div className="pt-4 mt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Logged to experiment ledger</span>
              </div>
              <Link to="/experiments" className="text-[#FFCE32] hover:underline font-bold">
                View in Ledger →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
