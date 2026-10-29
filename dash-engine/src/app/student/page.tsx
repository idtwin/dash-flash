"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useUrlRoomCode } from "@/hooks/useUrlRoomCode";
import {
  saveLastStudentSession,
  getLastStudentSession,
} from "@/lib/studentProfile";
import { Sparkle, GameController, ArrowRight } from "@phosphor-icons/react";

function StudentEntryInner() {
  const router = useRouter();
  const urlCode = useUrlRoomCode("");

  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState(urlCode);

  useEffect(() => {
    const last = getLastStudentSession();
    queueMicrotask(() => {
      if (last.name) setName(last.name);
      if (urlCode) {
        setRoomCode(urlCode);
      } else if (last.roomCode) {
        setRoomCode(last.roomCode);
      }
    });
  }, [urlCode]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanCode = roomCode.trim().toUpperCase();
    if (!cleanName || !cleanCode) return;

    saveLastStudentSession(cleanName, cleanCode);
    router.push(`/student/play?name=${encodeURIComponent(cleanName)}&code=${encodeURIComponent(cleanCode)}`);
  };

  return (
    <main className="h-screen w-screen overflow-hidden select-none bg-[#1A103C] arcade-canvas p-6 flex flex-col justify-between items-center">
      {/* Brand Header */}
      <div className="flex flex-col items-center gap-1 text-center mt-4">
        <div className="flex items-center gap-2">
          <Sparkle size={24} weight="fill" className="text-yellow-400" />
          <span className="text-xs font-black uppercase tracking-widest text-cyan-300 font-display">
            PLAYER CONTROLLER
          </span>
          <Sparkle size={24} weight="fill" className="text-yellow-400" />
        </div>
        <h1 className="text-4xl font-black font-display text-white text-outline-lg tracking-tight">
          JOIN ARENA
        </h1>
      </div>

      {/* Main Tactile Form Block */}
      <form
        onSubmit={handleJoin}
        className="w-full max-w-sm bg-white rounded-3xl border-5 border-black shadow-[0_12px_0_#000] p-6 text-black flex flex-col gap-4 my-auto"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-black font-display uppercase tracking-wider text-gray-700">
            ROOM CODE (4 LETTERS)
          </label>
          <input
            type="text"
            required
            maxLength={4}
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="ABCD"
            className="w-full px-4 py-3 bg-gray-100 rounded-2xl border-3 border-black text-2xl font-black font-display uppercase text-center tracking-widest focus:bg-yellow-50 outline-none shadow-[0_3px_0_#000]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-black font-display uppercase tracking-wider text-gray-700">
            YOUR NAME OR NICKNAME
          </label>
          <input
            type="text"
            required
            maxLength={18}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Maya"
            className="w-full px-4 py-3 bg-gray-100 rounded-2xl border-3 border-black text-xl font-black font-body text-center focus:bg-yellow-50 outline-none shadow-[0_3px_0_#000]"
          />
        </div>

        <button
          type="submit"
          className="mt-2 w-full py-4 bg-[#38B000] hover:bg-green-500 active:translate-y-1 rounded-2xl border-4 border-black text-white font-display font-black text-xl uppercase tracking-wider shadow-[0_6px_0_#000] flex items-center justify-center gap-2 cursor-pointer transition-transform"
        >
          <GameController size={24} weight="fill" />
          <span>ENTER GAME</span>
          <ArrowRight size={22} weight="bold" />
        </button>
      </form>

      {/* Footer Info */}
      <div className="pb-4 text-center text-xs font-bold text-gray-400">
        No password needed • Quick local Wi-Fi sync
      </div>
    </main>
  );
}

export default function StudentEntryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white">Loading Portal...</div>}>
      <StudentEntryInner />
    </Suspense>
  );
}
