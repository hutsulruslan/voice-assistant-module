"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { askAssistant } from "@/lib/api";

type AssistantState = "idle" | "listening" | "thinking" | "responding";

export default function VoiceAssistant() {
  const [state, setState] = useState<AssistantState>("idle");
  const stateRef = useRef<AssistantState>("idle");
  const [transcript, setTranscript] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const recognitionRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (!started) return;

    const SpeechRecognition =
      typeof window !== "undefined" &&
      ((window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition);

    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.lang = "uk-UA";
      recog.interimResults = false;
      recog.maxAlternatives = 1;

      recog.onresult = async (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setState("thinking");

        if (text.toLowerCase().includes("вимкни голосовий режим")) {
          recog.stop();
          window.location.href = "/text-assistant";
          return;
        }

        try {
          recog.stop();
          const res = await askAssistant(text);
          setAnswer(res.answer);
          setState("responding");
          if (res.audio_url) {
            const audio = new Audio(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}${res.audio_url}`
            );
            audioRef.current = audio;
            audio.play();
            audio.onended = () => {
              setState("idle");
              setTranscript("");
              setState("listening");
              recog.start();
            };
          }
        } catch {
          const errMsg = "Вибач, не вдалося отримати відповідь.";
          setAnswer(errMsg);
          setState("responding");
        }
      };

      recog.onerror = (e: any) => {
        console.error("Speech recognition error:", e);
        if (e.error === "no-speech" || e.error === "network") {
          try {
            recog.start();
            setState("listening");
            setTranscript("");
          } catch {}
        } else {
          setState("idle");
        }
      };

      recog.onend = () => {
        if (stateRef.current === "listening") {
          try {
            recog.start();
            setTranscript("");
          } catch {}
        }
      };

      recognitionRef.current = recog;
      setReady(true);
    }
  }, [started]);

  useEffect(() => {
    if (ready && recognitionRef.current && started) {
      setTranscript("");
      setState("listening");
      try {
        recognitionRef.current.start();
      } catch {}
    }
  }, [ready, started]);

  // --- Додаємо кнопку переходу на текстовий чат ---
  const handleGoToText = () => {
    window.location.href = "/text-assistant";
  };

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg"
          onClick={() => setStarted(true)}
        >
          Почати голосового асистента
        </button>
        <button
          className="mt-4 px-6 py-3 bg-white border border-blue-600 text-blue-600 rounded-lg text-lg hover:bg-blue-50 transition"
          onClick={handleGoToText}
        >
          Перейти до текстового чату
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col items-center justify-center text-center px-4">
      {/* Кнопка переходу у текстовий чат */}
      <button
        className="absolute top-4 right-4 bg-white border border-blue-600 text-blue-600 rounded-full shadow p-2 hover:bg-blue-50 transition"
        onClick={handleGoToText}
        aria-label="Перейти до текстового чату"
      >
        Текстовий чат
      </button>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Голосовий помічник
      </h1>
      <p className="text-gray-600 text-sm mb-8">Говоріть, і я вас слухаю</p>

      {/* Центральний індикатор */}
      <div
        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300
        ${
          state === "listening"
            ? "bg-red-500 animate-pulse"
            : state === "thinking"
            ? "bg-yellow-400 animate-spin"
            : "bg-blue-500"
        }`}
      >
        {state === "listening" ? (
          <MicOff className="w-8 h-8 text-white" />
        ) : state === "thinking" ? (
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        ) : (
          <Mic className="w-8 h-8 text-white" />
        )}
      </div>

      {/* Вивід відповіді */}
      <div className="mt-6 max-w-md">
        {transcript && (
          <p className="text-sm text-gray-600 mb-1">📥 Ви сказали:</p>
        )}
        {transcript && <p className="text-base font-medium">{transcript}</p>}

        {answer && (
          <>
            <p className="text-sm text-gray-600 mt-4 mb-1">🧠 Відповідь:</p>
            <p className="text-lg text-gray-800 font-semibold">{answer}</p>
          </>
        )}

        {state === "listening" && (
          <p className="text-blue-500 mt-4 font-medium">🎤 Слухаю вас...</p>
        )}
        {state === "thinking" && (
          <p className="text-indigo-500 mt-4 font-medium">⏳ Думаю...</p>
        )}
        {state === "responding" && (
          <p className="text-green-600 mt-4 font-medium">🔈 Озвучую...</p>
        )}
      </div>
    </div>
  );
}
