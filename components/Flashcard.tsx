"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Flashcard({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="w-full h-56 perspective cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT */}
        <div className="absolute inset-0 bg-white rounded-xl shadow p-4 flex items-center justify-center text-gray-900 backface-hidden">
          <p className="font-semibold text-center">{question}</p>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 bg-indigo-600 text-white rounded-xl shadow p-4 flex items-center justify-center rotate-y-180 backface-hidden">
          <p className="text-center">{answer}</p>
        </div>
      </motion.div>
    </div>
  );
}
