"use client";

import { useSearchParams } from "next/navigation";
import { useLearningProfile } from "@/components/LearningProfileContext";

// ⬇️ move ALL your previous /learn page logic here
export default function LearnClient() {
  const searchParams = useSearchParams();
  const { profile } = useLearningProfile();

  // everything you previously had in /learn/page.tsx goes here
  return (
    <div className="p-8">
      {/* your existing learn UI */}
    </div>
  );
}
