import { supabase } from "../config/supabase.js";
import { MODELS } from "../config/models.js";

// In-memory initial seed experiments
let inMemoryExperiments = [
  {
    id: "exp_seed_1",
    modelId: "openai/gpt-oss-120b",
    modelName: "GPT-OSS 120B",
    task: "text-generation",
    category: "LLM & Reasoning",
    inputData: { prompt: "Explain how distributed vector databases perform approximate nearest neighbor search." },
    outputData: {
      text: "Distributed vector databases partition high-dimensional vector spaces using techniques such as Hierarchical Navigable Small World (HNSW) graphs and Inverted File with Product Quantization (IVF-PQ). By trading negligible precision for orders-of-magnitude speedups, query vectors traverse graph layers in sub-5ms latency across billions of records.",
      tokensGenerated: 62
    },
    executionTimeMs: 1140,
    status: "success",
    isFavorite: true,
    tags: ["LLM", "Vector DB", "Search"],
    createdAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString()
  },
  {
    id: "exp_seed_2",
    modelId: "facebook/detr-resnet-50",
    modelName: "DETR ResNet-50",
    task: "object-detection",
    category: "Vision",
    inputData: { imageUrl: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=700&auto=format&fit=crop&q=80" },
    outputData: {
      totalDetected: 4,
      objects: [
        { label: "person", score: 0.9842, box: { xmin: 45, ymin: 120, xmax: 280, ymax: 560 } },
        { label: "laptop", score: 0.9621, box: { xmin: 240, ymin: 310, xmax: 480, ymax: 490 } }
      ]
    },
    executionTimeMs: 580,
    status: "success",
    isFavorite: true,
    tags: ["Vision", "DETR", "Objects"],
    createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString()
  },
  {
    id: "exp_seed_3",
    modelId: "distilbert/distilbert-base-uncased-finetuned-sst-2-english",
    modelName: "DistilBERT SST-2",
    task: "text-classification",
    category: "Classification",
    inputData: { prompt: "The neural rendering latency dropped by 74% with zero loss in visual accuracy!" },
    outputData: {
      topLabel: "POSITIVE",
      topScore: 0.9984,
      scores: [
        { label: "POSITIVE", score: 0.9984, percentage: "99.8%" },
        { label: "NEGATIVE", score: 0.0016, percentage: "0.2%" }
      ]
    },
    executionTimeMs: 110,
    status: "success",
    isFavorite: false,
    tags: ["Sentiment", "Fast"],
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString()
  }
];

export async function getExperiments(filter = {}) {
  const { search, task, category, favoriteOnly } = filter;

  if (supabase) {
    try {
      let query = supabase.from("experiments").select("*").order("created_at", { ascending: false });
      if (task) query = query.eq("task", task);
      if (favoriteOnly) query = query.eq("is_favorite", true);
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn("Supabase query failed, falling back to local memory store:", err.message);
    }
  }

  let result = [...inMemoryExperiments];
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(e =>
      e.modelName.toLowerCase().includes(q) ||
      JSON.stringify(e.inputData).toLowerCase().includes(q) ||
      (e.tags && e.tags.some(t => t.toLowerCase().includes(q)))
    );
  }
  if (task) {
    result = result.filter(e => e.task === task);
  }
  if (category) {
    result = result.filter(e => e.category === category);
  }
  if (favoriteOnly) {
    result = result.filter(e => e.isFavorite);
  }

  return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function saveExperiment(experiment) {
  const model = MODELS.find(m => m.id === experiment.modelId) || { name: experiment.modelId, task: "custom", category: "AI" };
  const newExp = {
    id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    modelId: experiment.modelId,
    modelName: model.name,
    task: model.task,
    category: model.category,
    inputData: experiment.inputData,
    outputData: experiment.outputData,
    executionTimeMs: experiment.executionTimeMs || 300,
    status: experiment.status || "success",
    isFavorite: Boolean(experiment.isFavorite),
    tags: model.tags || ["AI Experiment"],
    createdAt: new Date().toISOString()
  };

  inMemoryExperiments.unshift(newExp);

  if (supabase) {
    try {
      await supabase.from("experiments").insert([{
        id: newExp.id,
        model_id: newExp.modelId,
        model_name: newExp.modelName,
        task: newExp.task,
        category: newExp.category,
        input_data: newExp.inputData,
        output_data: newExp.outputData,
        execution_time_ms: newExp.executionTimeMs,
        status: newExp.status,
        is_favorite: newExp.isFavorite,
        created_at: newExp.createdAt
      }]);
    } catch (err) {
      console.warn("Supabase insert error (fallback preserved):", err.message);
    }
  }

  return newExp;
}

export async function deleteExperiment(id) {
  inMemoryExperiments = inMemoryExperiments.filter(e => e.id !== id);
  if (supabase) {
    try {
      await supabase.from("experiments").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase delete warning:", err.message);
    }
  }
  return { success: true, id };
}

export async function toggleFavoriteExperiment(id) {
  const exp = inMemoryExperiments.find(e => e.id === id);
  if (exp) {
    exp.isFavorite = !exp.isFavorite;
    if (supabase) {
      try {
        await supabase.from("experiments").update({ is_favorite: exp.isFavorite }).eq("id", id);
      } catch (err) {
        console.warn("Supabase update favorite warning:", err.message);
      }
    }
    return exp;
  }
  return null;
}
