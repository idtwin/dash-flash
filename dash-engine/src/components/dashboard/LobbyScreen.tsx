"use client";

import React from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useDashStore } from "@/store/useDashStore";
import { useJoinBaseUrl } from "@/hooks/useJoinBaseUrl";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  Users,
  Play,
  UserPlus,
  House,
  Sparkle,
} from "@phosphor-icons/react";

const SAMPLE_NAMES = ["Oliver", "Sophia", "Lucas", "Amelia", "Liam", "Ava", "Noah", "Isabella"];

export function LobbyScreen() {
  const roomCode = useDashStore((s) => s.roomCode);
  const connectedStudents = useDashStore((s) => s.connectedStudents);
  const teams = useDashStore((s) => s.teams);
  const setGameState = useDashStore((s) => s.setGameState);
  const addStudent = useDashStore((s) => s.addStudent);

  const baseUrl = useJoinBaseUrl();
  const joinUrl = baseUrl ? `${baseUrl}/student?code=${roomCode}` : `/student?code=${roomCode}`;

  const handleAddTestPlayer = () => {
    const randomName = SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
    addStudent(randomName);
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
          <span>EXIT TO MENU</span>
        </Link>

        <div className="flex items-center gap-2">
          <Sparkle size={24} weight="fill" className="text-yellow-400 animate-spin" />
          <h1 className="font-display font-black text-2xl lg:text-3xl text-white text-outline tracking-wider">
            D.A.S.H. ARENA LOBBY
          </h1>
        </div>

        <button
          onClick={() => setGameState("playing")}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#38B000] hover:bg-green-500 active:translate-y-0.5 rounded-2xl border-4 border-black text-white font-display font-black text-base uppercase tracking-wider shadow-[0_6px_0_#000] cursor-pointer"
        >
          <Play size={22} weight="fill" />
          <span>START MATCH</span>
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 my-auto max-h-[78vh] items-center">
        {/* Left Column: QR Code & Big Room Code */}
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl border-5 border-black shadow-[0_12px_0_#000]">
          <span className="text-xs font-black uppercase text-gray-500 font-display tracking-widest mb-2">
            SCAN WITH SMARTPHONE
          </span>

          <div className="p-4 bg-white rounded-2xl border-4 border-black shadow-[0_4px_0_#000]">
            <QRCodeSVG value={joinUrl} size={220} level="M" />
          </div>

          <div className="mt-4 flex flex-col items-center">
            <span className="text-xs font-black text-gray-500 uppercase tracking-wider font-display">
              ROOM CODE
            </span>
            <span className="text-5xl font-black font-display text-gray-900 tracking-widest">
              {roomCode}
            </span>
          </div>

          <span className="mt-2 text-[11px] font-bold text-gray-400 truncate max-w-xs text-center">
            {joinUrl}
          </span>

          {isSupabaseConfigured ? (
            <span className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 rounded-full text-[11px] font-black tracking-wide border-2 border-green-500 shadow-[0_2px_0_#000]">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              SUPABASE CLOUD SYNC LIVE
            </span>
          ) : (
            <span
              className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-[11px] font-black tracking-wide border-2 border-amber-500 shadow-[0_2px_0_#000]"
              title="Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to Vercel/env.local for mobile phone syncing"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              LOCAL MODE (SET SUPABASE IN VERCEL)
            </span>
          )}
        </div>

        {/* Right Column: Connected Students Grid */}
        <div className="flex flex-col h-full max-h-[480px] p-6 bg-[#23272A] rounded-3xl border-5 border-black shadow-[0_12px_0_#000] justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-white/20 pb-3 mb-4">
              <div className="flex items-center gap-2 text-white font-display font-black text-lg">
                <Users size={22} weight="fill" className="text-cyan-400" />
                <span>CONNECTED PLAYERS ({connectedStudents.length})</span>
              </div>

              <button
                onClick={handleAddTestPlayer}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFB703] hover:bg-yellow-400 text-black font-display font-black text-xs uppercase rounded-xl border-2 border-black shadow-[0_2px_0_#000] cursor-pointer"
              >
                <UserPlus size={16} weight="bold" />
                <span>+ TEST PLAYER</span>
              </button>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-2 gap-2.5 overflow-y-auto max-h-[320px] pr-1">
              {connectedStudents.length === 0 ? (
                <div className="col-span-2 py-12 flex flex-col items-center justify-center text-gray-400 text-sm font-bold">
                  <span>Waiting for students to scan QR code...</span>
                </div>
              ) : (
                connectedStudents.map((std) => {
                  const team = teams.find((t) => t.id === std.teamId) || teams[0];
                  return (
                    <div
                      key={std.id}
                      style={{ borderColor: team?.color || "#fff" }}
                      className="flex items-center justify-between p-2.5 bg-black/40 rounded-xl border-2 shadow-[0_2px_0_#000]"
                    >
                      <span className="font-black text-sm text-white truncate mr-2">
                        {std.name}
                      </span>
                      <span
                        style={{ backgroundColor: team?.color || "#666" }}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-black font-display text-white text-outline-sm uppercase"
                      >
                        {team?.name || "Team"}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="text-center pt-2 text-xs font-bold text-gray-400 border-t border-white/10">
            Press <strong className="text-yellow-400 font-display">START MATCH</strong> when your class is assembled!
          </div>
        </div>
      </div>
    </div>
  );
}
