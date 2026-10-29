"use client";

import React from "react";
import { useDashStore } from "@/store/useDashStore";
import { GradeProfile, GameModeId, TeamCount } from "@/store/dashTypes";
import { X, Sliders, ArrowCounterClockwise } from "@phosphor-icons/react";

interface QuickSetupPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const GRADES: { id: GradeProfile; label: string }[] = [
  { id: "primary-1-3", label: "Primary (1-3)" },
  { id: "upper-elem-4-6", label: "Upper Elem (4-6)" },
  { id: "high-a1", label: "High (A1)" },
  { id: "high-adv", label: "High (Adv)" },
];

const MODES: { id: GameModeId; label: string }[] = [
  { id: "rapid-fire", label: "Rapid Fire" },
  { id: "sentence-scramble", label: "Scramble" },
  { id: "beat-the-bomb", label: "Beat Bomb" },
];

export function QuickSetupPanel({ isOpen, onClose }: QuickSetupPanelProps) {
  const gradeProfile = useDashStore((s) => s.gradeProfile);
  const setGradeProfile = useDashStore((s) => s.setGradeProfile);
  const activeGameMode = useDashStore((s) => s.activeGameMode);
  const setActiveGameMode = useDashStore((s) => s.setActiveGameMode);
  const teams = useDashStore((s) => s.teams);
  const setTeamCount = useDashStore((s) => s.setTeamCount);
  const resetTimer = useDashStore((s) => s.resetTimer);
  const resetLobby = useDashStore((s) => s.resetLobby);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-none flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg bg-[#23272A] rounded-3xl border-5 border-black shadow-[0_12px_0_#000] p-6 text-white flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-white/20 pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={24} weight="bold" className="text-yellow-400" />
            <h3 className="font-display font-black text-xl tracking-wide uppercase">
              Arena Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl bg-gray-700 hover:bg-gray-600 border-2 border-black"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {/* Grade Profile */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-black uppercase text-yellow-300">Grade Tier</label>
          <div className="grid grid-cols-2 gap-2">
            {GRADES.map((g) => (
              <button
                key={g.id}
                onClick={() => setGradeProfile(g.id)}
                className={`py-2 px-3 rounded-xl border-2 border-black font-display font-black text-xs uppercase cursor-pointer ${
                  gradeProfile === g.id
                    ? "bg-[#00B4D8] text-white shadow-[0_3px_0_#000]"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Game Mode */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-black uppercase text-yellow-300">Game Mode</label>
          <div className="grid grid-cols-3 gap-2">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveGameMode(m.id)}
                className={`py-2 px-2 rounded-xl border-2 border-black font-display font-black text-xs uppercase cursor-pointer ${
                  activeGameMode === m.id
                    ? "bg-[#FFB703] text-black shadow-[0_3px_0_#000]"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Team Count & Timer Quick Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black uppercase text-yellow-300">Teams ({teams.length})</label>
            <div className="flex gap-1.5">
              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => setTeamCount(num as TeamCount)}
                  className={`flex-1 py-1.5 rounded-lg border-2 border-black font-black text-xs ${
                    teams.length === num
                      ? "bg-[#38B000] text-white"
                      : "bg-gray-800 text-gray-300"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black uppercase text-yellow-300">Timer Secs</label>
            <div className="flex gap-1.5">
              {[30, 45, 60, 90].map((sec) => (
                <button
                  key={sec}
                  onClick={() => resetTimer(sec)}
                  className="flex-1 py-1.5 rounded-lg border-2 border-black font-black text-xs bg-gray-800 hover:bg-gray-700 text-gray-300"
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between border-t-2 border-white/20 pt-3">
          <button
            onClick={() => {
              if (confirm("Reset current game scores and lobby?")) {
                resetLobby();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF4655] hover:bg-red-600 rounded-xl border-2 border-black text-xs font-black uppercase"
          >
            <ArrowCounterClockwise size={16} weight="bold" />
            <span>Reset Match</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-display font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[0_3px_0_#000]"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
}
