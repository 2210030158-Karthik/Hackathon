import { Suspense } from "react";
import LearnClient from "./LearnClient";

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading…</div>}>
      <LearnClient />
    </Suspense>
  );
}
