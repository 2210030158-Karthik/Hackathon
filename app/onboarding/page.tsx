"use client";

import { useRouter } from "next/navigation";
import { useLearningProfile } from "@/components/LearningProfileContext";

export default function OnboardingPage() {
  const router = useRouter();
  const { profile } = useLearningProfile();

  function finishOnboarding() {
    const userProfile = {
      degree: "Engineering",
      branch: "CSE",
    };

    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    // learningProfile already stored via context

    router.replace("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to LearnFlow AI
        </h1>

        <p className="text-gray-600 mb-6">
          We’ll personalize your learning experience for Computer Science Engineering.
        </p>

        <div className="mb-4">
          <p className="text-sm text-gray-500">Degree</p>
          <p className="font-medium">Engineering</p>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500">Branch</p>
          <p className="font-medium">Computer Science (CSE)</p>
        </div>

        <button
          onClick={finishOnboarding}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Go to Dashboard
        </button>
      </div>
    </main>
  );
}
