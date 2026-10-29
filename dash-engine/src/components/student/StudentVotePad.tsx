"use client";

import React, { useState } from "react";
import { GameSnapshotPayload } from "@/lib/syncProtocol";
import { HandTap, Sword } from "@phosphor-icons/react";

interface StudentVotePadProps {
  snapshot: GameSnapshotPayload | null;
  onVote: (direction: "left" | "right") => void;
}

export function StudentVotePad({ snapshot, onVote }: StudentVotePadProps) {
  const [tapEffect, setTapEffect] = useState<"left" | "right" | null>(null);

  const left = snapshot?.leftChallenger || {
    name: "Challenger 1",
    team: "Dragons",
    color: "#FF4655",
  };
  const right = snapshot?.rightChallenger || {
    name: "Challenger 2",
    team: "Sharks",
    color: "#00B4D8",
  };

  const handleTap = (direction: "left" | "right") => {
    onVote(direction);
    setTapEffect(direction);
    setTimeout(() => setTapEffect(null), 150);
  };

  return (
    <div className="w-full flex-1 flex flex-col gap-4 select-none justify-between my-2">
      <div className="flex items-center justify-center gap-2 p-2 bg-yellow-300 rounded-2xl border-4 border-black text-black font-display font-black text-xs uppercase tracking-wider shadow-[0_4px_0_#000]">
        <Sword size={20} weight="fill" />
        <span>TAP RAPIDLY TO VOTE!</span>
      </div>

      {/* Two Big Tactile Battle Voting Buttons */}
      <div className="flex-1 grid grid-rows-2 gap-4">
        {/* Left Challenger Button */}
        <button
          onClick={() => handleTap("left")}
          style={{ backgroundColor: left.color }}
          className={`relative w-full rounded-3xl border-5 border-black text-white p-4 flex flex-col items-center justify-center shadow-[0_10px_0_#000] cursor-pointer transition-transform ${
            tapEffect === "left" ? "scale-95 translate-y-2 shadow-[0_4px_0_#000]" : "active:scale-95"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <HandTap size={28} weight="fill" />
            <span className="text-xs font-black uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded-md">
              {left.team}
            </span>
          </div>
          <span className="text-3xl font-black font-display text-outline tracking-wide truncate max-w-xs">
            {left.name}
          </span>
          <span className="text-xs font-black uppercase text-yellow-300 mt-2">
            TAP FOR {left.team}!
          </span>
        </button>

        {/* Right Challenger Button */}
        <button
          onClick={() => handleTap("right")}
          style={{ backgroundColor: right.color }}
          className={`relative w-full rounded-3xl border-5 border-black text-white p-4 flex flex-col items-center justify-center shadow-[0_10px_0_#000] cursor-pointer transition-transform ${
            tapEffect === "right" ? "scale-95 translate-y-2 shadow-[0_4px_0_#000]" : "active:scale-95"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <HandTap size={28} weight="fill" />
            <span className="text-xs font-black uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded-md">
              {right.team}
            </span>
          </div>
          <span className="text-3xl font-black font-display text-outline tracking-wide truncate max-w-xs">
            {right.name}
          </span>
          <span className="text-xs font-black uppercase text-yellow-300 mt-2">
            TAP FOR {right.team}!
          </span>
        </button>
      </div>
    </div>
  );
}
