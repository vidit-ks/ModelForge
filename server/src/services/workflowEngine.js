import { MODELS } from "../config/models.js";
import { runModelInference } from "./hfService.js";
import { supabase } from "../config/supabase.js";

// Pre-built starter workflow templates
export const WORKFLOW_TEMPLATES = [
  {
    id: "wf_vision_analysis",
    title: "Autonomous Visual Reasoning Pipeline",
    description: "Detects objects in an image, inspects the scene with Qwen2.5-VL, and generates a structured executive briefing with GPT-OSS 120B.",
    category: "Multimodal Vision",
    nodes: [
      { id: "node_1", type: "inputNode", position: { x: 50, y: 150 }, data: { label: "Scene Input", inputType: "image", defaultValue: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=700&auto=format&fit=crop&q=80" } },
      { id: "node_2", type: "modelNode", position: { x: 300, y: 100 }, data: { label: "DETR Object Detection", modelId: "facebook/detr-resnet-50" } },
      { id: "node_3", type: "modelNode", position: { x: 300, y: 320 }, data: { label: "Qwen2.5-VL Vision QA", modelId: "Qwen/Qwen2.5-VL-3B-Instruct", prompt: "Summarize workspace setup and count key items." } },
      { id: "node_4", type: "modelNode", position: { x: 620, y: 200 }, data: { label: "GPT-OSS 120B Reasoning", modelId: "openai/gpt-oss-120b", prompt: "Synthesize detected objects and scene findings into an ergonomic safety audit report." } },
      { id: "node_5", type: "outputNode", position: { x: 920, y: 200 }, data: { label: "Executive Report" } }
    ],
    edges: [
      { id: "e1-2", source: "node_1", target: "node_2", animated: true },
      { id: "e1-3", source: "node_1", target: "node_3", animated: true },
      { id: "e2-4", source: "node_2", target: "node_4", animated: true },
      { id: "e3-4", source: "node_3", target: "node_4", animated: true },
      { id: "e4-5", source: "node_4", target: "node_5", animated: true }
    ]
  },
  {
    id: "wf_audio_sentiment_summary",
    title: "Speech Intelligence & Global Translation",
    description: "Transcribes spoken voice audio via Whisper Large v3, performs sentiment analysis via DistilBERT, and translates the summary to French via OPUS-MT.",
    category: "Speech & NLP",
    nodes: [
      { id: "node_1", type: "inputNode", position: { x: 50, y: 200 }, data: { label: "Spoken Audio Input", inputType: "audio", defaultValue: "https://actions.google.com/sounds/v1/speech/voice_memo_1.ogg" } },
      { id: "node_2", type: "modelNode", position: { x: 320, y: 200 }, data: { label: "Whisper Speech-to-Text", modelId: "openai/whisper-large-v3" } },
      { id: "node_3", type: "modelNode", position: { x: 600, y: 100 }, data: { label: "DistilBERT Sentiment", modelId: "distilbert/distilbert-base-uncased-finetuned-sst-2-english" } },
      { id: "node_4", type: "modelNode", position: { x: 600, y: 320 }, data: { label: "OPUS-MT En->Fr", modelId: "Helsinki-NLP/opus-mt-en-fr" } },
      { id: "node_5", type: "outputNode", position: { x: 900, y: 200 }, data: { label: "Multilingual Intelligence" } }
    ],
    edges: [
      { id: "e1-2", source: "node_1", target: "node_2", animated: true },
      { id: "e2-3", source: "node_2", target: "node_3", animated: true },
      { id: "e2-4", source: "node_2", target: "node_4", animated: true },
      { id: "e3-5", source: "node_3", target: "node_5", animated: true },
      { id: "e4-5", source: "node_4", target: "node_5", animated: true }
    ]
  },
  {
    id: "wf_document_embedding_synthesis",
    title: "Semantic Embedding & Abstractive Summarizer",
    description: "Computes 384-dim dense semantic vector embeddings and generates a concise abstractive executive brief from raw documents.",
    category: "Knowledge & Vectors",
    nodes: [
      { id: "node_1", type: "inputNode", position: { x: 50, y: 180 }, data: { label: "Technical Document", inputType: "text", defaultValue: "Quantum computing represents a paradigm shift leveraging superposition and entanglement to solve combinatorial optimization problems." } },
      { id: "node_2", type: "modelNode", position: { x: 350, y: 80 }, data: { label: "BART Large CNN", modelId: "facebook/bart-large-cnn" } },
      { id: "node_3", type: "modelNode", position: { x: 350, y: 280 }, data: { label: "MiniLM Embeddings", modelId: "sentence-transformers/all-MiniLM-L6-v2" } },
      { id: "node_4", type: "outputNode", position: { x: 700, y: 180 }, data: { label: "Vectorized Knowledge Base" } }
    ],
    edges: [
      { id: "e1-2", source: "node_1", target: "node_2", animated: true },
      { id: "e1-3", source: "node_1", target: "node_3", animated: true },
      { id: "e2-4", source: "node_2", target: "node_4", animated: true },
      { id: "e3-4", source: "node_3", target: "node_4", animated: true }
    ]
  }
];

let savedUserWorkflows = [...WORKFLOW_TEMPLATES];

export async function getWorkflows() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from("workflows").select("*").order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return [...data, ...WORKFLOW_TEMPLATES];
      }
    } catch (err) {
      console.warn("Supabase workflow query failed, using templates:", err.message);
    }
  }
  return savedUserWorkflows;
}

export async function saveWorkflow(workflow) {
  const newWf = {
    ...workflow,
    id: workflow.id || `wf_${Date.now()}`,
    updatedAt: new Date().toISOString()
  };

  const existingIdx = savedUserWorkflows.findIndex(w => w.id === newWf.id);
  if (existingIdx >= 0) {
    savedUserWorkflows[existingIdx] = newWf;
  } else {
    savedUserWorkflows.unshift(newWf);
  }

  if (supabase) {
    try {
      await supabase.from("workflows").upsert([{
        id: newWf.id,
        title: newWf.title || "Custom AI Workflow",
        description: newWf.description || "",
        category: newWf.category || "Custom",
        nodes: newWf.nodes || [],
        edges: newWf.edges || [],
        updated_at: newWf.updatedAt
      }]);
    } catch (err) {
      console.warn("Supabase save workflow warning:", err.message);
    }
  }

  return newWf;
}

/**
 * Execute Workflow Graph
 */
export async function executeWorkflowGraph(workflowData) {
  const { nodes = [], edges = [], inputPayload = {} } = workflowData;
  const startTime = Date.now();
  const stepResults = {};
  const logs = [];

  logs.push({ timestamp: new Date().toISOString(), message: "Initializing ModelForge Workflow Pipeline Execution Engine..." });

  // 1. Process Input Nodes
  const inputNodes = nodes.filter(n => n.type === "inputNode" || n.data?.type === "input");
  for (const inNode of inputNodes) {
    const val = inputPayload[inNode.id] || inNode.data?.defaultValue || inNode.data?.value || "Default Workflow Input Payload";
    stepResults[inNode.id] = {
      type: inNode.data?.inputType || "text",
      value: val,
      status: "completed"
    };
    logs.push({ timestamp: new Date().toISOString(), nodeId: inNode.id, message: `Input ready: [${inNode.data?.label || inNode.id}]` });
  }

  // 2. Process Model Nodes in dependency / sequence order
  const modelNodes = nodes.filter(n => n.type === "modelNode" || n.data?.modelId);

  for (const mNode of modelNodes) {
    const modelId = mNode.data?.modelId;
    const model = MODELS.find(m => m.id === modelId);

    if (!model) {
      logs.push({ timestamp: new Date().toISOString(), nodeId: mNode.id, error: `Model ${modelId} not found` });
      continue;
    }

    logs.push({ timestamp: new Date().toISOString(), nodeId: mNode.id, message: `Running ${model.name} (${model.task})...` });

    // Gather inputs from upstream connected nodes
    const incomingEdges = edges.filter(e => e.target === mNode.id);
    let combinedInputText = mNode.data?.prompt || "";
    let combinedImageUrl = "";

    for (const edge of incomingEdges) {
      const parentResult = stepResults[edge.source];
      if (parentResult) {
        if (typeof parentResult.value === "string") {
          if (parentResult.value.startsWith("http") || parentResult.value.startsWith("data:image")) {
            combinedImageUrl = parentResult.value;
          } else {
            combinedInputText = combinedInputText ? `${combinedInputText}\n\n[Input from ${edge.source}]: ${parentResult.value}` : parentResult.value;
          }
        } else if (parentResult.output) {
          const stringifiedOutput = parentResult.output.text || parentResult.output.summaryText || parentResult.output.translatedText || parentResult.output.transcription || JSON.stringify(parentResult.output);
          combinedInputText = combinedInputText ? `${combinedInputText}\n\n[Upstream Output]: ${stringifiedOutput}` : stringifiedOutput;
        }
      }
    }

    if (!combinedInputText && model.sampleInputs?.[0]?.prompt) {
      combinedInputText = model.sampleInputs[0].prompt;
    }
    if (!combinedImageUrl && model.sampleInputs?.[0]?.imageUrl) {
      combinedImageUrl = model.sampleInputs[0].imageUrl;
    }

    const stepStart = Date.now();
    const inferenceResult = await runModelInference(model, {
      prompt: combinedInputText,
      imageUrl: combinedImageUrl
    });
    const stepDuration = Date.now() - stepStart;

    stepResults[mNode.id] = {
      modelId: model.id,
      modelName: model.name,
      task: model.task,
      inputUsed: combinedInputText || combinedImageUrl,
      output: inferenceResult.output,
      executionTimeMs: stepDuration,
      status: "completed"
    };

    logs.push({
      timestamp: new Date().toISOString(),
      nodeId: mNode.id,
      message: `Completed ${model.name} in ${stepDuration}ms.`
    });
  }

  const totalDuration = Date.now() - startTime;
  logs.push({ timestamp: new Date().toISOString(), message: `Workflow Pipeline finished successfully in ${totalDuration}ms.` });

  // Record workflow execution in Supabase if available
  if (supabase) {
    try {
      await supabase.from("workflow_executions").insert([{
        total_execution_time_ms: totalDuration,
        status: "completed",
        step_results: stepResults,
        logs: logs,
        completed_at: new Date().toISOString()
      }]);
    } catch (err) {
      // ignore
    }
  }

  return {
    success: true,
    totalExecutionTimeMs: totalDuration,
    stepResults,
    logs,
    completedAt: new Date().toISOString()
  };
}
