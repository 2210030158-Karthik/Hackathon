"use client";

import { useParams, useRouter } from "next/navigation";
import { subjects } from "@/lib/subjects";

export default function SubjectPage() {
  const params = useParams();
  const router = useRouter();

  const subjectId =
    typeof params.subjectId === "string"
      ? params.subjectId
      : params.subjectId?.[0];

  if (!subjectId) {
    return (
      <main className="p-8">
        <p className="text-gray-500">Loading subject…</p>
      </main>
    );
  }

  const subject =
    subjects[subjectId as keyof typeof subjects];

  if (!subject) {
    return (
      <main className="p-8">
        <p className="text-red-600">Subject not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
        <button
          onClick={() => router.push("/dashboard")}
          className="hover:text-gray-900"
        >
          Dashboard
        </button>
        <span>/</span>
        <span className="text-gray-900 font-medium">
          {subject.title}
        </span>
      </div>

      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {subject.title}
      </h1>

      <p className="text-gray-600 mb-8">
        {subject.description}
      </p>

      {/* Chapters */}
      <div className="space-y-4">
        {subject.chapters.map((chapter, index) => {
          const chapterSlug = chapter
            .toLowerCase()
            .replace(/\s+/g, "-");

          return (
            <div
              key={chapter}
              onClick={() =>
                router.push(
                  `/chapter/${subjectId}/${chapterSlug}`
                )
              }
              className="bg-white p-5 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {index + 1}. {chapter}
                </p>
                <p className="text-sm text-gray-500">
                  Click to start learning
                </p>
              </div>

              <span className="text-indigo-600 text-sm">
                Open →
              </span>
            </div>
          );
        })}
      </div>
    </main>
  );
}
