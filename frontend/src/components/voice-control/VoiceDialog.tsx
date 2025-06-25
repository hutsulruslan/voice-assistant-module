import { X, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VoiceDialog({
  open,
  onClose,
  micActive,
  setMicActive,
}: {
  open: boolean;
  onClose: () => void;
  micActive: boolean;
  setMicActive: (v: boolean) => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold mb-4 text-center">Голосові функції</h2>
        <div className="flex flex-col gap-3">
          <Button
            className="w-full"
            variant="outline"
            onClick={() => {
              window.location.href = "/voice-assistant";
              onClose();
            }}
          >
            Перейти на голосового асистента
          </Button>
          <Button
            className={`w-full flex items-center justify-center ${
              micActive ? "bg-red-100 text-red-700" : ""
            }`}
            variant="outline"
            onClick={() => {
              setMicActive(!micActive);
              onClose();
            }}
          >
            {micActive ? (
              <>
                <MicOff className="w-4 h-4 mr-2" />
                Вимкнути мікрофон
                <span className="ml-2 animate-pulse w-2 h-2 rounded-full bg-red-500"></span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Увімкнути голосовий інтерфейс
              </>
            )}
          </Button>
        </div>
        <div className="mt-4 text-xs text-gray-500 text-center">
          Для вимкнення мікрофона можна сказати: <br />
          <span className="italic">
            "вимкни мікрофон", "зупини слухання", "стоп мікрофон"
          </span>
        </div>
      </div>
    </div>
  );
}
