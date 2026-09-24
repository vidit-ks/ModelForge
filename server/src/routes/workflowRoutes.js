import express from "express";
import { getWorkflows, saveWorkflow, executeWorkflowGraph } from "../services/workflowEngine.js";

const router = express.Router();

router.get("/", (req, res) => {
  try {
    const workflows = getWorkflows();
    res.json({ success: true, count: workflows.length, workflows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/", (req, res) => {
  try {
    const saved = saveWorkflow(req.body);
    res.status(201).json({ success: true, workflow: saved });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/run", async (req, res) => {
  try {
    const result = await executeWorkflowGraph(req.body);
    res.json(result);
  } catch (error) {
    console.error("[Workflow Execution Error]:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
