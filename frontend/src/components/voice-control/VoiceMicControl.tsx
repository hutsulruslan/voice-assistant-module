import { useEffect, useRef, useState } from "react";
import { MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceMicControl({
  active,
  onResult,
  onDeactivate,
}: {
  active: boolean;
  onResult: (text: string) => void;
  onDeactivate: () => void;
}) {
  const recognitionRef = useRef<any>(null);
  const [micIndicator, setMicIndicator] = useState(false);

  useEffect(() => {
    if (!active) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setMicIndicator(false);
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Ваш браузер не підтримує розпізнавання голосу.");
      onDeactivate();
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "uk-UA";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => setMicIndicator(true);
    recognition.onend = () => {
      setMicIndicator(false);
      onDeactivate();
    };
    recognition.onerror = () => {
      setMicIndicator(false);
      onDeactivate();
    };
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("")
        .trim()
        .toLowerCase();

      if (
        transcript.includes("вимкни мікрофон") ||
        transcript.includes("зупини слухання") ||
        transcript.includes("стоп мікрофон")
      ) {
        recognition.stop();
        onDeactivate();
        return;
      }
      if (transcript) {
        onResult(transcript);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();

    return () => {
      recognition.stop();
      recognitionRef.current = null;
      setMicIndicator(false);
    };
    // eslint-disable-next-line
  }, [active]);

  if (!active) return null;
  return (
    <div className="fixed bottom-24 right-8 flex items-center gap-2 z-50">
      <span className="animate-pulse w-3 h-3 rounded-full bg-red-500"></span>
      <span className="text-red-600 font-semibold">Мікрофон увімкнено</span>
      <Button
        variant="outline"
        size="sm"
        className="ml-2"
        onClick={onDeactivate}
      >
        <MicOff className="w-4 h-4 mr-1" />
        Вимк.
      </Button>
    </div>
  );
}
