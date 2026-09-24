import express from "express";
import { getExperiments, saveExperiment, deleteExperiment, toggleFavoriteExperiment } from "../services/experimentStore.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, task, category, favoriteOnly } = req.query;
    const list = await getExperiments({
      search,
      task,
      category,
      favoriteOnly: favoriteOnly === "true"
    });
    res.json({ success: true, count: list.length, experiments: list });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const saved = await saveExperiment(req.body);
    res.status(201).json({ success: true, experiment: saved });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await deleteExperiment(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch("/:id/favorite", async (req, res) => {
  try {
    const updated = await toggleFavoriteExperiment(req.params.id);
    if (!updated) {
      return res.status(404).json({ success: false, error: "Experiment not found" });
    }
    res.json({ success: true, experiment: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
