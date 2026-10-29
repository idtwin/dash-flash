"use client";

import React, { useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getOrCreateDeviceId } from "@/lib/studentProfile";
import { useStudentSync } from "@/hooks/useStudentSync";
import { StudentStatusCards } from "@/components/student/StudentStatusCards";
import { StudentVotePad } from "@/components/student/StudentVotePad";
import { MASTER_TEAMS } from "@/store/dashTypes";
import { House, WifiHigh } from "@phosphor-icons/react";

function StudentPlayInner() {
  const searchParams = useSearchParams();
  const studentName = searchParams?.get("name") || "Player";
  const roomCode = (searchParams?.get("code") || "").toUpperCase();

  const deviceId = useMemo(() => getOrCreateDeviceId(), []);

  const { snapshot, assignedTeamId, tapVote, requestJoin, syncStatus } = useStudentSync(
    roomCode,
    deviceId
  );

  // Request assignment into room on mount
  useEffect(() => {
    if (studentName && roomCode) {
      requestJoin(studentName);
    }
  }, [studentName, roomCode, requestJoin]);

  const assignedTeam = useMemo(() => {
    if (!assignedTeamId) return MASTER_TEAMS[0];
    return MASTER_TEAMS.find((t) => t.id === assignedTeamId) || MASTER_TEAMS[0];
  }, [assignedTeamId]);

  const isVotingMode = snapshot?.gameState === "voting";

  return (
    <main
      style={{
        backgroundColor: isVotingMode ? "#1A103C" : assignedTeam.color,
      }}
      className="min-h-screen w-screen p-4 flex flex-col justify-between select-none transition-colors duration-300"
    >
      {/* Top Status Bar */}
      <div className="flex items-center justify-between border-b-2 border-black/20 pb-2">
        <Link
          href="/student"
          className="p-1.5 bg-black/40 rounded-xl border-2 border-black text-white"
        >
          <House size={18} weight="bold" />
        </Link>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 rounded-full border-2 border-black text-white text-xs font-black font-display uppercase tracking-wider">
          <WifiHigh
            size={16}
            weight="bold"
            className={
              syncStatus === "connected"
                ? "text-green-400 animate-pulse"
                : syncStatus === "connecting"
                ? "text-yellow-400 animate-spin"
                : syncStatus === "error"
                ? "text-red-400"
                : "text-amber-400"
            }
          />
          <span>ROOM: {roomCode || "----"}</span>
        </div>

        <span className="text-xs font-black font-display uppercase bg-white/30 text-black px-2 py-0.5 rounded-lg border border-black/30">
          {assignedTeam.name}
        </span>
      </div>

      {/* Main Interactive Body */}
      {isVotingMode ? (
        <StudentVotePad snapshot={snapshot} onVote={tapVote} />
      ) : (
        <div className="flex-1 flex flex-col justify-center my-4">
          <StudentStatusCards
            studentName={studentName}
            assignedTeamName={assignedTeam.name}
            assignedTeamColor={assignedTeam.color}
            snapshot={snapshot}
          />
        </div>
      )}

      {/* Footer Info */}
      <div className="text-center pt-2 text-[11px] font-black text-black/70 uppercase tracking-wider">
        {isVotingMode
          ? "Tap repeatedly to push the tug-of-war meter!"
          : "Keep this screen open while playing"}
      </div>
    </main>
  );
}

export default function StudentPlayPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-white">Loading Arena Controller...</div>}>
      <StudentPlayInner />
    </Suspense>
  );
}
