"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useLearningProfile } from "@/components/LearningProfileContext";
import Flashcard from "@/components/Flashcard";
import { useRouter } from "next/navigation";
import { subjects } from "@/lib/subjects";

export default function ChapterPage() {
  const params = useParams();

  const subjectId = Array.isArray(params.subjectId)
    ? params.subjectId[0]
    : params.subjectId;

  const chapterId = Array.isArray(params.chapterId)
    ? params.chapterId[0]
    : params.chapterId;

    const router = useRouter();

const subject = subjectId
  ? subjects[subjectId as keyof typeof subjects]
  : undefined;

    if (!subjectId || !chapterId) {
  return (
    <main className="p-8">
      <p className="text-gray-500 ">Loading chapter...</p>
    </main>
  );
  
}

  const [activeTab, setActiveTab] = useState<
    "notes" | "flashcards" | "quiz"
  >("notes");

  return (
    
    <main className="p-8 max-w-5xl bg-gray-50 mx-auto">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
  <button
    onClick={() => router.push("/dashboard")}
    className="hover:text-gray-900"
  >
    Dashboard
  </button>

  <span>/</span>

  <button
  onClick={() => router.push(`/subject/${subjectId}`)}
  className="hover:text-gray-900"
>
  {subject?.title ?? "Subject"}
</button>

<span></span>

  <span className="text-gray-900 font-medium capitalize">
    {chapterId.replace(/-/g, " ")}
  </span>
</div>
<button
  onClick={() => router.back()}
  className="mb-6 text-sm text-indigo-600 hover:underline"
>
  ← Back
</button>
     
      {/* Chapter Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6 capitalize">
        {chapterId?.replace(/-/g, " ")}
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        {["notes", "flashcards", "quiz"].map((tab) => (
          <button
            key={tab}
            onClick={() =>
              setActiveTab(tab as "notes" | "flashcards" | "quiz")
            }
            className={`px-4 py-2 rounded-lg border transition ${
              activeTab === tab
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow p-6 min-h-[300px]">
        {activeTab === "notes" && <NotesSection subjectId={subjectId} chapterId={chapterId} />}


            {activeTab === "flashcards" && (
    <FlashcardsSection
        subjectId={subjectId}
        chapterId={chapterId}
    />
    )}

        {activeTab === "quiz" && (
  <QuizSection
    subjectId={subjectId}
    chapterId={chapterId}
  />
)}

      </div>
    </main>
  );


  function NotesSection({
  subjectId,
  chapterId,
}: {
  subjectId: string;
  chapterId: string;
}) {
  const { profile } = useLearningProfile();

  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotes() {
      setLoading(true);

const prompt = `
Teach the chapter "${chapterId}" from subject "${subjectId}" for an engineering student.

Internal teaching parameters (DO NOT mention these in the output):
- Familiarity: ${profile.familiarity}
- Learning pace: ${profile.pace}
- Explanation style: ${profile.preference}

Rules:
- Use structured academic headings
- Be academically correct
- Adjust language complexity implicitly
- Use examples only if appropriate
- Do NOT mention the learner profile, audience, or teaching assumptions
- Do NOT include meta commentary
- Output ONLY the chapter content
`;


      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setNotes(data.text);
      setLoading(false);
    }

    fetchNotes();
  }, [subjectId, chapterId, profile]);

  if (loading) {
    return (
      <p className="text-gray-500">
        Generating personalized notes…
      </p>
    );
  }

  return (
    <article className="prose max-w-none text-gray-800">
      {notes.split("\n").map((line, idx) => (
        <p key={idx}>{line}</p>
      ))}
    </article>
  );
}

function QuizSection({
  subjectId,
  chapterId,
}: {
  subjectId: string;
  chapterId: string;
}) {
  const { profile } = useLearningProfile();
  const [refreshKey, setRefreshKey] = useState(0);
  const [questions, setQuestions] = useState<
    { question: string; options: string[]; answer: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  useEffect(() => {
    async function fetchQuiz() {
      setLoading(true);
const variationSeed = Math.random().toString(36).slice(2, 8);
      const questionCount =
        profile.pace === "slow"
          ? 3
          : profile.pace === "fast"
          ? 7
          : 5;

      const prompt = `
You are generating quiz data for a software system.

Generate a quiz for the chapter "${chapterId}" from subject "${subjectId}".
Variation key: ${variationSeed}
Internal parameters (DO NOT mention these):
- Familiarity: ${profile.familiarity}
- Learning pace: ${profile.pace}

STRICT RULES (VERY IMPORTANT):
- Ensure regenerated quizzes differ from previous ones
- Vary question framing and focus
- Output MUST be valid JSON
- Do NOT include explanations
- Do NOT include markdown
- Do NOT include backticks
- Do NOT include any text before or after JSON
- Output ONLY a JSON array

JSON FORMAT:
[
  {
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "answer": "string"
  }
]

Generate exactly ${questionCount} questions.
`;

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      try {
  const raw = data.text;

  // Extract JSON array safely
  const jsonMatch = raw.match(/\[[\s\S]*\]/);

  if (!jsonMatch) {
    throw new Error("No JSON array found");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  setQuestions(parsed);
} catch (err) {
  console.error("Invalid quiz JSON", err);
  setQuestions([]);
}

      setLoading(false);
    }

    fetchQuiz();
  }, [subjectId, chapterId, profile, refreshKey]);

  if (loading) {
    return <p className="text-gray-500">Generating quiz…</p>;
  }

  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-xl relative">
        <button
        onClick={() => {
            setRefreshKey((k) => k + 1);
            setSelected({});
            setChecked({});
        }}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        title="Regenerate quiz"
        >
        🔄
        </button>
      {questions.map((q, idx) => (
        <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200">
          <p className="font-medium mb-3 text-gray-900">
            {idx + 1}. {q.question}
          </p>

          <div className="space-y-2">
            {q.options.map((opt) => (
              <label
               key={opt}
                className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
                    checked[idx]
                    ? opt === q.answer
                        ? "bg-green-100 text-green-800"
                        : selected[idx] === opt
                        ? "bg-red-100 text-red-800"
                        : "text-gray-600"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
                >   
                <input
                type="radio"
                name={`q-${idx}`}
                value={opt}
                checked={selected[idx] === opt}
                disabled={checked[idx]}
                onChange={() => {
                    setSelected({ ...selected, [idx]: opt });
                    setChecked({ ...checked, [idx]: true });
                }}
                />
                {checked[idx] && selected[idx] !== q.answer && (
                <p className="text-sm text-green-700 mt-2">
                    Correct answer: <strong>{q.answer}</strong>
                </p>
                )}
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}



function FlashcardsSection({
  subjectId,
  chapterId,
}: {
  subjectId: string;
  chapterId: string;
}) {
  const [refreshKey, setRefreshKey] = useState(0);
  const { profile } = useLearningProfile();

  const [cards, setCards] = useState<
    { question: string; answer: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [known, setKnown] = useState<number[]>([]);

  useEffect(() => {
    async function fetchFlashcards() {
      setLoading(true);
const variationSeed = Math.random().toString(36).slice(2, 8);
      const prompt = `
Generate flashcards for the chapter "${chapterId}" from subject "${subjectId}".

Internal parameters (DO NOT mention these):
- Familiarity: ${profile.familiarity}
- Learning pace: ${profile.pace}
- Explanation style: ${profile.preference}

Variation key: ${variationSeed}

Rules:
- Generate 6 to 8 flashcards
- Each flashcard must cover a DIFFERENT concept
- Avoid repeating earlier flashcards
- Vary phrasing and focus on regeneration
- Adjust complexity based on familiarity
- Do NOT include meta commentary
- Return ONLY valid JSON in this format:

[
  { "question": "...", "answer": "..." }
]
`;


      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      try {
        const raw = data.text;
        const match = raw.match(/\[[\s\S]*\]/);
        if (!match) throw new Error("No JSON found");
        setCards(JSON.parse(match[0]));
        setCurrentIndex(0);
        setKnown([]);
      } catch (e) {
        console.error("Invalid flashcard JSON", e);
        setCards([]);
      }

      setLoading(false);
    }

    fetchFlashcards();
  }, [subjectId, chapterId, profile, refreshKey]);

  if (loading) {
    return <p className="text-gray-500">Generating flashcards…</p>;
  }

  if (cards.length === 0) {
    return <p className="text-gray-500">No flashcards available.</p>;
  }

  const current = cards[currentIndex];

  function resetSession() {
  setCurrentIndex(0);
  setKnown([]);
}

  return (
    <div className="max-w-xl mx-auto space-y-6 relative">
        <button
  onClick={() => {
    setRefreshKey((k) => k + 1);
    setCurrentIndex(0);
    setKnown([]);
        }}
    className="absolute top-0 right-0 text-gray-500 hover:text-gray-800"
    title="Regenerate flashcards"
    >
    🔄
    </button>
      {/* Progress */}
      <p className="text-sm text-gray-500 text-center">
        Card {currentIndex + 1} / {cards.length}
      </p>

      {/* Flashcard */}
      <Flashcard
        key={currentIndex}
        question={current.question}
        answer={current.answer}
      />

      {/* Controls */}
      <div className="flex justify-between gap-4">
        <button
          onClick={() =>
            setCurrentIndex((i) => Math.max(i - 1, 0))
          }
          disabled={currentIndex === 0}
          className="px-4 py-2 rounded border text-gray-700 disabled:opacity-40"
        >
          ← Previous
        </button>

        <button
        onClick={() => {
            setKnown((k) => [...k, currentIndex]);

            if (currentIndex === cards.length - 1) {
            resetSession();
            } else {
            setCurrentIndex((i) => i + 1);
            }
        }}
        className="px-4 py-2 rounded bg-green-600 text-white"
        >
        I knew this
        </button>

        <button
        onClick={() => {
            if (currentIndex === cards.length - 1) {
            resetSession();
            } else {
            setCurrentIndex((i) => i + 1);
            }
        }}
        className="px-4 py-2 rounded bg-red-600 text-white"
        >
        I didn’t
    </button>
      </div>

      {/* Confidence summary */}
      <p className="text-center text-sm text-gray-500">
        Known: {known.length} / {cards.length}
      </p>
    </div>
  );
}


}


