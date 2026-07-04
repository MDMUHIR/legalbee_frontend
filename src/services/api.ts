import { config } from "@/lib/config";
import type {
  ChatRequest,
  ChatResponse,
  SearchRequest,
  SearchResponse,
  AnalyzeRequest,
  AnalyzeResponse,
  SummaryRequest,
  SummaryResponse,
  HealthResponse,
  LanguagesResponse,
  ApiErrorResponse,
} from "@/types/api";
import { ApiError } from "@/types/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let detail: string | undefined;
    try {
      const errorBody: ApiErrorResponse = await res.json();
      detail = errorBody.detail || errorBody.error;
    } catch {
      detail = res.statusText;
    }
    throw new ApiError(
      detail || `Request failed with status ${res.status}`,
      res.status,
      detail
    );
  }

  return res.json();
}

// POST /api/chat
export async function chat(payload: ChatRequest): Promise<ChatResponse> {
  return request<ChatResponse>(config.endpoints.chat, {
    method: "POST",
    body: JSON.stringify({
      question: payload.question,
      language: payload.language || config.defaultLanguage,
      user_type: payload.user_type || config.defaultUserType,
    }),
  });
}

// POST /api/search
export async function search(payload: SearchRequest): Promise<SearchResponse> {
  return request<SearchResponse>(config.endpoints.search, {
    method: "POST",
    body: JSON.stringify({
      query: payload.query,
      filters: payload.filters || {},
      language: payload.language || config.defaultLanguage,
      top_k: payload.top_k || config.defaultTopK,
    }),
  });
}

// POST /api/analyze
export async function analyze(
  payload: AnalyzeRequest
): Promise<AnalyzeResponse> {
  return request<AnalyzeResponse>(config.endpoints.analyze, {
    method: "POST",
    body: JSON.stringify({
      facts: payload.facts,
      language: payload.language || config.defaultLanguage,
    }),
  });
}

// POST /api/summary
export async function summary(
  payload: SummaryRequest
): Promise<SummaryResponse> {
  return request<SummaryResponse>(config.endpoints.summary, {
    method: "POST",
    body: JSON.stringify({
      act_name: payload.act_name,
      language: payload.language || config.defaultLanguage,
    }),
  });
}

// GET /api/health
export async function health(): Promise<HealthResponse> {
  return request<HealthResponse>(config.endpoints.health);
}

// GET /api/languages
export async function languages(): Promise<LanguagesResponse> {
  return request<LanguagesResponse>(config.endpoints.languages);
}

const api = {
  chat,
  search,
  analyze,
  summary,
  health,
  languages,
};

export default api;
