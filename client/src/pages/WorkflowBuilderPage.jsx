import React, { useState, useCallback, useMemo } from "react";
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Handle, 
  Position 
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { 
  Layers, 
  Play, 
  Save, 
  RotateCcw, 
  Plus, 
  Sparkles, 
  Cpu, 
  Image as ImageIcon, 
  Volume2, 
  FileText, 
  CheckCircle2, 
  Clock, 
  X,
  Zap,
  Terminal
} from "lucide-react";
import { runWorkflow, fetchWorkflows, saveWorkflow } from "../services/api";
import { useToast } from "../components/common/Toast";
import confetti from "canvas-confetti";

// Custom Input Node Component
const CustomInputNode = ({ data, id }) => {
  return (
    <div className="p-4 rounded-2xl bg-[#0b1120] border-2 border-[#1D63FF] shadow-xl text-white min-w-[200px] glass-panel">
      <div className="flex items-center gap-2 text-xs font-bold text-[#1D63FF] uppercase font-mono mb-2">
        {data.inputType === "image" ? <ImageIcon className="w-3.5 h-3.5" /> : data.inputType === "audio" ? <Volume2 className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
        <span>Ingress: {data.label || "Source Input"}</span>
      </div>
      <div className="text-xs text-slate-300 truncate max-w-[180px] font-mono bg-black/40 p-2 rounded-lg border border-white/5">
        {data.defaultValue || "Source Stream Data"}
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-[#FFCE32] border-2 border-black" />
    </div>
  );
};

// Custom Model Node Component
const CustomModelNode = ({ data, id }) => {
  return (
    <div className="p-4 rounded-2xl bg-[#0b1120] border-2 border-[#FFCE32]/70 shadow-xl text-white min-w-[230px] glass-panel group hover:border-[#FFCE32]">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-[#1D63FF] border-2 border-black" />
      <div className="flex items-center justify-between text-xs font-bold text-[#FFCE32] uppercase font-mono mb-1.5">
        <span className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5" />
          Model Layer
        </span>
        {data.status === "completed" && (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        )}
      </div>
      <div className="text-xs font-bold text-white mb-1 truncate">{data.label || data.modelId}</div>
      <div className="text-[10px] text-slate-400 truncate max-w-[200px] font-mono">
        {data.prompt || data.modelId}
      </div>
      {data.stepOutput && (
        <div className="mt-2 text-[10px] p-1.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 truncate">
          ✓ Output Ready
        </div>
      )}
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-[#FFCE32] border-2 border-black" />
    </div>
  );
};

// Custom Output Node Component
const CustomOutputNode = ({ data, id }) => {
  return (
    <div className="p-4 rounded-2xl bg-[#0b1120] border-2 border-emerald-500 shadow-xl text-white min-w-[200px] glass-panel">
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-[#FFCE32] border-2 border-black" />
      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase font-mono mb-1">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Output Terminal</span>
      </div>
      <div className="text-xs font-bold text-white truncate">{data.label || "Executive Report"}</div>
      <div className="text-[10px] text-slate-400 mt-1">Aggregated graph trace</div>
    </div>
  );
};

const initialNodes = [
  { id: "node_1", type: "inputNode", position: { x: 40, y: 150 }, data: { label: "Scene Input", inputType: "image", defaultValue: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=700" } },
  { id: "node_2", type: "modelNode", position: { x: 300, y: 80 }, data: { label: "DETR Object Detection", modelId: "facebook/detr-resnet-50" } },
  { id: "node_3", type: "modelNode", position: { x: 300, y: 280 }, data: { label: "Qwen2.5-VL Vision QA", modelId: "Qwen/Qwen2.5-VL-3B-Instruct", prompt: "Identify objects and describe workspace." } },
  { id: "node_4", type: "modelNode", position: { x: 620, y: 180 }, data: { label: "GPT-OSS 120B Reasoning", modelId: "openai/gpt-oss-120b", prompt: "Synthesize findings into an ergonomic report." } },
  { id: "node_5", type: "outputNode", position: { x: 920, y: 180 }, data: { label: "Executive Synthesis" } }
];

const initialEdges = [
  { id: "e1-2", source: "node_1", target: "node_2", animated: true, style: { stroke: "#1D63FF", strokeWidth: 2 } },
  { id: "e1-3", source: "node_1", target: "node_3", animated: true, style: { stroke: "#1D63FF", strokeWidth: 2 } },
  { id: "e2-4", source: "node_2", target: "node_4", animated: true, style: { stroke: "#FFCE32", strokeWidth: 2 } },
  { id: "e3-4", source: "node_3", target: "node_4", animated: true, style: { stroke: "#FFCE32", strokeWidth: 2 } },
  { id: "e4-5", source: "node_4", target: "node_5", animated: true, style: { stroke: "#10B981", strokeWidth: 2 } }
];

export function WorkflowBuilderPage({ models = [] }) {
  const { addToast } = useToast();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [activeStepResults, setActiveStepResults] = useState(null);

  const nodeTypes = useMemo(() => ({
    inputNode: CustomInputNode,
    modelNode: CustomModelNode,
    outputNode: CustomOutputNode
  }), []);

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "#FFCE32", strokeWidth: 2 } }, eds));
  }, [setEdges]);

  const handleRunWorkflow = async () => {
    setIsExecuting(true);
    setExecutionLogs([]);
    setActiveStepResults(null);

    try {
      addToast("Executing Multi-Model Workflow Pipeline...", "info");
      const res = await runWorkflow({ nodes, edges });
      setExecutionLogs(res.logs || []);
      setActiveStepResults(res.stepResults || {});
      addToast(`Workflow executed successfully in ${res.totalExecutionTimeMs}ms!`, "success");
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      console.error(err);
      addToast(err.message || "Pipeline execution failed", "error");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleLoadTemplate = (templateType) => {
    if (templateType === "speech") {
      setNodes([
        { id: "node_1", type: "inputNode", position: { x: 40, y: 180 }, data: { label: "Spoken Memo", inputType: "audio", defaultValue: "https://actions.google.com/sounds/v1/speech/voice_memo_1.ogg" } },
        { id: "node_2", type: "modelNode", position: { x: 300, y: 180 }, data: { label: "Whisper Speech-to-Text", modelId: "openai/whisper-large-v3" } },
        { id: "node_3", type: "modelNode", position: { x: 580, y: 80 }, data: { label: "DistilBERT Sentiment", modelId: "distilbert/distilbert-base-uncased-finetuned-sst-2-english" } },
        { id: "node_4", type: "modelNode", position: { x: 580, y: 280 }, data: { label: "OPUS-MT En->Fr", modelId: "Helsinki-NLP/opus-mt-en-fr" } },
        { id: "node_5", type: "outputNode", position: { x: 880, y: 180 }, data: { label: "Multilingual Brief" } }
      ]);
      setEdges([
        { id: "e1-2", source: "node_1", target: "node_2", animated: true, style: { stroke: "#1D63FF", strokeWidth: 2 } },
        { id: "e2-3", source: "node_2", target: "node_3", animated: true, style: { stroke: "#FFCE32", strokeWidth: 2 } },
        { id: "e2-4", source: "node_2", target: "node_4", animated: true, style: { stroke: "#FFCE32", strokeWidth: 2 } },
        { id: "e3-5", source: "node_3", target: "node_5", animated: true, style: { stroke: "#10B981", strokeWidth: 2 } },
        { id: "e4-5", source: "node_4", target: "node_5", animated: true, style: { stroke: "#10B981", strokeWidth: 2 } }
      ]);
      addToast("Loaded Speech Intelligence & Global Translation Pipeline", "info");
    } else if (templateType === "embeddings") {
      setNodes([
        { id: "node_1", type: "inputNode", position: { x: 40, y: 150 }, data: { label: "Technical Doc", inputType: "text", defaultValue: "Quantum computing algorithms accelerate optimization." } },
        { id: "node_2", type: "modelNode", position: { x: 320, y: 80 }, data: { label: "BART Summarization", modelId: "facebook/bart-large-cnn" } },
        { id: "node_3", type: "modelNode", position: { x: 320, y: 260 }, data: { label: "MiniLM Embeddings", modelId: "sentence-transformers/all-MiniLM-L6-v2" } },
        { id: "node_4", type: "outputNode", position: { x: 680, y: 160 }, data: { label: "Vectorized Knowledge Base" } }
      ]);
      setEdges([
        { id: "e1-2", source: "node_1", target: "node_2", animated: true, style: { stroke: "#1D63FF", strokeWidth: 2 } },
        { id: "e1-3", source: "node_1", target: "node_3", animated: true, style: { stroke: "#1D63FF", strokeWidth: 2 } },
        { id: "e2-4", source: "node_2", target: "node_4", animated: true, style: { stroke: "#10B981", strokeWidth: 2 } },
        { id: "e3-4", source: "node_3", target: "node_4", animated: true, style: { stroke: "#10B981", strokeWidth: 2 } }
      ]);
      addToast("Loaded Semantic Embedding & Abstractive Summarizer Pipeline", "info");
    }
  };

  const handleAddNode = (modelId) => {
    const model = models.find(m => m.id === modelId) || models[0];
    const newNode = {
      id: `node_${Date.now()}`,
      type: "modelNode",
      position: { x: 400 + Math.random() * 50, y: 150 + Math.random() * 50 },
      data: { label: model.name, modelId: model.id, prompt: model.sampleInputs?.[0]?.prompt || "" }
    };
    setNodes((nds) => [...nds, newNode]);
    addToast(`Added ${model.name} to graph canvas`, "success");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            Visual AI Orchestration Canvas
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Workflow Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Chain multiple AI models into autonomous pipelines. Drag, connect, and execute multi-modal graphs with real-time data piping.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset templates selector */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleLoadTemplate("speech")}
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-medium"
            >
              Preset: Speech → Fr
            </button>
            <button
              onClick={() => handleLoadTemplate("embeddings")}
              className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-medium"
            >
              Preset: Embeddings
            </button>
          </div>

          <button
            onClick={handleRunWorkflow}
            disabled={isExecuting}
            className="flex items-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-[#1D63FF] to-[#1447b8] hover:from-[#2568ff] hover:to-[#174ec7] text-white text-xs font-bold shadow-lg shadow-[#1D63FF]/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {isExecuting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 text-[#FFCE32] fill-[#FFCE32]" />
            )}
            <span>Execute Pipeline</span>
          </button>
        </div>
      </div>

      {/* Model Node Adder Ribbon */}
      <div className="p-3 rounded-2xl bg-[#0b1120] border border-white/10 flex items-center gap-2 overflow-x-auto glass-panel">
        <span className="text-[11px] font-bold font-mono text-slate-400 uppercase tracking-wider shrink-0 mr-2 flex items-center gap-1">
          <Plus className="w-3.5 h-3.5 text-[#FFCE32]" />
          Add Node:
        </span>
        {models.map((m) => (
          <button
            key={m.id}
            onClick={() => handleAddNode(m.id)}
            className="text-xs py-1 px-2.5 rounded-lg bg-white/5 hover:bg-[#1D63FF]/20 border border-white/10 hover:border-[#1D63FF]/40 text-slate-300 hover:text-white shrink-0 transition-all font-mono"
          >
            + {m.name}
          </button>
        ))}
      </div>

      {/* React Flow Canvas Container */}
      <div className="h-[520px] rounded-3xl border border-white/15 bg-[#060913] overflow-hidden shadow-2xl relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[#060913]"
        >
          <Background color="rgba(255, 255, 255, 0.05)" gap={20} size={1} />
          <Controls className="bg-[#0b1120] border border-white/15 fill-white rounded-xl shadow-xl" />
          <MiniMap nodeColor="#1D63FF" maskColor="rgba(6, 9, 19, 0.85)" className="rounded-xl border border-white/10" />
        </ReactFlow>
      </div>

      {/* Execution Telemetry Console Logs */}
      {executionLogs.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#0b1120] border border-white/10 glass-panel space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 border-b border-white/10 pb-2">
            <span className="flex items-center gap-2 text-white font-bold">
              <Terminal className="w-4 h-4 text-[#FFCE32]" />
              Pipeline Execution Trace Telemetry
            </span>
            <span className="text-[#FFCE32]">{executionLogs.length} Events Logged</span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {executionLogs.map((log, idx) => (
              <div key={idx} className="flex items-center gap-3 text-slate-300">
                <span className="text-slate-500 text-[10px]">[{log.timestamp.slice(11, 19)}]</span>
                <span className={log.error ? "text-red-400 font-bold" : log.message?.includes("Completed") ? "text-emerald-400" : "text-slate-300"}>
                  {log.message || log.error}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
