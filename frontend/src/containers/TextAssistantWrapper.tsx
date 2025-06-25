"use client";
import dynamic from "next/dynamic";

const TextAssistant = dynamic(() => import("../components/TextAssistant"), {
  ssr: false,
});
export default TextAssistant;
