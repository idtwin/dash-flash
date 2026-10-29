"use client";

import React from "react";
import Link from "next/link";
import { useDashStore } from "@/store/useDashStore";
import {
  House,
  QrCode,
  ArrowRight,
  Lightning,
  Gear,
} from "@phosphor-icons/react";

interface BottomTelemetryBarProps {
  onToggleSetup: () => void;
}

export function BottomTelemetryBar({ onToggleSetup }: BottomTelemetryBarProps) {
  const roundNumber = useDashStore((s) => s.roundNumber);
  const totalRounds = useDashStore((s) => s.totalRounds);
  const multiplier = useDashStore((s) => s.multiplier);
  const teams = useDashStore((s) => s.teams);
  const nextTurn = useDashStore((s) => s.nextTurn);
  const cycleMultiplier = useDashStore((s) => s.cycleMultiplier);
  const setGameState = useDashStore((s) => s.setGameState);

  const t1 = teams[0] || { name: "Team 1", students: ["P1"] };
  const t2 = teams[1] || { name: "Team 2", students: ["P2"] };
  const p1 = t1.students?.[t1.activeStudentIndex] || "Challenger 1";
  const p2 = t2.students?.[t2.activeStudentIndex] || "Challenger 2";

  return (
    <div className="w-full flex items-center justify-between gap-3 px-4 py-2 select-none">
      {/* Left Action Buttons */}
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-800 hover:bg-gray-700 active:translate-y-0.5 rounded-2xl border-3 border-black text-white font-display font-black text-xs uppercase tracking-wider shadow-[0_4px_0_#000] cursor-pointer"
        >
          <House size={18} weight="bold" />
          <span>MENU</span>
        </Link>

        <button
          onClick={() => setGameState("lobby")}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#00B4D8] hover:bg-cyan-400 active:translate-y-0.5 rounded-2xl border-3 border-black text-white font-display font-black text-xs uppercase tracking-wider shadow-[0_4px_0_#000] cursor-pointer"
        >
          <QrCode size={18} weight="bold" />
          <span>QR LOBBY</span>
        </button>
      </div>

      {/* Center Duel Matchup & Round */}
      <div className="flex items-center gap-3">
        <div className="px-4 py-1.5 bg-[#23272A] rounded-2xl border-3 border-black shadow-[0_4px_0_#000] flex items-center gap-2">
          <span className="text-xs font-black text-yellow-300 font-display uppercase tracking-wider">
            DUEL:
          </span>
          <span className="text-sm font-black font-body text-white">
            {p1} <span className="text-yellow-400">VS</span> {p2}
          </span>
        </div>

        <div className="px-3.5 py-1.5 bg-black/60 rounded-2xl border-2 border-white/20 text-white font-display font-black text-xs">
          ROUND {String(roundNumber).padStart(2, "0")}/{String(totalRounds).padStart(2, "0")}
        </div>
      </div>

      {/* Right Controls: Multiplier, Next Turn, Setup */}
      <div className="flex items-center gap-2">
        {/* Multiplier Boost */}
        <button
          onClick={cycleMultiplier}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FF4655] hover:bg-red-500 active:translate-y-0.5 rounded-2xl border-3 border-black text-white font-display font-black text-xs uppercase tracking-wider shadow-[0_4px_0_#000] cursor-pointer"
        >
          <Lightning size={18} weight="fill" />
          <span>{multiplier}X BOOST (M)</span>
        </button>

        {/* Next Turn */}
        <button
          onClick={nextTurn}
          className="flex items-center gap-1.5 px-5 py-2 bg-[#38B000] hover:bg-green-500 active:translate-y-0.5 rounded-2xl border-3 border-black text-white font-display font-black text-sm uppercase tracking-wider shadow-[0_4px_0_#000] cursor-pointer"
        >
          <span>NEXT TURN</span>
          <ArrowRight size={18} weight="bold" />
        </button>

        {/* Setup Drawer Toggle */}
        <button
          onClick={onToggleSetup}
          className="p-2 bg-gray-700 hover:bg-gray-600 active:translate-y-0.5 rounded-2xl border-3 border-black text-white shadow-[0_4px_0_#000] cursor-pointer"
          title="Quick Setup"
        >
          <Gear size={20} weight="bold" />
        </button>
      </div>
    </div>
  );
}
