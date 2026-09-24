import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import modelRoutes from "./routes/modelRoutes.js";
import experimentRoutes from "./routes/experimentRoutes.js";
import workflowRoutes from "./routes/workflowRoutes.js";
import codeRoutes from "./routes/codeRoutes.js";
import { MODELS } from "./config/models.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// System Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ModelForge AI Inference & Experimentation Gateway",
    version: "1.0.0",
    modelsLoaded: MODELS.length,
    hfTokenConfigured: Boolean(process.env.HF_TOKEN && process.env.HF_TOKEN.length > 5),
    supabaseConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use("/api/models", modelRoutes);
app.use("/api/experiments", experimentRoutes);
app.use("/api/workflows", workflowRoutes);
app.use("/api/code-snippet", codeRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Endpoint not found: ${req.method} ${req.path}` });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err);
  res.status(500).json({ success: false, error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`\n🚀 ModelForge Server running on http://localhost:${PORT}`);
  console.log(`📡 Ready for AI Model Experimentation across 10 Hugging Face models\n`);
});
