export async function askAssistant(text: string): Promise<{
  query: string;
  answer: string;
  audio_url: string;
}> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/text-query`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: text }),
    }
  );

  if (!res.ok) throw new Error("Не вдалося отримати відповідь");

  return await res.json();
}
