"use client";

import React from "react";
import { GameSnapshotPayload } from "@/lib/syncProtocol";
import { Sparkle, Television } from "@phosphor-icons/react";

interface StudentStatusCardsProps {
  studentName: string;
  assignedTeamName: string;
  assignedTeamColor: string;
  snapshot: GameSnapshotPayload | null;
}

export function StudentStatusCards({
  studentName,
  assignedTeamName,
  assignedTeamColor,
  snapshot,
}: StudentStatusCardsProps) {
  const activeSpeaker = snapshot?.activeSpeaker || "Speaker Ready";
  const isSelfSpeaking =
    studentName.toLowerCase().trim() === activeSpeaker.toLowerCase().trim();

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* Player Identity Badge */}
      <div
        style={{ backgroundColor: assignedTeamColor }}
        className="w-full p-4 rounded-3xl border-4 border-black shadow-[0_8px_0_#000] text-white flex items-center justify-between"
      >
        <div className="flex flex-col">
          <span className="text-[11px] font-black uppercase text-black/80 bg-white/70 px-2 py-0.5 rounded-md w-fit mb-1">
            PLAYER CARD
          </span>
          <span className="text-2xl font-black font-display text-outline truncate">
            {studentName}
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-xs font-black uppercase tracking-wider text-white drop-shadow">
            TEAM
          </span>
          <span className="text-xl font-black font-display text-outline uppercase">
            {assignedTeamName}
          </span>
        </div>
      </div>

      {/* Arena Stage Notice Card */}
      <div className="w-full p-6 bg-white rounded-3xl border-4 border-black shadow-[0_8px_0_#000] text-black flex flex-col items-center justify-center text-center gap-3">
        {isSelfSpeaking ? (
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-yellow-300 rounded-2xl border-3 border-black animate-bounce shadow-[0_4px_0_#000]">
              <Sparkle size={36} weight="fill" className="text-black" />
            </div>
            <span className="font-display font-black text-2xl text-red-600 uppercase tracking-tight">
              YOU ARE ON STAGE!
            </span>
            <p className="text-xs font-black text-gray-700 max-w-xs">
              Look at the big classroom screen and deliver your speech!
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-cyan-100 rounded-2xl border-3 border-black text-cyan-700 shadow-[0_4px_0_#000]">
              <Television size={36} weight="fill" />
            </div>
            <span className="font-display font-black text-xl text-gray-900 uppercase">
              LOOK AT THE PROJECTOR!
            </span>
            <p className="text-xs font-black text-gray-600">
              Active Speaker: <strong className="text-black font-display">{activeSpeaker}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
