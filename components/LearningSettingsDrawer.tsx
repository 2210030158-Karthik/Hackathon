"use client";

import { motion } from "framer-motion";
import { useLearningProfile } from "./LearningProfileContext";

export default function LearningSettingsDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { profile, updateProfile } = useLearningProfile();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
        />
      )}

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: open ? 0 : "100%" }}
        transition={{ type: "tween" }}
        className="fixed top-0 right-0 h-full w-80 bg-white text-gray-900 z-50 shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-6">
          Learning Preferences
        </h2>

        {/* Familiarity */}
        <section className="mb-4">
          <p className="font-medium mb-2">Familiarity</p>
          {["beginner", "intermediate", "advanced"].map((level) => (
            <label key={level} className="block">
              <input
                type="radio"
                checked={profile.familiarity === level}
                onChange={() =>
                  updateProfile({ ...profile, familiarity: level as any })
                }
              />{" "}
              {level}
            </label>
          ))}
        </section>

        {/* Pace */}
        <section className="mb-4">
          <p className="font-medium mb-2">Learning Pace</p>
          {["slow", "normal", "fast"].map((pace) => (
            <label key={pace} className="block">
              <input
                type="radio"
                checked={profile.pace === pace}
                onChange={() =>
                  updateProfile({ ...profile, pace: pace as any })
                }
              />{" "}
              {pace}
            </label>
          ))}
        </section>

        {/* Preference */}
        <section>
          <p className="font-medium mb-2">Explanation Style</p>
          {["examples", "theory", "balanced"].map((pref) => (
            <label key={pref} className="block">
              <input
                type="radio"
                checked={profile.preference === pref}
                onChange={() =>
                  updateProfile({ ...profile, preference: pref as any })
                }
              />{" "}
              {pref}
            </label>
          ))}
        </section>
      </motion.div>
    </>
  );
}
