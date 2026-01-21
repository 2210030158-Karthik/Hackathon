"use client";

import { useRouter } from "next/navigation";
import { subjects } from "@/lib/subjects";

export default function DashboardPage() {
  const router = useRouter();

  const subjectEntries = Object.entries(subjects);

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Your Subjects
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjectEntries.map(([id, subject]) => (
          <div
            key={id}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            {/* Subject Info */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {subject.title}
              </h2>

              <p className="text-gray-600 text-sm">
                {subject.description}
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={() => router.push(`/subject/${id}`)}
              className="mt-6 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Continue Learning
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
