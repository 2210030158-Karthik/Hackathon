"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type LearningProfile = {
  familiarity: "beginner" | "intermediate" | "advanced";
  pace: "slow" | "normal" | "fast";
  preference: "examples" | "theory" | "balanced";
};

const defaultProfile: LearningProfile = {
  familiarity: "intermediate",
  pace: "normal",
  preference: "balanced",
};

const LearningProfileContext = createContext<{
  profile: LearningProfile;
  updateProfile: (p: LearningProfile) => void;
}>({
  profile: defaultProfile,
  updateProfile: () => {},
});

export function LearningProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<LearningProfile>(defaultProfile);

  useEffect(() => {
    const stored = localStorage.getItem("learningProfile");
    if (stored) setProfile(JSON.parse(stored));
  }, []);

  function updateProfile(p: LearningProfile) {
    setProfile(p);
    localStorage.setItem("learningProfile", JSON.stringify(p));
  }

  return (
    <LearningProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </LearningProfileContext.Provider>
  );
}

export function useLearningProfile() {
  return useContext(LearningProfileContext);
}
