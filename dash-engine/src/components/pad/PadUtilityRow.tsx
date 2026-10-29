"use client";

import React from "react";
import { Play, Pause, ArrowClockwise, Lightning } from "@phosphor-icons/react";
import { Multiplier } from "@/store/dashTypes";

interface PadUtilityRowProps {
  isTimerRunning: boolean;
  multiplier: Multiplier;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onCycleMultiplier: () => void;
}

export function PadUtilityRow({
  isTimerRunning,
  multiplier,
  onToggleTimer,
  onResetTimer,
  onCycleMultiplier,
}: PadUtilityRowProps) {
  return (
    <div className="w-full grid grid-cols-3 gap-3 select-none">
      {/* Timer Play / Pause */}
      <button
        onClick={onToggleTimer}
        className={`flex items-center justify-center gap-2 py-3 rounded-2xl border-4 border-black font-display font-black text-sm uppercase shadow-[0_5px_0_#000] cursor-pointer active:translate-y-1 transition-all ${
          isTimerRunning
            ? "bg-[#FF4655] text-white"
            : "bg-[#38B000] text-white"
        }`}
      >
        {isTimerRunning ? (
          <>
            <Pause size={20} weight="fill" />
            <span>PAUSE</span>
          </>
        ) : (
          <>
            <Play size={20} weight="fill" />
            <span>TIMER</span>
          </>
        )}
      </button>

      {/* Timer Reset */}
      <button
        onClick={onResetTimer}
        className="flex items-center justify-center gap-1.5 py-3 bg-[#FFB703] hover:bg-yellow-400 active:translate-y-1 rounded-2xl border-4 border-black text-black font-display font-black text-sm uppercase shadow-[0_5px_0_#000] cursor-pointer transition-all"
      >
        <ArrowClockwise size={20} weight="bold" />
        <span>RESET</span>
      </button>

      {/* Multiplier Boost */}
      <button
        onClick={onCycleMultiplier}
        className="flex items-center justify-center gap-1.5 py-3 bg-[#00B4D8] hover:bg-cyan-400 active:translate-y-1 rounded-2xl border-4 border-black text-white font-display font-black text-sm uppercase shadow-[0_5px_0_#000] cursor-pointer transition-all"
      >
        <Lightning size={20} weight="fill" />
        <span>{multiplier}X BOOST</span>
      </button>
    </div>
  );
}
