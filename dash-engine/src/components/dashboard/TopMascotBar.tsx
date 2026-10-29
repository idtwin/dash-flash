"use client";

import React, { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { useDashStore } from "@/store/useDashStore";
import { MascotIconType } from "@/store/dashTypes";
import {
  PawPrint,
  Fish,
  Flame,
  Moon,
  Shield,
  Plant,
  Crown,
} from "@phosphor-icons/react";

function renderMascotIcon(type: MascotIconType) {
  switch (type) {
    case "dragon":
      return <Flame size={24} weight="fill" />;
    case "shark":
      return <Fish size={24} weight="fill" />;
    case "tiger":
      return <PawPrint size={24} weight="fill" />;
    case "frog":
      return <Plant size={24} weight="fill" />;
    case "bear":
      return <Shield size={24} weight="fill" />;
    case "wolf":
      return <Moon size={24} weight="fill" />;
    default:
      return <Crown size={24} weight="fill" />;
  }
}

export function TopMascotBar() {
  const teams = useDashStore((s) => s.teams);
  const activeTeamIndex = useDashStore((s) => s.activeTeamIndex);
  const addPoints = useDashStore((s) => s.addPoints);

  const prevScoresRef = useRef<number[]>([]);

  useEffect(() => {
    teams.forEach((t, i) => {
      const prev = prevScoresRef.current[i] ?? t.score;
      if (t.score > prev) {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.15, x: (i + 0.5) / teams.length },
          colors: [t.color, "#FFD166", "#FFFFFF"],
        });
      }
    });
    prevScoresRef.current = teams.map((t) => t.score);
  }, [teams]);

  return (
    <div className="w-full flex items-center justify-between gap-3 px-4 py-2 select-none">
      {teams.map((team, idx) => {
        const isActive = idx === activeTeamIndex;
        const currentStudent =
          team.students[team.activeStudentIndex] || `Player ${idx + 1}`;

        return (
          <div
            key={team.id}
            onClick={() => addPoints(idx, 100)}
            style={{ backgroundColor: team.color }}
            className={`flex-1 min-w-0 flex flex-col items-center justify-center p-2.5 rounded-2xl border-4 border-black transition-all duration-200 cursor-pointer shadow-[0_6px_0_#000] relative ${
              isActive
                ? "scale-105 ring-4 ring-yellow-300 ring-offset-2 ring-offset-[#1A103C] z-10"
                : "opacity-85 hover:opacity-100 hover:scale-[1.02]"
            }`}
          >
            {/* Active Turn Halo Badge */}
            {isActive && (
              <div className="absolute -top-3.5 bg-yellow-300 text-black border-2 border-black font-display font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-[0_2px_0_#000] animate-pulse">
                UP NOW: {currentStudent}
              </div>
            )}

            {/* Team Pod Header */}
            <div className="flex items-center gap-1.5 text-white text-outline-sm font-display font-black text-sm drop-shadow">
              {renderMascotIcon(team.mascotIcon)}
              <span className="truncate">{team.name}</span>
            </div>

            {/* Team Score */}
            <div className="text-2xl font-black font-display text-white text-outline tracking-wider">
              {team.score}
            </div>

            {/* Hotkey Indicator */}
            <span className="text-[10px] font-black uppercase text-black/80 bg-white/70 px-1.5 py-0.5 rounded-md mt-0.5">
              KEY [{idx + 1}] +100
            </span>
          </div>
        );
      })}
    </div>
  );
}
