"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Flashcard from "@/components/Flashcard";

export default function LearnPage() {
  const params = useSearchParams();
  const router = useRouter();
  const topic = params.get("topic");

  const [content, setContent] = useState("");
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      if (!topic) return;

      const prompt = `
Explain the topic "${topic}" briefly for a student.
Then generate 6 flashcards strictly in JSON array format like:
[
  { "question": "...", "answer": "..." }
]
Do NOT add anything before or after the JSON.
`;

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      const text: string = data.text;

      const jsonStart = text.indexOf("[");
      const jsonEnd = text.lastIndexOf("]") + 1;

      const cards = JSON.parse(text.slice(jsonStart, jsonEnd));

      setContent(text.slice(0, jsonStart));
      setFlashcards(cards);
      setLoading(false);
    }

    fetchContent();
  }, [topic]);

  if (loading) {
    return (
      <p className="text-center mt-20">
        Loading personalized content...
      </p>
    );
  }

  return (
    <main className="min-h-screen p-10">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-bold mb-6"
      >
        {topic}
      </motion.h2>

      <p className="mb-8 max-w-3xl">{content}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {flashcards.map((card, idx) => (
          <Flashcard key={idx} {...card} />
        ))}
      </div>

      <button
        onClick={() => router.push(`/quiz?topic=${topic}`)}
        className="mt-10 bg-green-600 text-white px-6 py-3 rounded"
      >
        Take Quiz →
      </button>
    </main>
  );
}
