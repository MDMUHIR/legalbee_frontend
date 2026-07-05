import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PanelLeftClose,
  PanelLeftOpen,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatSession } from "@/lib/chat-history";

function formatDate(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

interface ChatHistorySidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (session: ChatSession) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatHistorySidebar({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClearAll,
  isOpen,
  onToggle,
}: ChatHistorySidebarProps) {
  return (
    <>
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-2 z-10 h-8 w-8"
          onClick={onToggle}
          title="Open chat history"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </Button>
      )}

      <div
        className={cn(
          "flex flex-col border-r bg-card/50 transition-all duration-300 overflow-hidden",
          isOpen ? "w-72" : "w-0 border-r-0"
        )}
      >
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="text-sm font-semibold">Chat History</h3>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onNewChat}
              title="New chat"
            >
              <MessageSquare className="h-3.5 w-3.5" />
            </Button>
            {sessions.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={onClearAll}
                title="Clear all"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onToggle}
              title="Close sidebar"
            >
              <PanelLeftClose className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          {sessions.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8 px-4">
              No chat history yet. Start a conversation to see it here.
            </p>
          ) : (
            <div className="p-2 space-y-1">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  type="button"
                  onClick={() => onSelectSession(session)}
                  className={cn(
                    "w-full text-left rounded-lg px-3 py-2 transition-colors group",
                    currentSessionId === session.id
                      ? "bg-muted"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium truncate flex-1">
                      {session.title || "New Chat"}
                    </p>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {formatDate(session.timestamp)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 opacity-0 group-hover:opacity-100 shrink-0 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {session.preview}
                  </p>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
}
