"use client";

import React from "react";
import { useDashStore } from "@/store/useDashStore";
import { getPromptForGrade } from "./stagePrompts";
import { CartoonBombTimer } from "./CartoonBombTimer";
import { MicrophoneStage, Lightbulb } from "@phosphor-icons/react";

const STARTER_COLORS = ["#FF4655", "#00B4D8", "#FFB703", "#38B000"];
const STARTER_LETTERS = ["A", "B", "C", "D"];

export function CenterStageCard() {
  const gradeProfile = useDashStore((s) => s.gradeProfile);
  const promptIndex = useDashStore((s) => s.promptIndex);
  const teams = useDashStore((s) => s.teams);
  const activeTeamIndex = useDashStore((s) => s.activeTeamIndex);

  const curTeam = teams[activeTeamIndex] || teams[0];
  const activeSpeaker =
    curTeam?.students?.[curTeam.activeStudentIndex] || "Current Speaker";

  const stageData = getPromptForGrade(gradeProfile, promptIndex);

  return (
    <div className="relative w-full flex-1 max-h-[58vh] bg-white rounded-3xl border-5 border-black shadow-[0_12px_0_#000000] p-6 text-black select-none flex flex-col justify-between transform -rotate-[0.5deg] transition-transform">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between border-b-3 border-black pb-3">
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1 bg-[#1A103C] text-white font-display font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[0_2px_0_#000]">
            {stageData.category}
          </span>
          <div className="flex items-center gap-1.5 px-3.5 py-1 bg-yellow-300 font-display font-black text-xs text-black uppercase tracking-wider rounded-xl border-2 border-black shadow-[0_2px_0_#000]">
            <MicrophoneStage size={16} weight="fill" />
            <span>SPOTLIGHT: {activeSpeaker} ({curTeam?.name})</span>
          </div>
        </div>

        {/* Hint Chips */}
        <div className="flex items-center gap-2">
          {stageData.hints.map((hint, i) => (
            <div
              key={i}
              className="flex items-center gap-1 px-2.5 py-0.5 bg-gray-100 rounded-lg text-xs font-bold text-gray-700 border border-gray-300"
            >
              <Lightbulb size={13} weight="fill" className="text-yellow-500" />
              <span>{hint}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Center Content: Question + Bomb Timer */}
      <div className="flex items-center justify-between gap-6 my-auto py-2">
        <div className="flex-1 pr-4">
          <h2 className="text-3xl lg:text-[40px] font-black font-body text-gray-900 leading-tight tracking-tight">
            {stageData.prompt}
          </h2>
        </div>

        {/* Floating Bomb Timer on Right Edge */}
        <div className="shrink-0 flex items-center justify-center pl-2">
          <CartoonBombTimer />
        </div>
      </div>

      {/* 4 Chunky Speaking Starters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
        {stageData.starters.map((starter, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-2xl border-3 border-black shadow-[0_4px_0_#000] hover:translate-y-[-2px] transition-transform"
          >
            <span
              style={{ backgroundColor: STARTER_COLORS[idx % 4] }}
              className="w-7 h-7 rounded-xl border-2 border-black text-white font-display font-black text-xs flex items-center justify-center shadow-[0_2px_0_#000] shrink-0"
            >
              {STARTER_LETTERS[idx % 4]}
            </span>
            <span className="text-xs lg:text-sm font-black text-gray-800 line-clamp-2">
              &ldquo;{starter}&rdquo;
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
