import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mic,
  Send,
  Volume2,
  MicOff,
  Copy,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  Scale,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  quickActions?: string[];
  isStructured?: boolean;
}

interface ChatInterfaceProps {
  className?: string;
}

export const ChatInterface = ({ className }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "আমি Legal Bee, আপনার ব্যক্তিগত আইনি সহায়ক। আমি আপনাকে বাংলাদেশের আইন সম্পর্কিত যে কোনো প্রশ্নে সহায়তা করতে পারি। আপনার প্রশ্ন করুন।",
      isUser: false,
      timestamp: new Date(),
      quickActions: [
        "Explain in simple words",
        "Show me the law reference",
        "Summarize this",
      ],
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced API call with better response formatting
  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await fetch(
        // "http://localhost:8000/query",
        "https://muhir-legalbee-api.hf.space/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: text }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const responseText = data.answer || "⚠️ দুঃখিত, আমি উত্তর আনতে পারিনি।";

      // Check if response is structured (contains emoji headers)
      const isStructured = /🎯|📚|⚖️|📋|⚠️|💼/.test(responseText);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
        isStructured,
        quickActions: [
          "Explain in simple words",
          "Show me the law reference",
          "Get more examples",
          // "Translate to Bengali",
        ],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching API:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          text: "⚠️ সার্ভারে সংযোগ করতে সমস্যা হচ্ছে। পরে আবার চেষ্টা করুন।",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  // Enhanced message rendering with better structure
  const renderStructuredMessage = (text: string) => {
    const sections = text.split(/(?=🎯|📚|⚖️|📋|⚠️|💼)/);

    return (
      <div className="space-y-4">
        {sections.map((section, idx) => {
          if (!section.trim()) return null;

          const [header, ...content] = section.split("→");
          const headerText = header.trim();
          const contentText = content.join("→").trim();

          let icon = null;
          let bgColor = "";
          let borderColor = "";

          if (headerText.includes("🎯")) {
            icon = <FileText className="h-4 w-4 text-blue-600" />;
            bgColor = "bg-blue-50";
            borderColor = "border-blue-200";
          } else if (headerText.includes("📚")) {
            icon = <BookOpen className="h-4 w-4 text-green-600" />;
            bgColor = "bg-green-50";
            borderColor = "border-green-200";
          } else if (headerText.includes("⚖️")) {
            icon = <Scale className="h-4 w-4 text-purple-600" />;
            bgColor = "bg-purple-50";
            borderColor = "border-purple-200";
          } else if (headerText.includes("📋")) {
            icon = <FileText className="h-4 w-4 text-orange-600" />;
            bgColor = "bg-orange-50";
            borderColor = "border-orange-200";
          } else if (headerText.includes("⚠️")) {
            icon = <AlertTriangle className="h-4 w-4 text-red-600" />;
            bgColor = "bg-red-50";
            borderColor = "border-red-200";
          } else {
            bgColor = "bg-red-200";
            borderColor = "border-red-200";
          }

          return (
            <div
              key={idx}
              className={cn("rounded-lg border p-3", bgColor, borderColor)}
            >
              <div className="flex items-start gap-2">
                {icon}
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1 text-gray-800">
                    {headerText.replace(/🎯|📚|⚖️|📋|⚠️|💼/g, "").trim()}
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {contentText}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMessage = (message: Message) => {
    if (message.isStructured && !message.isUser) {
      return renderStructuredMessage(message.text);
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

  // Speech Recognition + TTS
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

  const speakText = (text: string) => {
    if (synthRef.current && "speechSynthesis" in window) {
      synthRef.current.cancel();
      const cleanText = text.replace(/🎯|📚|⚖️|📋|⚠️|💼|→|\*\*/g, "");
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

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-4xl mx-auto w-full">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.isUser ? "justify-end" : "justify-start"
            )}
          >
            <div className="flex flex-col max-w-[85%]">
              <div
                className={cn(
                  "rounded-2xl px-4 py-3 shadow-sm",
                  message.isUser
                    ? "chat-bubble-user te xt-primary-foreground ml-auto"
                    : "bg-card border border-border"
                )}
              >
                {renderMessage(message)}

                {/* Message Actions Bar */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                  <span className="text-xs opacity-70">
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

                      <div className="flex gap-1 ml-2">
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

              {/* Enhanced Quick Action Buttons */}
              {/* {!message.isUser && message.quickActions && (
                <div className="flex flex-wrap gap-2 mt-3 ml-2">
                  {message.quickActions.map((action, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 px-3 border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/40 transition-all duration-200"
                      onClick={() => handleQuickAction(action)}
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              )} */}
            </div>
          </div>
        ))}

        {/* Enhanced Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-sm text-muted-foreground">
                  Legal Bee is analyzing...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <div className="border-t bg-card/50 backdrop-blur-sm p-4">
        <div className="flex items-center space-x-3 max-w-4xl mx-auto">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "shrink-0 border-primary/20 hover:bg-primary/5 transition-all duration-200",
              isListening &&
                "bg-red-500 text-white border-red-500 animate-pulse"
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
              disabled={!inputText.trim() || isTyping}
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 bg-primary hover:bg-primary/90 rounded-full transition-all duration-200 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Input Status */}
        {isListening && (
          <p className="text-xs text-center mt-2 text-red-600 animate-pulse">
            🎙️ Listening... Speak now in Bengali
          </p>
        )}
      </div>
    </div>
  );
};
