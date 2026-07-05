import React, { useState, useRef, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mic,
  Send,
  Volume2,
  MicOff,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  ShieldCheck,
  User,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { chat as chatApi } from "@/services/api";
import type { ChatResponse, RetrievedChunk } from "@/types/api";
import { detectLanguage, t, type UILang } from "@/lib/i18n";
import { CitationsDisplay } from "./CitationsDisplay";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  quickActions?: string[];
  citations?: string[];
  retrievedChunks?: RetrievedChunk[];
  confidence?: "high" | "medium" | "low" | null;
  lang?: UILang;
}

interface ChatInterfaceProps {
  className?: string;
}

export const ChatInterface = ({ className }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "আমি **Legal Bee**, আপনার ব্যক্তিগত আইনি সহায়ক। আমি আপনাকে বাংলাদেশের আইন সম্পর্কিত যে কোনো প্রশ্নে সহায়তা করতে পারি।\n\nআপনার প্রশ্ন করুন।",
      isUser: false,
      timestamp: new Date(),
      confidence: null,
      lang: "bn",
      quickActions: [
        "Explain in simple words",
        "Show me the law reference",
        "Summarize this",
      ],
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [userType, setUserType] = useState<"general" | "lawyer">("general");
  const [language, setLanguage] = useState<"auto" | "en" | "bn">("auto");
  const lastUserMessageRef = useRef<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const resolveLanguage = useCallback(
    (text: string): "en" | "bn" | undefined => {
      if (language === "auto") return detectLanguage(text);
      return language;
    },
    [language],
  );

  const chatMutation = useMutation<ChatResponse, Error, string>({
    mutationFn: async (question: string) => {
      const resolved = resolveLanguage(question);
      return chatApi({
        question,
        language: resolved,
        user_type: userType,
      });
    },
    onSuccess: (data) => {
      const answerText =
        data.answer_markdown || data.answer || "দুঃখিত, আমি উত্তর আনতে পারিনি।";

      const detectedLang: UILang =
        data.language_detected === "bn" ? "bn" : "en";

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: answerText,
        isUser: false,
        timestamp: new Date(),
        citations: data.citations || [],
        retrievedChunks: data.retrieved_chunks || [],
        confidence: data.confidence || null,
        lang: detectedLang,
        quickActions: [
          "Explain in simple words",
          "Show me the law reference",
          "Get more examples",
        ],
      };

      setMessages((prev) => [...prev, botMessage]);
    },
    onError: (error) => {
      console.error("Error fetching API:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          text: "⚠️ সার্ভারে সংযোগ করতে সমস্যা হচ্ছে। পরে আবার চেষ্টা করুন।",
          isUser: false,
          timestamp: new Date(),
          lang: "bn",
        },
      ]);
    },
  });

  const handleSendMessage = useCallback(
    (text: string = inputText) => {
      if (!text.trim() || chatMutation.isPending) return;

      const trimmedText = text.trim();
      const userMessage: Message = {
        id: Date.now().toString(),
        text: trimmedText,
        isUser: true,
        timestamp: new Date(),
      };

      lastUserMessageRef.current = trimmedText;
      setMessages((prev) => [...prev, userMessage]);
      setInputText("");
      chatMutation.mutate(trimmedText);
    },
    [inputText, chatMutation],
  );

  const handleRegenerate = useCallback(() => {
    if (lastUserMessageRef.current && !chatMutation.isPending) {
      const lastMessage = lastUserMessageRef.current;
      const userMessage: Message = {
        id: Date.now().toString(),
        text: lastMessage,
        isUser: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      chatMutation.mutate(lastMessage);
    }
  }, [chatMutation]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  const cleanAnswerText = (text: string): string => {
    return text
      .replace(/🎯|📚|⚖️|📋|⚠️|💼/g, "")
      .replace(/→/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  };

  const renderBotMessage = (message: Message) => {
    const cleanText = cleanAnswerText(message.text);
    const lang = message.lang || "en";

    return (
      <div className="space-y-5">
        <div
          className="
            prose prose-sm max-w-none dark:prose-invert
            prose-headings:font-semibold prose-headings:tracking-tight
            prose-h1:text-xl prose-h1:mt-0
            prose-h2:text-base prose-h2:mt-5 prose-h2:mb-2
            prose-h3:text-sm
            prose-p:text-sm prose-p:leading-relaxed prose-p:text-foreground/85
            prose-strong:text-foreground prose-strong:font-semibold
            prose-a:text-primary hover:prose-a:text-primary/80 prose-a:no-underline
            prose-blockquote:border-l-2 prose-blockquote:border-primary/60
            prose-blockquote:bg-muted/30 prose-blockquote:py-1.5 prose-blockquote:px-4
            prose-blockquote:rounded-r-lg prose-blockquote:not-italic
            prose-blockquote:text-sm prose-blockquote:text-foreground/80
            prose-li:text-sm prose-li:text-foreground/85 prose-li:my-0.5
            prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-code:text-xs prose-code:font-normal
            prose-hr:border-border/60
          "
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanText}</ReactMarkdown>
        </div>

        <CitationsDisplay
          citations={message.citations || []}
          retrievedChunks={message.retrievedChunks}
          lang={lang}
        />

        {message.confidence && (
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground font-medium">
              {t("confidence", lang)}:
            </span>
            <span
              className={cn(
                "text-[11px] px-2 py-0.5 rounded-full font-medium border",
                message.confidence === "high"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800"
                  : message.confidence === "medium"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800",
              )}
            >
              {t(message.confidence, lang)}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderMessage = (message: Message) => {
    if (!message.isUser) {
      return renderBotMessage(message);
    }

    return (
      <p className="text-sm leading-relaxed whitespace-pre-line">
        {message.text}
      </p>
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
        duration: 2000,
      });
    });
  };

  const speakText = (text: string) => {
    if (synthRef.current && "speechSynthesis" in window) {
      synthRef.current.cancel();
      const cleanText = text.replace(/🎯|📚|⚖️|📋|⚠️|💼|→|\*\*|#|>|-|\|/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "bn-BD";
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      synthRef.current.speak(utterance);
    } else {
      toast({
        title: "Text-to-speech unavailable",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive",
      });
    }
  };

  // Speech Recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "bn-BD";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        toast({
          title: "Voice input error",
          description: "Could not process voice input. Please try again.",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    if ("speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        setIsListening(true);
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setIsListening(false);
        toast({
          title: "Voice input unavailable",
          description: "Voice input is not supported in your browser.",
          variant: "destructive",
        });
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const isLastBotMessage = (message: Message) => {
    const botMsgs = messages.filter((m) => !m.isUser);
    return botMsgs.length > 0 && botMsgs[botMsgs.length - 1].id === message.id;
  };

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Chat controls bar */}
      <div className="border-b px-4 py-2 flex items-center gap-3 max-w-4xl mx-auto w-full">
        <ToggleGroup
          type="single"
          value={userType}
          onValueChange={(val) => {
            if (val) setUserType(val as "general" | "lawyer");
          }}
          variant="outline"
          size="sm"
        >
          <ToggleGroupItem value="general" aria-label="General user">
            <User className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">General</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="lawyer" aria-label="Lawyer user">
            <Briefcase className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">Lawyer</span>
          </ToggleGroupItem>
        </ToggleGroup>

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

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-4xl mx-auto w-full">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.isUser ? "justify-end" : "justify-start",
            )}
          >
            <div className="flex flex-col max-w-[85%]">
              <div
                className={cn(
                  "rounded-2xl px-5 py-4",
                  message.isUser
                    ? "chat-bubble-user text-primary-foreground ml-auto shadow-sm"
                    : "legal-response bg-card/40 border border-border/30",
                )}
              >
                {renderMessage(message)}

                {/* Message Actions Bar */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/30">
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString("bn-BD", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  {!message.isUser && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                        onClick={() => speakText(message.text)}
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                        onClick={() => copyToClipboard(message.text)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>

                      {isLastBotMessage(message) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                          onClick={handleRegenerate}
                          disabled={chatMutation.isPending}
                          title="Regenerate response"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      )}

                      <div className="flex gap-1 ml-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-60 hover:opacity-100 hover:text-green-600"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-60 hover:opacity-100 hover:text-red-600"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Loading skeleton */}
        {chatMutation.isPending && (
          <div className="flex justify-start">
            <div className="bg-card/40 border border-border/30 rounded-2xl px-5 py-4 max-w-[85%] w-full">
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-3 w-3/6" />
              </div>
              <div className="mt-3 pt-2.5 border-t border-border/30">
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-card/50 backdrop-blur-sm p-4">
        <div className="flex items-center space-x-3 max-w-4xl mx-auto">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "shrink-0 border-primary/20 hover:bg-primary/5 transition-all duration-200",
              isListening &&
                "bg-red-500 text-white border-red-500 animate-pulse",
            )}
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4 text-primary" />
            )}
          </Button>

          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="আপনার আইনি প্রশ্ন লিখুন... (বাংলা বা ইংরেজিতে)"
              className="pr-12 border-primary/20 focus:border-primary focus:ring-primary/20 rounded-full h-12 text-sm"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || chatMutation.isPending}
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 bg-primary hover:bg-primary/90 rounded-full transition-all duration-200 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isListening && (
          <p className="text-xs text-center mt-2 text-red-600 animate-pulse">
            🎙️ Listening... Speak now in Bengali
          </p>
        )}
      </div>
    </div>
  );
};
