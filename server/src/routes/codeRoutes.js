import express from "express";
import { generateCodeSnippets } from "../services/codeSnippetGenerator.js";

const router = express.Router();

router.post("/generate", (req, res) => {
  try {
    const { modelId, sampleInput } = req.body;
    const result = generateCodeSnippets(modelId, sampleInput);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
