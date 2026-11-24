export type Modality = "text" | "image" | "audio" | "video";
export type Capability = "reasoning" | "tools" | "vision" | "code" | "json" | "streaming";

export interface Lab {
  id: string;
  name: string;
  country: string;
  founded: number;
  description: string;
}

export interface Provider {
  id: string;
  name: string;
  url: string;
}

export interface ModelBenchmarks {
  mmlu: number;
  humaneval: number;
  gpqa: number;
  arena: number;
}

export interface Model {
  id: string;
  name: string;
  labId: string;
  type: "chat" | "embedding" | "image" | "audio";
  release: string;
  context: number;
  inputPrice: number;
  outputPrice: number;
  modalities: Modality[];
  capabilities: Capability[];
  providers: string[];
  benchmarks: ModelBenchmarks;
  description: string;
  openWeights: boolean;
}

export const labs: Lab[] = [
  {
    id: "openai",
    name: "OpenAI",
    country: "USA",
    founded: 2015,
    description:
      "Creators of the GPT series, ChatGPT, and pioneering reinforcement learning models.",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    country: "USA",
    founded: 2021,
    description: "AI safety and research company behind the constitutional Claude model family.",
  },
  {
    id: "google",
    name: "Google DeepMind",
    country: "UK / USA",
    founded: 2010,
    description: "Pioneering research lab behind Gemini multimodal architectures and AlphaFold.",
  },
  {
    id: "meta",
    name: "Meta AI",
    country: "USA",
    founded: 2013,
    description:
      "Champion of open-weights foundational research and the ubiquitous Llama ecosystem.",
  },
  {
    id: "mistral",
    name: "Mistral AI",
    country: "France",
    founded: 2023,
    description:
      "European frontier lab shipping high-efficiency open and specialized commercial weights.",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    country: "China",
    founded: 2023,
    description:
      "Breakthrough open reasoning models with ultra-efficient mixture-of-experts architectures.",
  },
  {
    id: "xai",
    name: "xAI",
    country: "USA",
    founded: 2023,
    description:
      "Frontier research organization developing the Grok reasoning and multimodal systems.",
  },
  {
    id: "qwen",
    name: "Alibaba Qwen",
    country: "China",
    founded: 2023,
    description:
      "High-capability multilingual and reasoning open-weights models across diverse scales.",
  },
];

export const providers: Provider[] = [
  { id: "openai", name: "OpenAI API", url: "https://platform.openai.com" },
  { id: "anthropic", name: "Anthropic API", url: "https://console.anthropic.com" },
  { id: "vertex", name: "Google Vertex AI", url: "https://cloud.google.com/vertex-ai" },
  { id: "bedrock", name: "AWS Bedrock", url: "https://aws.amazon.com/bedrock" },
  { id: "azure", name: "Azure AI Foundry", url: "https://azure.microsoft.com" },
  { id: "together", name: "Together AI", url: "https://together.ai" },
  { id: "groq", name: "Groq LPU", url: "https://groq.com" },
  { id: "fireworks", name: "Fireworks AI", url: "https://fireworks.ai" },
];

export const models: Model[] = [
  {
    id: "gpt-5",
    name: "GPT-5",
    labId: "openai",
    type: "chat",
    release: "2025-08-07",
    context: 400_000,
    inputPrice: 1.25,
    outputPrice: 10.0,
    modalities: ["text", "image"],
    capabilities: ["reasoning", "tools", "vision", "code", "json", "streaming"],
    providers: ["openai", "azure"],
    benchmarks: { mmlu: 91.2, humaneval: 93.4, gpqa: 85.7, arena: 1440 },
    description:
      "OpenAI's flagship unified reasoning model with deep multi-step thinking and tool execution.",
    openWeights: false,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o mini",
    labId: "openai",
    type: "chat",
    release: "2024-07-18",
    context: 128_000,
    inputPrice: 0.15,
    outputPrice: 0.6,
    modalities: ["text", "image"],
    capabilities: ["tools", "vision", "json", "streaming"],
    providers: ["openai", "azure"],
    benchmarks: { mmlu: 82.0, humaneval: 87.2, gpqa: 40.2, arena: 1272 },
    description:
      "Compact, fast, and cost-effective multimodal model tailored for high-volume enterprise tasks.",
    openWeights: false,
  },
  {
    id: "text-embedding-3-large",
    name: "text-embedding-3-large",
    labId: "openai",
    type: "embedding",
    release: "2024-01-25",
    context: 8_191,
    inputPrice: 0.13,
    outputPrice: 0.0,
    modalities: ["text"],
    capabilities: [],
    providers: ["openai", "azure"],
    benchmarks: { mmlu: 0, humaneval: 0, gpqa: 0, arena: 0 },
    description:
      "High-dimension vector representations optimized for semantic search and dense retrieval RAG.",
    openWeights: false,
  },
  {
    id: "claude-opus-4-1",
    name: "Claude Opus 4.1",
    labId: "anthropic",
    type: "chat",
    release: "2025-08-05",
    context: 200_000,
    inputPrice: 15.0,
    outputPrice: 75.0,
    modalities: ["text", "image"],
    capabilities: ["reasoning", "tools", "vision", "code", "json", "streaming"],
    providers: ["anthropic", "bedrock", "vertex"],
    benchmarks: { mmlu: 90.5, humaneval: 94.1, gpqa: 80.9, arena: 1430 },
    description:
      "Anthropic's premier heavy intelligence engine built for complex research, orchestration, and software engineering.",
    openWeights: false,
  },
  {
    id: "claude-sonnet-4-5",
    name: "Claude Sonnet 4.5",
    labId: "anthropic",
    type: "chat",
    release: "2025-09-29",
    context: 200_000,
    inputPrice: 3.0,
    outputPrice: 15.0,
    modalities: ["text", "image"],
    capabilities: ["reasoning", "tools", "vision", "code", "json", "streaming"],
    providers: ["anthropic", "bedrock", "vertex"],
    benchmarks: { mmlu: 89.1, humaneval: 95.0, gpqa: 83.4, arena: 1438 },
    description:
      "Industry-leading coding performance and balanced throughput for agentic workflows.",
    openWeights: false,
  },
  {
    id: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    labId: "anthropic",
    type: "chat",
    release: "2025-10-15",
    context: 200_000,
    inputPrice: 1.0,
    outputPrice: 5.0,
    modalities: ["text", "image"],
    capabilities: ["tools", "vision", "code", "streaming"],
    providers: ["anthropic", "bedrock"],
    benchmarks: { mmlu: 84.0, humaneval: 89.0, gpqa: 62.0, arena: 1360 },
    description:
      "Near-instantaneous time-to-first-token model for customer support and real-time streaming.",
    openWeights: false,
  },
  {
    id: "gemini-2-5-pro",
    name: "Gemini 2.5 Pro",
    labId: "google",
    type: "chat",
    release: "2025-06-17",
    context: 1_048_576,
    inputPrice: 1.25,
    outputPrice: 10.0,
    modalities: ["text", "image", "audio", "video"],
    capabilities: ["reasoning", "tools", "vision", "code", "json", "streaming"],
    providers: ["vertex"],
    benchmarks: { mmlu: 89.8, humaneval: 90.1, gpqa: 86.4, arena: 1455 },
    description:
      "Native million-token multimodal engine capable of processing massive codebases, audio feeds, and hours of video.",
    openWeights: false,
  },
  {
    id: "gemini-2-5-flash",
    name: "Gemini 2.5 Flash",
    labId: "google",
    type: "chat",
    release: "2025-06-17",
    context: 1_048_576,
    inputPrice: 0.3,
    outputPrice: 2.5,
    modalities: ["text", "image", "audio", "video"],
    capabilities: ["reasoning", "tools", "vision", "json", "streaming"],
    providers: ["vertex"],
    benchmarks: { mmlu: 84.5, humaneval: 85.0, gpqa: 78.3, arena: 1405 },
    description:
      "Hybrid reasoning speedster supporting 1M tokens of multimodal context at low latency.",
    openWeights: false,
  },
  {
    id: "imagen-4",
    name: "Imagen 4",
    labId: "google",
    type: "image",
    release: "2025-05-20",
    context: 480,
    inputPrice: 0.0,
    outputPrice: 40.0,
    modalities: ["image"],
    capabilities: [],
    providers: ["vertex"],
    benchmarks: { mmlu: 0, humaneval: 0, gpqa: 0, arena: 0 },
    description:
      "Photorealistic text-to-image synthesis with accurate typography rendering and fine prompt alignment.",
    openWeights: false,
  },
  {
    id: "llama-4-maverick",
    name: "Llama 4 Maverick",
    labId: "meta",
    type: "chat",
    release: "2025-04-05",
    context: 1_000_000,
    inputPrice: 0.27,
    outputPrice: 0.85,
    modalities: ["text", "image"],
    capabilities: ["tools", "vision", "code", "json", "streaming"],
    providers: ["together", "groq", "fireworks", "bedrock"],
    benchmarks: { mmlu: 85.5, humaneval: 82.4, gpqa: 69.8, arena: 1330 },
    description:
      "Open-weights mixture-of-experts model supporting 1M tokens context and vision reasoning.",
    openWeights: true,
  },
  {
    id: "llama-3-3-70b",
    name: "Llama 3.3 70B",
    labId: "meta",
    type: "chat",
    release: "2024-12-06",
    context: 128_000,
    inputPrice: 0.59,
    outputPrice: 0.79,
    modalities: ["text"],
    capabilities: ["tools", "code", "json", "streaming"],
    providers: ["together", "groq", "fireworks", "bedrock", "azure"],
    benchmarks: { mmlu: 86.0, humaneval: 88.4, gpqa: 50.5, arena: 1290 },
    description:
      "The gold-standard open 70B instruction model matching early GPT-4 tier intelligence.",
    openWeights: true,
  },
  {
    id: "mistral-large-2",
    name: "Mistral Large 2",
    labId: "mistral",
    type: "chat",
    release: "2024-11-18",
    context: 128_000,
    inputPrice: 2.0,
    outputPrice: 6.0,
    modalities: ["text"],
    capabilities: ["tools", "code", "json", "streaming"],
    providers: ["azure", "bedrock", "vertex"],
    benchmarks: { mmlu: 84.0, humaneval: 92.0, gpqa: 48.6, arena: 1300 },
    description:
      "Mistral's flagship multilingual model with extensive reasoning, math, and code capabilities.",
    openWeights: true,
  },
  {
    id: "codestral",
    name: "Codestral",
    labId: "mistral",
    type: "chat",
    release: "2025-01-13",
    context: 256_000,
    inputPrice: 0.3,
    outputPrice: 0.9,
    modalities: ["text"],
    capabilities: ["code", "streaming"],
    providers: ["vertex", "azure"],
    benchmarks: { mmlu: 70.0, humaneval: 86.6, gpqa: 35.0, arena: 1240 },
    description:
      "Specialized code generation engine featuring fill-in-the-middle support across 80+ programming languages.",
    openWeights: false,
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    labId: "deepseek",
    type: "chat",
    release: "2025-01-20",
    context: 128_000,
    inputPrice: 0.55,
    outputPrice: 2.19,
    modalities: ["text"],
    capabilities: ["reasoning", "code", "streaming"],
    providers: ["together", "fireworks", "bedrock", "azure"],
    benchmarks: { mmlu: 90.8, humaneval: 90.2, gpqa: 71.5, arena: 1360 },
    description:
      "Open-weights reasoning powerhouse trained with pure reinforcement learning for math and algorithms.",
    openWeights: true,
  },
  {
    id: "deepseek-v3-1",
    name: "DeepSeek V3.1",
    labId: "deepseek",
    type: "chat",
    release: "2025-08-21",
    context: 128_000,
    inputPrice: 0.27,
    outputPrice: 1.1,
    modalities: ["text"],
    capabilities: ["reasoning", "tools", "code", "json", "streaming"],
    providers: ["together", "fireworks"],
    benchmarks: { mmlu: 88.5, humaneval: 89.0, gpqa: 74.9, arena: 1380 },
    description:
      "Highly optimized mixture-of-experts general purpose model with multi-head latent attention.",
    openWeights: true,
  },
  {
    id: "grok-4",
    name: "Grok 4",
    labId: "xai",
    type: "chat",
    release: "2025-07-09",
    context: 256_000,
    inputPrice: 3.0,
    outputPrice: 15.0,
    modalities: ["text", "image"],
    capabilities: ["reasoning", "tools", "vision", "code", "json", "streaming"],
    providers: ["azure"],
    benchmarks: { mmlu: 87.0, humaneval: 88.0, gpqa: 87.5, arena: 1420 },
    description:
      "xAI's frontier multimodal system featuring rigorous mathematical verification and long context reasoning.",
    openWeights: false,
  },
  {
    id: "qwen3-235b",
    name: "Qwen3 235B",
    labId: "qwen",
    type: "chat",
    release: "2025-07-21",
    context: 262_144,
    inputPrice: 0.22,
    outputPrice: 0.88,
    modalities: ["text"],
    capabilities: ["reasoning", "tools", "code", "json", "streaming"],
    providers: ["together", "fireworks"],
    benchmarks: { mmlu: 87.8, humaneval: 87.0, gpqa: 77.5, arena: 1395 },
    description:
      "Massive open MoE model with native thinking mode and broad multilingual comprehension.",
    openWeights: true,
  },
  {
    id: "whisper-large-v3",
    name: "Whisper Large v3",
    labId: "openai",
    type: "audio",
    release: "2023-11-06",
    context: 0,
    inputPrice: 0.006,
    outputPrice: 0.0,
    modalities: ["audio"],
    capabilities: [],
    providers: ["openai", "groq", "together"],
    benchmarks: { mmlu: 0, humaneval: 0, gpqa: 0, arena: 0 },
    description:
      "High-accuracy automatic speech recognition and translation across 99 languages (price billed per minute).",
    openWeights: true,
  },
];
