import React, { useState, useCallback, useEffect } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { SearchTab } from "@/components/chat/SearchTab";
import { AnalyzeTab } from "@/components/chat/AnalyzeTab";
import { SummaryTab } from "@/components/chat/SummaryTab";
import { ChatHistorySidebar } from "@/components/chat/ChatHistorySidebar";
import {
  loadSessions,
  saveSessions,
  type ChatSession,
} from "@/lib/chat-history";
import { EmergencyButton } from "@/components/emergency/EmergencyButton";
import { DisclaimerBanner } from "@/components/ui/DisclaimerBanner";
import { Header } from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Search, Scale, FileText } from "lucide-react";

const Index = () => {
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  const [sessions, setSessions] = useState<ChatSession[]>(() => loadSessions());
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  const handleNewChat = useCallback(() => {
    setCurrentSessionId(null);
    setSidebarOpen(false);
    setActiveTab("chat");
  }, []);

  const handleSelectSession = useCallback((session: ChatSession) => {
    setCurrentSessionId(session.id);
    setSidebarOpen(false);
    setActiveTab("chat");
  }, []);

  const handleDeleteSession = useCallback((id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (currentSessionId === id) {
      setCurrentSessionId(null);
    }
  }, [currentSessionId]);

  const handleClearAll = useCallback(() => {
    setSessions([]);
    setCurrentSessionId(null);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      <DisclaimerBanner />
      <Header onEmergencyClick={() => setIsEmergencyOpen(true)} />

      <main className="flex-1 flex min-h-0 relative">
        <ChatHistorySidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
          onClearAll={handleClearAll}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="border-b px-4 flex items-center justify-center">
              <TabsList className="my-1">
                <TabsTrigger value="chat" className="gap-1.5 text-xs">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="search" className="gap-1.5 text-xs">
                  <Search className="h-3.5 w-3.5" />
                  Search
                </TabsTrigger>
                <TabsTrigger value="analyze" className="gap-1.5 text-xs">
                  <Scale className="h-3.5 w-3.5" />
                  Analyze
                </TabsTrigger>
                <TabsTrigger value="summary" className="gap-1.5 text-xs">
                  <FileText className="h-3.5 w-3.5" />
                  Summary
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="flex-1 flex flex-col mt-0 min-h-0 data-[state=inactive]:hidden">
              <ChatInterface />
            </TabsContent>
            <TabsContent value="search" className="flex-1 flex flex-col mt-0 min-h-0 data-[state=inactive]:hidden">
              <SearchTab />
            </TabsContent>
            <TabsContent value="analyze" className="flex-1 flex flex-col mt-0 min-h-0 data-[state=inactive]:hidden">
              <AnalyzeTab />
            </TabsContent>
            <TabsContent value="summary" className="flex-1 flex flex-col mt-0 min-h-0 data-[state=inactive]:hidden">
              <SummaryTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <EmergencyButton
        isOpen={isEmergencyOpen}
        onOpenChange={setIsEmergencyOpen}
      />
    </div>
  );
};

export default Index;
