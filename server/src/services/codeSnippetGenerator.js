import { MODELS } from "../config/models.js";

export function generateCodeSnippets(modelId, sampleInput = "") {
  const model = MODELS.find(m => m.id === modelId) || MODELS[0];
  const promptText = sampleInput || model.sampleInputs?.[0]?.prompt || "Hello ModelForge!";

  const pythonSnippet = `import os
from huggingface_hub import InferenceClient

# Initialize Inference Client
# Set HF_TOKEN in your environment: export HF_TOKEN="your_huggingface_token"
client = InferenceClient(
    provider="auto",
    api_key=os.environ.get("HF_TOKEN")
)

# Execute Inference for ${model.name} (${model.id})
response = client.post(
    model="${model.id}",
    json={
        "inputs": ${JSON.stringify(promptText)},
        "parameters": ${JSON.stringify(model.defaultParams || {}, null, 8)}
    }
)

print("Inference Result:", response)`;

  const javascriptSnippet = `// Node.js or Browser using modern ES modules
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN);

async function runExperiment() {
  const response = await fetch("https://router.huggingface.co/hf-inference/models/${model.id}", {
    method: "POST",
    headers: {
      "Authorization": \`Bearer \${process.env.HF_TOKEN}\`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: ${JSON.stringify(promptText)},
      parameters: ${JSON.stringify(model.defaultParams || {}, null, 6)}
    })
  });

  const data = await response.json();
  console.log("ModelForge Telemetry Output:", data);
}

runExperiment();`;

  const curlSnippet = `curl https://router.huggingface.co/hf-inference/models/${model.id} \\
  -X POST \\
  -H "Authorization: Bearer $HF_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify({ inputs: promptText, parameters: model.defaultParams || {} })}'`;

  const modelForgeSdkSnippet = `// ModelForge Client SDK
import { ModelForge } from "@modelforge/sdk";

const forge = new ModelForge({
  endpoint: "http://localhost:5000/api",
  apiKey: process.env.MODELFORGE_API_KEY
});

// Run with automatic telemetry, latency benchmarking, and experiment persistence
const experiment = await forge.run({
  model: "${model.id}",
  input: {
    prompt: ${JSON.stringify(promptText)}
  },
  saveExperiment: true
});

console.log("Latency:", experiment.executionTimeMs + "ms");
console.log("Output:", experiment.output);`;

  return {
    model: model.name,
    modelId: model.id,
    task: model.task,
    snippets: {
      python: pythonSnippet,
      javascript: javascriptSnippet,
      curl: curlSnippet,
      sdk: modelForgeSdkSnippet
    }
  };
}
