"use client";
import dynamic from "next/dynamic";

const VoiceAssistant = dynamic(
  () => import("../components/voice/VoiceAssistant"),
  {
    ssr: false,
  }
);
export default VoiceAssistant;
