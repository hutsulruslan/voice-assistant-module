"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { askAssistant } from "@/lib/api";
import { Play, Pause, Settings2 } from "lucide-react";
import VoiceDialog from "../voice-control/VoiceDialog";
import VoiceMicControl from "../voice-control/VoiceMicControl";

interface Message {
  type: "user" | "assistant";
  text: string;
  timestamp: Date;
  audio_url?: string;
}

export default function TextAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async (text?: string) => {
    const value = text ?? input;
    if (!value.trim() || isLoading) return;

    const userMessage: Message = {
      type: "user",
      text: value,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Додаємо "очікування"
    setMessages((prev) => [
      ...prev,
      {
        type: "assistant",
        text: "",
        timestamp: new Date(),
      },
    ]);

    try {
      const response = await askAssistant(userMessage.text);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          type: "assistant",
          text: response.answer,
          timestamp: new Date(),
          audio_url: response.audio_url,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          type: "assistant",
          text: "Вибач, не вдалося отримати відповідь від сервера.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Відтворення аудіофайлу з бекенду
  const handlePlayClick = (audio_url?: string) => {
    if (!audio_url) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${audio_url}`
    );
    audioRef.current = audio;
    setIsPlaying(true);
    audio.play();
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => setIsPlaying(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Знайти індекс останньої відповіді асистента з audio_url
  const lastAssistantIndex = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (
        messages[i].type === "assistant" &&
        messages[i].audio_url &&
        messages[i].text
      ) {
        return i;
      }
    }
    return -1;
  })();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Кнопка відкриття діалогу */}
      <button
        className="absolute top-4 right-4 bg-white rounded-full shadow p-2 hover:bg-indigo-100 transition"
        onClick={() => setDialogOpen(true)}
        aria-label="Налаштування"
      >
        <Settings2 className="w-6 h-6 text-indigo-500" />
      </button>
      <VoiceDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        micActive={micActive}
        setMicActive={setMicActive}
      />
      <VoiceMicControl
        active={micActive}
        onResult={handleSend}
        onDeactivate={() => setMicActive(false)}
      />
      <div className="flex-1 flex flex-col items-center w-full">
        <div className="w-full max-w-2xl flex flex-col flex-1 pt-6 pb-32 px-2 overflow-y-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Текстовий чат
          </h1>
          <div className="flex-1 flex flex-col gap-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="max-w-[80%]">
                  <Card
                    className={`p-4 shadow-sm ${
                      message.type === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <p className="text-base leading-relaxed">
                      {message.type === "assistant" && message.text === "" ? (
                        <span className="inline-flex gap-1">
                          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0s]"></span>
                          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </span>
                      ) : (
                        message.text
                      )}
                    </p>
                    <p
                      className={`text-xs mt-2 ${
                        message.type === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString("uk-UA", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </Card>
                  {index === lastAssistantIndex && message.audio_url && (
                    <div className="flex justify-start mt-2">
                      <Button
                        onClick={() => handlePlayClick(message.audio_url)}
                        variant="outline"
                        size="sm"
                        className="bg-white hover:bg-gray-50"
                        disabled={isPlaying}
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4 mr-1" />
                        ) : (
                          <Play className="w-4 h-4 mr-1" />
                        )}
                        {isPlaying ? "Відтворюється..." : "Прослухати"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      {/* Фіксований інпут внизу */}
      <div className="w-full max-w-2xl mx-auto px-2 fixed bottom-0 left-0 right-0 pb-6 bg-gradient-to-t from-indigo-100/80 to-transparent">
        <div className="relative w-full">
          <input
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded shadow-sm text-base bg-white"
            placeholder="Напишіть повідомлення..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => handleSend()}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 p-2"
            aria-label="Надіслати"
            disabled={isLoading}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2L11 13"></path>
              <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
