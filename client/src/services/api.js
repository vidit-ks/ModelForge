const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api` 
  : "/api";

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch (err) {
    return { status: "offline", error: err.message };
  }
}

export async function fetchModels(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/models${query ? `?${query}` : ""}`);
  if (!res.ok) throw new Error("Failed to fetch models");
  return await res.json();
}

export async function fetchModelById(modelId) {
  const res = await fetch(`${API_BASE}/models/${modelId}`);
  if (!res.ok) throw new Error(`Model ${modelId} not found`);
  return await res.json();
}

export async function runModel(modelId, payload, isFormData = false) {
  let options = {
    method: "POST"
  };

  if (isFormData) {
    options.body = payload; // FormData object
  } else {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(payload);
  }

  const res = await fetch(`${API_BASE}/models/${modelId}/run`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to run model ${modelId}`);
  }
  return await res.json();
}

export async function compareModels(modelIds, inputData) {
  const res = await fetch(`${API_BASE}/models/compare/benchmark`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ modelIds, inputData })
  });
  if (!res.ok) throw new Error("Comparison benchmark failed");
  return await res.json();
}

export async function fetchExperiments(filters = {}) {
  const query = new URLSearchParams(filters).toString();
  const res = await fetch(`${API_BASE}/experiments${query ? `?${query}` : ""}`);
  if (!res.ok) throw new Error("Failed to fetch experiments");
  return await res.json();
}

export async function saveExperiment(experimentData) {
  const res = await fetch(`${API_BASE}/experiments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(experimentData)
  });
  if (!res.ok) throw new Error("Failed to save experiment");
  return await res.json();
}

export async function deleteExperiment(id) {
  const res = await fetch(`${API_BASE}/experiments/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Failed to delete experiment");
  return await res.json();
}

export async function toggleFavoriteExperiment(id) {
  const res = await fetch(`${API_BASE}/experiments/${id}/favorite`, {
    method: "PATCH"
  });
  if (!res.ok) throw new Error("Failed to toggle favorite");
  return await res.json();
}

export async function fetchWorkflows() {
  const res = await fetch(`${API_BASE}/workflows`);
  if (!res.ok) throw new Error("Failed to fetch workflows");
  return await res.json();
}

export async function saveWorkflow(workflowData) {
  const res = await fetch(`${API_BASE}/workflows`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workflowData)
  });
  if (!res.ok) throw new Error("Failed to save workflow");
  return await res.json();
}

export async function runWorkflow(workflowGraph) {
  const res = await fetch(`${API_BASE}/workflows/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workflowGraph)
  });
  if (!res.ok) throw new Error("Workflow execution failed");
  return await res.json();
}

export async function generateCode(modelId, sampleInput) {
  const res = await fetch(`${API_BASE}/code-snippet/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ modelId, sampleInput })
  });
  if (!res.ok) throw new Error("Failed to generate code snippets");
  return await res.json();
}
