import express from "express";
import multer from "multer";
import { MODELS, getModelById } from "../config/models.js";
import { runModelInference } from "../services/hfService.js";
import { saveExperiment } from "../services/experimentStore.js";

const router = express.Router();
const upload = multer({ limits: { fileSize: 25 * 1024 * 1024 } }); // 25MB max upload

// Get all models with optional category / search filtering
router.get("/", (req, res) => {
  const { category, task, search } = req.query;
  let list = [...MODELS];

  if (category && category !== "All") {
    list = list.filter(m => m.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (task && task !== "All") {
    list = list.filter(m => m.task.toLowerCase().includes(task.toLowerCase()));
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json({
    success: true,
    count: list.length,
    models: list
  });
});

// Get single model details
router.get("/:id(*)", (req, res) => {
  const modelId = req.params.id;
  const model = getModelById(modelId);
  if (!model) {
    return res.status(404).json({ success: false, error: `Model '${modelId}' not found.` });
  }
  res.json({ success: true, model });
});

// Run single model inference
router.post("/:id(*)/run", upload.single("file"), async (req, res) => {
  try {
    const modelId = req.params.id;
    const model = getModelById(modelId);
    if (!model) {
      return res.status(404).json({ success: false, error: `Model '${modelId}' not found.` });
    }

    const payload = req.body?.input || req.body || {};
    const { prompt, imageUrl, imageBase64, audioBase64, parameters, autoSave } = payload;

    let finalImageBase64 = imageBase64;
    let finalAudioBase64 = audioBase64;

    if (req.file) {
      const mime = req.file.mimetype;
      const b64 = req.file.buffer.toString("base64");
      if (mime.startsWith("image/")) {
        finalImageBase64 = `data:${mime};base64,${b64}`;
      } else if (mime.startsWith("audio/")) {
        finalAudioBase64 = `data:${mime};base64,${b64}`;
      }
    }

    const inputData = {
      prompt: prompt || "",
      imageUrl: imageUrl || "",
      imageBase64: finalImageBase64,
      audioBase64: finalAudioBase64,
      parameters: typeof parameters === "string" ? JSON.parse(parameters) : parameters || {}
    };

    const result = await runModelInference(model, inputData);

    // Auto-save experiment if requested or default true
    let savedExp = null;
    if (autoSave !== false && autoSave !== "false") {
      savedExp = await saveExperiment({
        modelId: model.id,
        inputData,
        outputData: result.output,
        executionTimeMs: result.executionTimeMs,
        status: "success"
      });
    }

    res.json({
      ...result,
      savedExperimentId: savedExp?.id || null
    });
  } catch (error) {
    console.error("[Run Model Error]:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to execute model inference"
    });
  }
});

// Compare multiple models side-by-side with the same input
router.post("/compare/benchmark", async (req, res) => {
  try {
    const { modelIds = [], inputData = {} } = req.body;
    if (!Array.isArray(modelIds) || modelIds.length === 0) {
      return res.status(400).json({ success: false, error: "Please provide an array of modelIds to compare." });
    }

    const tasks = modelIds.map(async (id) => {
      const model = getModelById(id);
      if (!model) return { modelId: id, error: "Model not found" };
      const start = Date.now();
      const res = await runModelInference(model, inputData);
      return {
        modelId: model.id,
        modelName: model.name,
        task: model.task,
        category: model.category,
        provider: model.provider,
        output: res.output,
        executionTimeMs: res.executionTimeMs || (Date.now() - start),
        isSimulated: res.isSimulated,
        timestamp: res.timestamp
      };
    });

    const results = await Promise.all(tasks);

    res.json({
      success: true,
      comparisonCount: results.length,
      inputUsed: inputData,
      results
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
