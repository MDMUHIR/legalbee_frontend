import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { FileText, AlertCircle, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { summary as summaryApi } from "@/services/api";
import type { SummaryResponse } from "@/types/api";
import { detectLanguage, t, type UILang } from "@/lib/i18n";
import { CitationsDisplay } from "./CitationsDisplay";
import { toast } from "@/components/ui/use-toast";

export function SummaryTab() {
  const [actName, setActName] = useState("");
  const [language, setLanguage] = useState<"auto" | "en" | "bn">("auto");

  const resolveLanguage = useCallback(
    (text: string): "en" | "bn" | undefined => {
      if (language === "auto") return detectLanguage(text);
      return language;
    },
    [language],
  );

  const mutation = useMutation<SummaryResponse, Error, void>({
    mutationFn: async () => {
      return summaryApi({
        act_name: actName,
        language: resolveLanguage(actName),
      });
    },
  });

  const lang: UILang =
    actName && detectLanguage(actName) === "bn" ? "bn" : "en";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actName.trim()) return;
    mutation.mutate();
  };

  const copyAnswer = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: t("copied", lang),
        description: t("copiedMsg", lang),
        duration: 2000,
      });
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="act-name" className="text-sm font-medium">
              {t("actName", lang)}
            </Label>
            <div className="flex gap-2">
              <Input
                id="act-name"
                value={actName}
                onChange={(e) => setActName(e.target.value)}
                placeholder={t("actNamePlaceholder", lang)}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={mutation.isPending || !actName.trim()}
              >
                <FileText className="h-4 w-4 mr-2" />
                {t("summarize", lang)}
              </Button>
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
              <Skeleton className="h-4 w-44" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-3 w-full" />
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
                : t("summaryFailed", lang)}
            </AlertDescription>
          </Alert>
        )}

        {mutation.data && !mutation.isPending && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base">
                  {t("summary", lang)}: {mutation.data.act_name}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={() =>
                    copyAnswer(
                      mutation.data.answer_markdown || mutation.data.answer,
                    )
                  }
                >
                  <Copy className="h-3 w-3" />
                  {t("copy", lang)}
                </Button>
              </CardHeader>
              <CardContent>
                <div
                  className="
                    prose prose-sm max-w-none dark:prose-invert
                    prose-headings:font-semibold
                    prose-h2:text-base prose-h2:mt-4 prose-h2:mb-2
                    prose-p:text-sm prose-p:leading-relaxed prose-p:text-foreground/85
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-blockquote:border-l-2 prose-blockquote:border-primary/60
                    prose-blockquote:bg-muted/30 prose-blockquote:py-1.5 prose-blockquote:px-4
                    prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                    prose-blockquote:text-sm
                    prose-li:text-sm prose-li:text-foreground/85 prose-li:my-0.5
                  "
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {mutation.data.answer_markdown || mutation.data.answer}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>

            {mutation.data.citations &&
              mutation.data.citations.length > 0 && (
                <CitationsDisplay
                  citations={mutation.data.citations}
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
