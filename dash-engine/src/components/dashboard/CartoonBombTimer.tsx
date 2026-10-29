"use client";

import React, { useEffect } from "react";
import { useDashStore } from "@/store/useDashStore";
import { Sparkle, ArrowClockwise } from "@phosphor-icons/react";

export function CartoonBombTimer() {
  const timerSeconds = useDashStore((s) => s.timerSeconds);
  const maxTimerSeconds = useDashStore((s) => s.maxTimerSeconds);
  const isTimerRunning = useDashStore((s) => s.isTimerRunning);
  const toggleTimer = useDashStore((s) => s.toggleTimer);
  const resetTimer = useDashStore((s) => s.resetTimer);
  const tickTimer = useDashStore((s) => s.tickTimer);

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, tickTimer]);

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const isCritical = timerSeconds <= 5 && timerSeconds > 0;

  return (
    <div className="flex flex-col items-center select-none">
      {/* Top Fuse Assembly */}
      <div className="relative flex flex-col items-center">
        {/* Burning Spark */}
        {isTimerRunning && (
          <div className="absolute -top-6 -left-3 spark-animate text-[#FFD166]">
            <Sparkle size={32} weight="fill" />
          </div>
        )}

        {/* Rope Fuse */}
        <div className="w-2.5 h-6 bg-gradient-to-b from-[#D4A373] to-[#A97142] rounded-t border-2 border-black border-dashed" />

        {/* Metal Cap */}
        <div className="w-10 h-3.5 bg-gradient-to-r from-gray-400 via-gray-200 to-gray-500 rounded-t-lg border-2 border-black border-b-0 shadow-[0_2px_0_#000]" />
      </div>

      {/* Main Bomb Body */}
      <div
        onClick={toggleTimer}
        className={`relative flex items-center justify-center w-36 h-36 rounded-full border-[5px] border-black cursor-pointer transition-all duration-200 active:scale-95 shadow-[0_10px_0_#000000] ${
          isCritical
            ? "bg-[#FF4655] animate-bounce shadow-[0_10px_0_#990000]"
            : "bg-[#23272A] hover:bg-[#2C2F33]"
        }`}
      >
        {/* Specular Shine Crescent */}
        <div className="absolute top-2.5 left-4 w-7 h-4 bg-white/40 rounded-full rotate-[-30deg] blur-[0.5px]" />

        {/* Timer Digits */}
        <div className="flex flex-col items-center justify-center">
          <span className="text-3xl font-black font-display tracking-tight text-white text-outline">
            {formattedTime}
          </span>
          <span className="text-[11px] font-black uppercase tracking-wider text-yellow-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {isTimerRunning ? "PAUSE" : timerSeconds === 0 ? "EXPLODED" : "START"}
          </span>
        </div>

        {/* Quick Reset Pill Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            resetTimer(maxTimerSeconds);
          }}
          title="Reset Timer (R)"
          className="absolute -bottom-2 -right-2 p-1.5 bg-[#FFB703] hover:bg-yellow-400 active:translate-y-1 text-black rounded-full border-2 border-black shadow-[0_3px_0_#000] cursor-pointer"
        >
          <ArrowClockwise size={18} weight="bold" />
        </button>
      </div>
    </div>
  );
}
