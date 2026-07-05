export interface ChatSession {
  id: string;
  title: string;
  preview: string;
  timestamp: number;
  messages: Array<{
    id: string;
    text: string;
    isUser: boolean;
    timestamp: number;
    citations?: string[];
    confidence?: "high" | "medium" | "low" | null;
  }>;
}

const STORAGE_KEY = "legalbee-chat-history";

export function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, 50)));
}
