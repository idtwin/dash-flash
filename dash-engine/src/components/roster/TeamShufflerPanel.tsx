"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useDashStore } from "@/store/useDashStore";
import { GradeProfile, TeamCount } from "@/store/dashTypes";
import { CLASS_ROSTERS } from "@/data/classRosters";
import {
  Shuffle,
  Play,
  House,
  CheckCircle,
  XCircle,
} from "@phosphor-icons/react";

const GRADES: { id: GradeProfile; label: string }[] = [
  { id: "primary-1-3", label: "Primary (1-3)" },
  { id: "upper-elem-4-6", label: "Upper Elem (4-6)" },
  { id: "high-a1", label: "High (A1)" },
  { id: "high-adv", label: "High (Adv)" },
];

export function TeamShufflerPanel() {
  const gradeProfile = useDashStore((s) => s.gradeProfile);
  const setGradeProfile = useDashStore((s) => s.setGradeProfile);
  const teams = useDashStore((s) => s.teams);
  const setTeamCount = useDashStore((s) => s.setTeamCount);
  const shuffleAndBalanceTeams = useDashStore((s) => s.shuffleAndBalanceTeams);
  const setGameState = useDashStore((s) => s.setGameState);

  const [activeRoster, setActiveRoster] = useState<string[]>(
    CLASS_ROSTERS[gradeProfile]?.defaultRoster || []
  );
  const [presentMap, setPresentMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    (CLASS_ROSTERS[gradeProfile]?.defaultRoster || []).forEach((n) => (map[n] = true));
    return map;
  });

  const handleGradeChange = (grade: GradeProfile) => {
    setGradeProfile(grade);
    const newRoster = CLASS_ROSTERS[grade]?.defaultRoster || [];
    setActiveRoster(newRoster);
    const map: Record<string, boolean> = {};
    newRoster.forEach((n) => (map[n] = true));
    setPresentMap(map);
  };

  const toggleStudent = (name: string) => {
    setPresentMap((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleShuffle = () => {
    const presentStudents = activeRoster.filter((name) => presentMap[name]);
    if (presentStudents.length === 0) return;
    shuffleAndBalanceTeams(presentStudents, teams.length as TeamCount);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="h-screen w-screen overflow-hidden select-none bg-[#1A103C] arcade-canvas p-6 flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 active:translate-y-0.5 rounded-2xl border-3 border-black text-white font-display font-black text-sm uppercase shadow-[0_4px_0_#000]"
        >
          <House size={20} weight="bold" />
          <span>MAIN MENU</span>
        </Link>

        <h1 className="font-display font-black text-2xl lg:text-3xl text-white text-outline tracking-wider">
          BACKSTAGE ROSTER SHUFFLER
        </h1>

        <Link
          href="/arena"
          onClick={() => setGameState("playing")}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#38B000] hover:bg-green-500 active:translate-y-0.5 rounded-2xl border-4 border-black text-white font-display font-black text-base uppercase tracking-wider shadow-[0_6px_0_#000]"
        >
          <Play size={20} weight="fill" />
          <span>LAUNCH ARENA</span>
        </Link>
      </div>

      {/* Grade Selector Tabs & Controls */}
      <div className="flex items-center justify-between gap-4 bg-[#23272A] p-3 rounded-2xl border-4 border-black shadow-[0_6px_0_#000]">
        <div className="flex gap-2">
          {GRADES.map((g) => (
            <button
              key={g.id}
              onClick={() => handleGradeChange(g.id)}
              className={`px-4 py-1.5 rounded-xl border-2 border-black font-display font-black text-xs uppercase cursor-pointer ${
                gradeProfile === g.id
                  ? "bg-[#00B4D8] text-white shadow-[0_2px_0_#000]"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-yellow-300">TEAMS:</span>
            <div className="flex gap-1">
              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => setTeamCount(num as TeamCount)}
                  className={`px-2.5 py-1 rounded-lg border-2 border-black font-black text-xs ${
                    teams.length === num
                      ? "bg-[#FFB703] text-black shadow-[0_2px_0_#000]"
                      : "bg-gray-800 text-gray-300"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleShuffle}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FF4655] hover:bg-red-500 active:translate-y-0.5 rounded-xl border-3 border-black text-white font-display font-black text-xs uppercase shadow-[0_3px_0_#000] cursor-pointer"
          >
            <Shuffle size={18} weight="bold" />
            <span>SHUFFLE & BALANCE</span>
          </button>
        </div>
      </div>

      {/* Main Roster & Teams Preview */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 my-3 max-h-[64vh]">
        {/* Attendance Toggler Column */}
        <div className="bg-white rounded-3xl border-5 border-black p-4 flex flex-col shadow-[0_8px_0_#000]">
          <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-2">
            <span className="font-display font-black text-xs text-gray-700 uppercase">
              STUDENT ATTENDANCE ({activeRoster.filter((n) => presentMap[n]).length}/{activeRoster.length})
            </span>
          </div>
          <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-2 pr-1">
            {activeRoster.map((name) => {
              const isPresent = presentMap[name];
              return (
                <button
                  key={name}
                  onClick={() => toggleStudent(name)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl border-2 border-black text-xs font-black cursor-pointer transition-all ${
                    isPresent
                      ? "bg-[#D8F3DC] text-green-900 border-green-800"
                      : "bg-gray-200 text-gray-500 border-gray-400 opacity-60"
                  }`}
                >
                  <span className="truncate">{name}</span>
                  {isPresent ? (
                    <CheckCircle size={16} weight="fill" className="text-green-600" />
                  ) : (
                    <XCircle size={16} weight="fill" className="text-gray-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Teams Pods Preview Columns */}
        <div className="md:col-span-2 grid grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto pr-1">
          {teams.map((t) => (
            <div
              key={t.id}
              style={{ borderColor: t.color }}
              className="bg-[#23272A] rounded-2xl border-4 p-3 flex flex-col shadow-[0_4px_0_#000]"
            >
              <div
                style={{ backgroundColor: t.color }}
                className="py-1 px-2 rounded-xl border-2 border-black text-white text-outline-sm font-display font-black text-sm uppercase text-center mb-2 shadow-[0_2px_0_#000]"
              >
                {t.name} ({t.students.length})
              </div>
              <div className="flex-1 flex flex-col gap-1 overflow-y-auto">
                {t.students.length === 0 ? (
                  <span className="text-[11px] text-gray-500 font-bold italic text-center my-auto">
                    No members yet
                  </span>
                ) : (
                  t.students.map((student, sIdx) => (
                    <div
                      key={sIdx}
                      className="px-2 py-1 bg-black/40 rounded-lg text-xs font-black text-white flex items-center justify-between"
                    >
                      <span>{student}</span>
                      {sIdx === t.activeStudentIndex && (
                        <span className="text-[9px] px-1.5 bg-yellow-300 text-black font-display font-black rounded uppercase">
                          UP NEXT
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
