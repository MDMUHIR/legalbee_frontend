const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://muhir-legalbee-api.hf.space";

export const config = {
  apiBaseUrl: API_BASE_URL,
  endpoints: {
    chat: `${API_BASE_URL}/api/chat`,
    search: `${API_BASE_URL}/api/search`,
    analyze: `${API_BASE_URL}/api/analyze`,
    summary: `${API_BASE_URL}/api/summary`,
    health: `${API_BASE_URL}/api/health`,
    languages: `${API_BASE_URL}/api/languages`,
  },
  defaultLanguage: "en" as const,
  defaultTopK: 8,
  defaultUserType: "general" as const,
} as const;
