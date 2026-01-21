"use client";

import { useState } from "react";
import LearningSettingsDrawer from "./LearningSettingsDrawer";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="h-14 px-6 flex items-center justify-between border-b">
        <span className="font-bold text-lg">LearnFlow AI</span>

        <button
          onClick={() => setOpen(true)}
          className="text-xl"
          aria-label="Learning settings"
        >
          ⚙️
        </button>
      </nav>

      <LearningSettingsDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
