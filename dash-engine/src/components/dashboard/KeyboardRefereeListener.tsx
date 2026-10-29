"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashStore } from "@/store/useDashStore";

export function KeyboardRefereeListener() {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if user is focused inside input or textarea
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const store = useDashStore.getState();

      // Number keys 1-6: Award +100 points to team
      if (e.key >= "1" && e.key <= "6") {
        const teamIndex = parseInt(e.key, 10) - 1;
        if (teamIndex < store.teams.length) {
          e.preventDefault();
          store.addPoints(teamIndex, 100);
        }
        return;
      }

      // Space: Toggle bomb timer
      if (e.code === "Space") {
        e.preventDefault();
        store.toggleTimer();
        return;
      }

      // R: Reset bomb timer
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        store.resetTimer();
        return;
      }

      // Enter or N: Next turn
      if (e.key === "Enter" || e.key === "n" || e.key === "N") {
        e.preventDefault();
        store.nextTurn();
        return;
      }

      // M: Cycle multiplier
      if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        store.cycleMultiplier();
        return;
      }

      // Esc: Return to Main Menu
      if (e.key === "Escape") {
        e.preventDefault();
        router.push("/");
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return null;
}
