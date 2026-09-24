export const DEFAULT_MODELS = [
  {
    id: "openai/gpt-oss-120b",
    name: "GPT-OSS 120B",
    provider: "OpenAI / Hugging Face",
    task: "text-generation",
    category: "LLM & Reasoning",
    description: "An AI assistant that answers questions, writes code, solves problems, and creates detailed text based on your instructions.",
    inputType: "text",
    outputType: "text",
    latencyAvg: "~1.2s",
    contextLength: "128k tokens",
    tags: ["Chat & QA", "Coding", "Writing", "Problem Solving"],
    sampleInputs: [
      {
        title: "Explain a Concept",
        prompt: "Explain how solar panels work in simple words with real-life examples."
      },
      {
        title: "Coding Help",
        prompt: "Write a clean JavaScript function to find all prime numbers up to 100."
      }
    ],
    defaultParams: {
      temperature: 0.7,
      max_new_tokens: 512,
      top_p: 0.95
    }
  },
  {
    id: "distilbert/distilbert-base-uncased-finetuned-sst-2-english",
    name: "DistilBERT SST-2",
    provider: "DistilBERT",
    task: "text-classification",
    category: "Classification",
    description: "Reads any text or review and instantly tells you if the emotion is positive or negative with a confidence score.",
    inputType: "text",
    outputType: "classification",
    latencyAvg: "~120ms",
    contextLength: "512 tokens",
    tags: ["Sentiment", "Positive / Negative", "Reviews", "Fast"],
    sampleInputs: [
      {
        title: "Positive Feedback",
        prompt: "This application is super easy to use and saved me hours of manual work today!"
      },
      {
        title: "Unhappy Customer",
        prompt: "The package arrived 5 days late and the item inside was damaged."
      }
    ],
    defaultParams: {
      return_all_scores: true
    }
  },
  {
    id: "Helsinki-NLP/opus-mt-en-fr",
    name: "OPUS-MT English → French",
    provider: "Helsinki-NLP",
    task: "translation",
    category: "Translation",
    description: "Translates sentences, messages, and full paragraphs from English into natural, fluent French.",
    inputType: "text",
    outputType: "translation",
    latencyAvg: "~250ms",
    contextLength: "1024 tokens",
    tags: ["Translation", "English to French", "Languages", "Fast"],
    sampleInputs: [
      {
        title: "Friendly Greeting",
        prompt: "Hello my friend, have a wonderful and productive day!"
      },
      {
        title: "Travel Question",
        prompt: "Excuse me, where is the nearest train station and how much is a ticket?"
      }
    ],
    defaultParams: {
      max_length: 512
    }
  },
  {
    id: "facebook/bart-large-cnn",
    name: "BART Large CNN",
    provider: "Meta AI",
    task: "summarization",
    category: "Summarization",
    description: "Takes long articles, research documents, or news stories and creates a short, easy-to-read summary.",
    inputType: "text",
    outputType: "summary",
    latencyAvg: "~800ms",
    contextLength: "1024 tokens",
    tags: ["Summarizer", "Key Points", "News & Articles", "Meta AI"],
    sampleInputs: [
      {
        title: "Tech Article",
        prompt: "Artificial intelligence has transformed modern technology across healthcare, education, and finance. By analyzing vast amounts of data, machine learning algorithms can detect medical anomalies earlier than traditional methods, automate repetitive administrative tasks, and personalize learning experiences for students around the world."
      },
      {
        title: "Science News",
        prompt: "Space exploration has entered a new commercial era. Private aerospace companies and international agencies are developing reusable rocket boosters, deep-space communication satellites, and lunar base architectures to support long-duration human spaceflight."
      }
    ],
    defaultParams: {
      max_length: 130,
      min_length: 30,
      do_sample: false
    }
  },
  {
    id: "google/vit-base-patch16-224",
    name: "Vision Transformer (ViT-B/16)",
    provider: "Google Research",
    task: "image-classification",
    category: "Vision",
    description: "Looks at any uploaded photo and identifies what main object, animal, or vehicle is inside it.",
    inputType: "image",
    outputType: "classification",
    latencyAvg: "~350ms",
    contextLength: "224x224 px",
    tags: ["Photo Classifier", "Objects & Animals", "ImageNet", "Google"],
    sampleInputs: [
      {
        title: "Sample Golden Retriever",
        imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80"
      },
      {
        title: "Sample Sports Car",
        imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80"
      }
    ],
    defaultParams: {
      top_k: 5
    }
  },
  {
    id: "facebook/detr-resnet-50",
    name: "DETR ResNet-50",
    provider: "Meta AI",
    task: "object-detection",
    category: "Vision",
    description: "Finds and locates multiple objects (like dogs, people, chairs, or cars) in a photo and draws bounding boxes around them.",
    inputType: "image",
    outputType: "object-detection",
    latencyAvg: "~600ms",
    contextLength: "Variable resolution",
    tags: ["Object Locator", "Bounding Boxes", "Multiple Items", "Vision"],
    sampleInputs: [
      {
        title: "Street Traffic Scene",
        imageUrl: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=700&auto=format&fit=crop&q=80"
      },
      {
        title: "Office Desk Workspace",
        imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=700&auto=format&fit=crop&q=80"
      }
    ],
    defaultParams: {
      threshold: 0.85
    }
  },
  {
    id: "Qwen/Qwen2.5-VL-3B-Instruct",
    name: "Qwen2.5-VL 3B Instruct",
    provider: "Qwen / Alibaba",
    task: "visual-question-answering",
    category: "Multimodal",
    description: "Answers your questions about any picture, like reading text on signs, describing scenes, or explaining diagrams.",
    inputType: "multimodal",
    outputType: "text",
    latencyAvg: "~1.1s",
    contextLength: "32k tokens",
    tags: ["Image Q&A", "Read Photos", "Visual Reasoning", "Multimodal"],
    sampleInputs: [
      {
        title: "Electronics Setup",
        imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=700&auto=format&fit=crop&q=80",
        prompt: "What devices and equipment are visible in this workspace?"
      },
      {
        title: "Room Inspection",
        imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=700&auto=format&fit=crop&q=80",
        prompt: "Describe the lighting, chairs, and monitors in this room."
      }
    ],
    defaultParams: {
      max_tokens: 350,
      temperature: 0.2
    }
  },
  {
    id: "openai/whisper-large-v3",
    name: "Whisper Large v3",
    provider: "OpenAI / Hugging Face",
    task: "automatic-speech-recognition",
    category: "Audio",
    description: "Listens to audio or microphone voice recordings and types out the spoken words into clear text.",
    inputType: "audio",
    outputType: "transcription",
    latencyAvg: "~1.4s",
    contextLength: "Audio stream / 30s chunks",
    tags: ["Voice to Text", "Transcriber", "Microphone", "Speech"],
    sampleInputs: [
      {
        title: "Voice Memo Sample",
        audioUrl: "https://actions.google.com/sounds/v1/speech/voice_memo_1.ogg"
      }
    ],
    defaultParams: {
      return_timestamps: true
    }
  },
  {
    id: "sentence-transformers/all-MiniLM-L6-v2",
    name: "All-MiniLM-L6-v2",
    provider: "Sentence Transformers",
    task: "feature-extraction",
    category: "Embeddings",
    description: "Converts sentences into mathematical numbers (vectors) so search engines and apps can find similar text based on meaning.",
    inputType: "text",
    outputType: "embeddings",
    latencyAvg: "~80ms",
    contextLength: "256 tokens",
    tags: ["AI Search", "Similar Text", "Smart Lookup", "Fast"],
    sampleInputs: [
      {
        title: "Semantic Vector Search",
        prompt: "How to use AI models for search engines and recommendation systems."
      },
      {
        title: "Customer Support Query",
        prompt: "Where can I check the shipping status of my recent order?"
      }
    ],
    defaultParams: {
      dimensions: 384,
      normalize: true
    }
  },
  {
    id: "black-forest-labs/FLUX.1-schnell",
    name: "FLUX.1 [schnell]",
    provider: "Black Forest Labs",
    task: "text-to-image",
    category: "Generation",
    description: "Generates high-quality, colorful, and creative pictures from any text description you type.",
    inputType: "text",
    outputType: "image",
    latencyAvg: "~2.4s",
    contextLength: "Text prompt",
    tags: ["Image Generator", "Draw Pictures", "Creative Art", "FLUX"],
    sampleInputs: [
      {
        title: "Cyberpunk City",
        prompt: "A futuristic glowing city at night with flying cars, neon lights, and tall skyscrapers in cinematic 4k detail"
      },
      {
        title: "Cozy Cabin",
        prompt: "A cozy wooden cabin in a snowy pine forest with warm glowing windows and smoke coming from the chimney"
      }
    ],
    defaultParams: {
      width: 1024,
      height: 1024,
      num_inference_steps: 4,
      guidance_scale: 0.0
    }
  }
];
