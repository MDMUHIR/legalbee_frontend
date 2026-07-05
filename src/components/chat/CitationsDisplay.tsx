import { BookOpen, ChevronDown } from "lucide-react";
import type { RetrievedChunk } from "@/types/api";
import { t, type UILang } from "@/lib/i18n";

interface CitationsDisplayProps {
  citations: string[];
  retrievedChunks?: RetrievedChunk[];
  lang?: UILang;
}

function getScoreColor(score: number): string {
  if (score >= 0.8) return "bg-green-500";
  if (score >= 0.6) return "bg-yellow-500";
  return "bg-orange-500";
}

export function CitationsDisplay({
  citations,
  retrievedChunks,
  lang = "en",
}: CitationsDisplayProps) {
  if (!citations || citations.length === 0) return null;

  const groupedByAct: Record<string, RetrievedChunk[]> = {};
  if (retrievedChunks) {
    for (const chunk of retrievedChunks) {
      const key = chunk.act_name || "Other";
      if (!groupedByAct[key]) groupedByAct[key] = [];
      groupedByAct[key].push(chunk);
    }
  }

  const hasGroupedChunks = Object.keys(groupedByAct).length > 0;

  return (
    <details className="group">
      <summary className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors py-1 select-none">
        <BookOpen className="h-3.5 w-3.5" />
        <span className="font-medium">
          {t("sources", lang)} ({citations.length})
        </span>
        <ChevronDown className="h-3 w-3 group-open:rotate-180 transition-transform duration-200" />
      </summary>

      <div className="mt-2.5 space-y-3 pl-5">
        {hasGroupedChunks ? (
          Object.entries(groupedByAct).map(([actName, chunks]) => (
            <div key={actName} className="space-y-1.5">
              <h4 className="text-xs font-semibold text-foreground/80 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {actName}
                <span className="text-muted-foreground font-normal">
                  ({chunks.length}{" "}
                  {chunks.length === 1 || lang === "bn"
                    ? t("chunk", lang)
                    : t("chunks", lang)}
                  )
                </span>
              </h4>
              {chunks.map((chunk, idx) => (
                <div
                  key={chunk.chunk_id || idx}
                  className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2 border border-border/40"
                >
                  <p className="leading-relaxed line-clamp-3">{chunk.text}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-muted-foreground/70">
                      {t("relevance", lang)}:
                    </span>
                    <div className="h-1.5 flex-1 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${getScoreColor(chunk.score)}`}
                        style={{ width: `${Math.round(chunk.score * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground/70 min-w-[3ch]">
                      {Math.round(chunk.score * 100)}%
                    </span>
                  </div>
                  {chunk.citation && (
                    <p className="text-[10px] text-muted-foreground/60 mt-1">
                      {t("citation", lang)}: {chunk.citation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))
        ) : (
          citations.map((citation, idx) => (
            <div
              key={idx}
              className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2 border border-border/40 leading-relaxed"
            >
              {citation}
            </div>
          ))
        )}
      </div>
    </details>
  );
}
