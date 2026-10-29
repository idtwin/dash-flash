"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useDashStore } from "@/store/useDashStore";
import { useRoomChannel } from "@/hooks/useRoomChannel";
import { useUrlRoomCode } from "@/hooks/useUrlRoomCode";
import { SYNC_EVENTS, DashActionPayload } from "@/lib/syncProtocol";
import { PadUtilityRow } from "@/components/pad/PadUtilityRow";
import {
  CheckCircle,
  WarningCircle,
  ArrowRight,
  House,
  Broadcast,
} from "@phosphor-icons/react";

function TeacherPadInner() {
  const store = useDashStore();
  const urlCode = useUrlRoomCode(store.roomCode);
  const [activeCode, setActiveCode] = useState(urlCode || store.roomCode);

  const { broadcast, syncStatus } = useRoomChannel(activeCode, () => {});

  const sendAction = (payload: DashActionPayload) => {
    // Send over Realtime/BroadcastChannel
    broadcast(SYNC_EVENTS.DASH_ACTION, payload);
    // Also apply locally if running on same store instance
    if (payload.action === "ADD_POINTS") {
      store.addPoints(payload.teamIndex ?? store.activeTeamIndex, payload.amount ?? 100);
    } else if (payload.action === "STRIKE") {
      store.addPoints(payload.teamIndex ?? store.activeTeamIndex, -50);
    } else if (payload.action === "NEXT_TURN") {
      store.nextTurn();
    } else if (payload.action === "TOGGLE_TIMER") {
      store.toggleTimer();
    } else if (payload.action === "RESET_TIMER") {
      store.resetTimer();
    } else if (payload.action === "CYCLE_MULTIPLIER") {
      store.cycleMultiplier();
    }
  };

  const curTeam = store.teams[store.activeTeamIndex] || store.teams[0];
  const activeSpeaker =
    curTeam?.students?.[curTeam.activeStudentIndex] || "Speaker Ready";

  return (
    <main className="min-h-screen w-screen bg-[#1A103C] p-4 flex flex-col justify-between text-white select-none">
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between border-b-2 border-white/20 pb-3">
        <Link
          href="/"
          className="p-2 bg-gray-800 rounded-xl border-2 border-black"
        >
          <House size={20} weight="bold" />
        </Link>

        <div className="flex items-center gap-2">
          {syncStatus === "connected" ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-950/70 border border-green-500 rounded-lg text-green-300 text-xs font-black">
              <Broadcast size={15} weight="fill" className="text-green-400 animate-pulse" />
              <span>CLOUD LIVE</span>
            </div>
          ) : syncStatus === "connecting" ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-yellow-950/70 border border-yellow-500 rounded-lg text-yellow-300 text-xs font-black">
              <Broadcast size={15} weight="fill" className="text-yellow-400 animate-spin" />
              <span>CONNECTING</span>
            </div>
          ) : syncStatus === "error" ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-950/70 border border-red-500 rounded-lg text-red-300 text-xs font-black">
              <Broadcast size={15} weight="fill" className="text-red-400" />
              <span>SYNC ERROR</span>
            </div>
          ) : (
            <div
              className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-950/70 border border-amber-500 rounded-lg text-amber-300 text-xs font-black"
              title="BroadcastChannel local fallback only. Set Supabase env in Vercel for cross-device."
            >
              <Broadcast size={15} weight="fill" className="text-amber-400" />
              <span>LOCAL ONLY</span>
            </div>
          )}
          <span className="font-display font-black text-sm uppercase tracking-wider">
            PAD: {activeCode}
          </span>
        </div>

        <input
          type="text"
          value={activeCode}
          maxLength={4}
          onChange={(e) => setActiveCode(e.target.value.toUpperCase())}
          className="w-16 px-2 py-1 bg-black/60 border-2 border-white/30 rounded-lg text-center font-display font-black text-xs uppercase"
        />
      </div>

      {/* Speaker Spotlight Pod */}
      <div
        style={{ backgroundColor: curTeam?.color || "#FF4655" }}
        className="w-full p-4 rounded-3xl border-4 border-black shadow-[0_8px_0_#000] flex items-center justify-between my-2"
      >
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-black/80 bg-white/70 px-2 py-0.5 rounded-md w-fit">
            TEAM: {curTeam?.name}
          </span>
          <span className="text-2xl font-black font-display text-outline mt-1 truncate">
            {activeSpeaker}
          </span>
        </div>
        <div className="text-right">
          <span className="text-3xl font-black font-display text-outline">
            {store.timerSeconds}s
          </span>
        </div>
      </div>

      {/* Massive Thumb Zone Action Buttons */}
      <div className="flex-1 flex flex-col gap-3 my-2 justify-center">
        <button
          onClick={() => sendAction({ action: "ADD_POINTS", amount: 100 })}
          className="w-full py-5 bg-[#38B000] hover:bg-green-500 active:translate-y-1.5 rounded-3xl border-5 border-black font-display font-black text-2xl uppercase tracking-wider shadow-[0_8px_0_#000] flex items-center justify-center gap-3 cursor-pointer"
        >
          <CheckCircle size={32} weight="fill" />
          <span>CORRECT (+{100 * store.multiplier})</span>
        </button>

        <button
          onClick={() => sendAction({ action: "STRIKE" })}
          className="w-full py-4 bg-[#FF4655] hover:bg-red-500 active:translate-y-1.5 rounded-3xl border-5 border-black font-display font-black text-xl uppercase tracking-wider shadow-[0_8px_0_#000] flex items-center justify-center gap-3 cursor-pointer"
        >
          <WarningCircle size={28} weight="fill" />
          <span>OOPS / STRIKE (-50)</span>
        </button>

        <button
          onClick={() => sendAction({ action: "NEXT_TURN" })}
          className="w-full py-4 bg-[#FFB703] hover:bg-yellow-400 active:translate-y-1.5 rounded-3xl border-5 border-black text-black font-display font-black text-xl uppercase tracking-wider shadow-[0_8px_0_#000] flex items-center justify-center gap-3 cursor-pointer"
        >
          <span>NEXT SPEAKER</span>
          <ArrowRight size={28} weight="bold" />
        </button>
      </div>

      {/* Instant Control Row */}
      <PadUtilityRow
        isTimerRunning={store.isTimerRunning}
        multiplier={store.multiplier}
        onToggleTimer={() => sendAction({ action: "TOGGLE_TIMER" })}
        onResetTimer={() => sendAction({ action: "RESET_TIMER" })}
        onCycleMultiplier={() => sendAction({ action: "CYCLE_MULTIPLIER" })}
      />
    </main>
  );
}

export default function TeacherPadPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white">Loading Pad...</div>}>
      <TeacherPadInner />
    </Suspense>
  );
}
