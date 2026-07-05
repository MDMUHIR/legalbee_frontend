import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

const SUGGESTED_QUESTIONS = [
  "What are the requirements for filing a criminal case in Bangladesh?",
  "Explain the key provisions of the Digital Security Act",
  "How does the Bangladesh Labour Act protect employee rights?",
  "What is the process for land registration in Bangladesh?",
  "What are the legal rights of women in inheritance under Muslim law?",
];

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="px-4 pb-2 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-1.5 mb-2">
        <Lightbulb className="h-3 w-3 text-primary" />
        <span className="text-[11px] text-muted-foreground font-medium">
          Suggested Questions
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {SUGGESTED_QUESTIONS.map((q) => (
          <Button
            key={q}
            variant="outline"
            size="sm"
            className="text-[11px] h-7 px-2.5 border-primary/20 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
            onClick={() => onSelect(q)}
          >
            {q}
          </Button>
        ))}
      </div>
    </div>
  );
}
