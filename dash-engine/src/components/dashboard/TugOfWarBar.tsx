"use client";

import React from "react";
import { motion } from "motion/react";
import { useDashStore } from "@/store/useDashStore";
import { Sword, HandTap } from "@phosphor-icons/react";

export function TugOfWarBar() {
  const tugMeter = useDashStore((s) => s.tugOfWarMeter);
  const gameState = useDashStore((s) => s.gameState);
  const setGameState = useDashStore((s) => s.setGameState);
  const teams = useDashStore((s) => s.teams);

  const leftTeam = teams[0] || { name: "Team 1", color: "#FF4655" };
  const rightTeam = teams[1] || { name: "Team 2", color: "#00B4D8" };

  const isVoting = gameState === "voting";

  return (
    <div className="w-full flex flex-col gap-2 select-none">
      <div className="flex items-center justify-between px-2 text-sm font-black">
        <span
          className="px-3 py-1 rounded-xl border-2 border-black text-white text-outline-sm shadow-[0_2px_0_#000]"
          style={{ backgroundColor: leftTeam.color }}
        >
          {leftTeam.name}: {100 - tugMeter}%
        </span>

        <button
          onClick={() => setGameState(isVoting ? "playing" : "voting")}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl border-2 border-black font-display text-xs uppercase tracking-wider font-black shadow-[0_3px_0_#000] cursor-pointer transition-transform active:translate-y-0.5 ${
            isVoting
              ? "bg-[#38B000] text-white hover:bg-green-500 animate-pulse"
              : "bg-[#FFB703] text-black hover:bg-yellow-400"
          }`}
        >
          {isVoting ? (
            <>
              <HandTap size={16} weight="fill" />
              PEER VOTING LIVE!
            </>
          ) : (
            <>
              <Sword size={16} weight="bold" />
              START VOTE BATTLE
            </>
          )}
        </button>

        <span
          className="px-3 py-1 rounded-xl border-2 border-black text-white text-outline-sm shadow-[0_2px_0_#000]"
          style={{ backgroundColor: rightTeam.color }}
        >
          {rightTeam.name}: {tugMeter}%
        </span>
      </div>

      {/* Meter Track */}
      <div className="relative w-full h-8 bg-gray-900 rounded-2xl border-4 border-black shadow-[0_4px_0_#000] overflow-hidden flex">
        {/* Left Side Fill */}
        <div
          className="h-full transition-all duration-300 ease-out flex items-center justify-start pl-3 text-xs font-black text-white"
          style={{
            width: `${100 - tugMeter}%`,
            backgroundColor: leftTeam.color,
          }}
        />

        {/* Right Side Fill */}
        <div
          className="h-full transition-all duration-300 ease-out flex items-center justify-end pr-3 text-xs font-black text-white"
          style={{
            width: `${tugMeter}%`,
            backgroundColor: rightTeam.color,
          }}
        />

        {/* Center Sliding "VS" Knot Marker */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#FFD166] border-3 border-black shadow-[0_3px_0_#000] flex items-center justify-center font-display font-black text-black text-sm pointer-events-none z-10"
          animate={{ left: `${tugMeter}%` }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
        >
          VS
        </motion.div>
      </div>
    </div>
  );
}
