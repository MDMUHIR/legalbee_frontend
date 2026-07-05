import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SearchIcon, Filter, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { search as searchApi } from "@/services/api";
import type { SearchResponse } from "@/types/api";
import { detectLanguage, t, type UILang } from "@/lib/i18n";
import { CitationsDisplay } from "./CitationsDisplay";

const TOP_K_OPTIONS = [5, 8, 15, 25];

export function SearchTab() {
  const [query, setQuery] = useState("");
  const [filtersJson, setFiltersJson] = useState("");
  const [topK, setTopK] = useState("8");
  const [filterError, setFilterError] = useState("");
  const [language, setLanguage] = useState<"auto" | "en" | "bn">("auto");

  const resolveLanguage = useCallback(
    (text: string): "en" | "bn" | undefined => {
      if (language === "auto") return detectLanguage(text);
      return language;
    },
    [language],
  );

  const mutation = useMutation<SearchResponse, Error, void>({
    mutationFn: async () => {
      let filters = {};
      if (filtersJson.trim()) {
        try {
          filters = JSON.parse(filtersJson);
        } catch {
          throw new Error("Invalid JSON in filters");
        }
      }
      return searchApi({
        query,
        filters,
        top_k: parseInt(topK),
        language: resolveLanguage(query),
      });
    },
  });

  const lang: UILang =
    mutation.data && query
      ? detectLanguage(query) === "bn"
        ? "bn"
        : "en"
      : "en";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (filtersJson.trim()) {
      try {
        JSON.parse(filtersJson);
        setFilterError("");
      } catch {
        setFilterError("Invalid JSON format in filters field");
        return;
      }
    }

    mutation.mutate();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search-query" className="text-sm font-medium">
              {t("searchQuery", lang)}
            </Label>
            <div className="flex gap-2">
              <Input
                id="search-query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchPlaceholder", lang)}
                className="flex-1"
              />
              <Button type="submit" disabled={mutation.isPending || !query.trim()}>
                <SearchIcon className="h-4 w-4 mr-2" />
                {t("search", lang)}
              </Button>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="filters-json" className="text-sm font-medium flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5" />
                {t("jsonFilters", lang)}
              </Label>
              <Textarea
                id="filters-json"
                value={filtersJson}
                onChange={(e) => {
                  setFiltersJson(e.target.value);
                  setFilterError("");
                }}
                placeholder='{"act_name": "Penal Code", "year": 1860}'
                className="font-mono text-xs h-20 resize-none"
              />
              {filterError && (
                <p className="text-xs text-destructive">{filterError}</p>
              )}
            </div>

            <div className="w-32 space-y-2">
              <Label htmlFor="top-k" className="text-sm font-medium">
                {t("results", lang)}
              </Label>
              <Select value={topK} onValueChange={setTopK}>
                <SelectTrigger id="top-k">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {TOP_K_OPTIONS.map((k) => (
                    <SelectItem key={k} value={k.toString()}>
                      {k} results
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground">Language:</Label>
            <Select
              value={language}
              onValueChange={(val) => setLanguage(val as "auto" | "en" | "bn")}
            >
              <SelectTrigger className="h-8 w-[110px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="bn">বাংলা</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        {mutation.isPending && (
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/6" />
              <Skeleton className="h-3 w-3/6" />
            </CardContent>
          </Card>
        )}

        {mutation.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {mutation.error instanceof Error
                ? mutation.error.message
                : t("searchFailed", lang)}
            </AlertDescription>
          </Alert>
        )}

        {mutation.data && !mutation.isPending && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t("answer", lang)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="
                    prose prose-sm max-w-none dark:prose-invert
                    prose-headings:font-semibold
                    prose-p:text-sm prose-p:leading-relaxed prose-p:text-foreground/85
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-li:text-sm prose-li:text-foreground/85
                  "
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {mutation.data.answer}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>

            {mutation.data.retrieved_chunks &&
              mutation.data.retrieved_chunks.length > 0 && (
                <CitationsDisplay
                  citations={mutation.data.retrieved_chunks.map(
                    (c) => c.citation || c.text.slice(0, 80),
                  )}
                  retrievedChunks={mutation.data.retrieved_chunks}
                  lang={lang}
                />
              )}

            <p className="text-[11px] text-muted-foreground text-right">
              {mutation.data.execution_time_ms != null &&
                `${mutation.data.execution_time_ms}ms`}
              {mutation.data.timestamp &&
                ` · ${new Date(mutation.data.timestamp).toLocaleString()}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
