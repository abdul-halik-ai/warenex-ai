"use client";

import { useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  RefreshCw,
  User,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Terminal,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  toolCalls?: any[];
  time: string;
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I am **Warenex Copilot**, your real-time Autonomous Warehouse Intelligence Assistant.\n\nI have direct read access to our facility database, IoT sensor streams, RFID portals, and computer vision feeds.\n\n**Ask me questions such as:**\n* "Where is SKU-1007?"\n* "Why is SKU-2031 showing an anomaly?"\n* "Which products need immediate restocking?"\n* "Which storage zones exceeded temperature limits?"\n* "Give me the fastest picking route for Order #1042."\n* "Which workers are currently active?"`,
      time: "Just now"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    "Where is SKU-1007?",
    "Why is SKU-2031 showing an anomaly?",
    "Which products need immediate restocking?",
    "Which storage zones exceeded temperature limits?",
    "Give me the fastest picking route for Order #1042."
  ];

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim()) return;

    const userMsg: Message = {
      role: "user",
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput("");
    setLoading(true);

  try {
    const res = await fetch("/api/ai/copilot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();

    const assistantMsg: Message = {
      role: "assistant",
      content: data.reply,
      toolCalls: data.toolCalls,
      time: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, assistantMsg]);
  } catch {
    toast.error("Failed to connect to Warenex Copilot");
  } finally {
    setLoading(false);
  }
};

return (
  <div className="space-y-6">
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Bot className="h-6 w-6 text-blue-600" />
          Warenex Copilot
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Enterprise operational AI assistant executing verified tool calls against live warehouse state.
        </p>
      </div>
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-xs">
        DETERMINISTIC TOOL CALLING ACTIVE
      </Badge>
    </div>

    {/* Preset Sample Prompts */}
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-slate-500">Quick Inquiries:</span>
      {samplePrompts.map(prompt => (
        <Button
          key={prompt}
          variant="outline"
          size="sm"
          className="text-xs h-7 border-slate-200 hover:bg-blue-50 hover:text-blue-700"
          onClick={() => handleSend(prompt)}
        >
          {prompt}
        </Button>
      ))}
    </div>

    {/* Chat Conversation Card */}
    <Card className="border-slate-200 shadow-sm flex flex-col h-[600px]">
      <CardContent className="p-4 flex-1 overflow-y-auto space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 text-xs ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.role === "assistant" && (
              <div className="h-7 w-7 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg p-3.5 space-y-2 ${
                m.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-50 dark:bg-slate-900 border text-slate-800 dark:text-slate-200"
              }`}
            >
              {/* If tool calls occurred, show transparency badge */}
              {m.toolCalls && m.toolCalls.length > 0 && (
                <div className="p-2 rounded bg-slate-100 dark:bg-slate-800 border text-[11px] font-mono text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <Terminal className="h-3 w-3 text-blue-600" />
                  <span>Executed: {m.toolCalls.map(t => t.tool).join(", ")}</span>
                </div>
              )}

              <div className="whitespace-pre-wrap leading-relaxed">
                {m.content}
              </div>

              <div className={`text-[10px] ${m.role === "user" ? "text-blue-200" : "text-slate-400"} text-right`}>
                {m.time}
              </div>
            </div>
            {m.role === "user" && (
              <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 text-xs items-center text-slate-500">
            <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
            <span>Warenex Copilot querying facility graph and telemetry...</span>
          </div>
        )}
      </CardContent>

      <div className="p-3 border-t bg-slate-50/50 dark:bg-slate-900/50 flex gap-2">
        <Input
          placeholder="Ask Copilot about any SKU, zone, anomaly, worker, or picking route..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="text-xs bg-white dark:bg-slate-950"
        />
        <Button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5"
        >
          <Send className="h-3.5 w-3.5" />
          Send
        </Button>
      </div>
    </Card>
  </div>
);
}
