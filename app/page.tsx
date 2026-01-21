"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EntryPage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("userProfile");
    if (user) {
      router.replace("/dashboard");
    } else {
      router.replace("/onboarding");
    }
  }, [router]);

  return null; // no UI by design
}
