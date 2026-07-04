export interface Hierarchy {
  part: string;
  chapter: string;
  article: string;
  section: string;
  clause: string;
  sub_clause: string;
}

export interface RetrievedChunk {
  text: string;
  chunk_id: string;
  score: number;
  chunk_type: string;
  citation: string;
  act_name: string;
  year: number;
  hierarchy: Hierarchy;
  references: Reference[];
}

export interface Reference {
  type: string;
  target: string;
}

export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
}

// POST /api/chat
export interface ChatRequest {
  question: string;
  language?: "en" | "bn";
  user_type?: "lawyer" | "general";
}

export interface ChatResponse {
  question: string;
  answer: string;
  answer_markdown: string;
  language_detected: string;
  query_type: "law_search" | "fact_analysis" | "act_summary" | "amendment_question" | "legal_question";
  confidence: "high" | "medium" | "low";
  citations: string[];
  retrieved_chunks: RetrievedChunk[];
  references: Reference[];
  execution_time_ms: number;
  token_usage: TokenUsage;
  timestamp: string;
  error: string | null;
}

// POST /api/search
export interface SearchFilters {
  act_name?: string;
  year?: number;
  document_type?: string;
  language?: string;
  source_pdf?: string;
  chunk_type?: string;
  "hierarchy.section"?: string;
  "hierarchy.article"?: string;
  "hierarchy.chapter"?: string;
  "hierarchy.clause"?: string;
  "hierarchy.sub_clause"?: string;
}

export interface SearchRequest {
  query: string;
  filters?: SearchFilters;
  language?: "en" | "bn";
  top_k?: number;
}

export interface SearchResponse {
  query: string;
  answer: string;
  retrieved_chunks: RetrievedChunk[];
  execution_time_ms: number;
  timestamp: string;
}

// POST /api/analyze
export interface AnalyzeRequest {
  facts: string;
  language?: "en" | "bn";
}

export interface AnalyzeResponse {
  facts: string;
  answer: string;
  answer_markdown: string;
  citations: string[];
  retrieved_chunks: RetrievedChunk[];
  references: Reference[];
  execution_time_ms: number;
  timestamp: string;
}

// POST /api/summary
export interface SummaryRequest {
  act_name: string;
  language?: "en" | "bn";
}

export interface SummaryResponse {
  act_name: string;
  answer: string;
  answer_markdown: string;
  citations: string[];
  execution_time_ms: number;
  timestamp: string;
}

// GET /api/health
export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  timestamp: string;
}

// GET /api/languages
export interface SupportedLanguage {
  code: string;
  name: string;
}

export interface LanguagesResponse {
  supported_languages: SupportedLanguage[];
  note: string;
}

// Error response
export interface ApiErrorResponse {
  error: string;
  detail?: string;
  status_code?: number;
  timestamp?: string;
}

export class ApiError extends Error {
  statusCode: number;
  detail?: string;

  constructor(message: string, statusCode: number, detail?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.detail = detail;
  }
}
