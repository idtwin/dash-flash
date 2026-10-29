"use client";

import React from "react";
import Link from "next/link";
import { useDashStore } from "@/store/useDashStore";
import { GameModeId } from "@/store/dashTypes";
import {
  Fire,
  PuzzlePiece,
  Bomb,
  Play,
  Users,
  DeviceMobile,
  Sparkle,
} from "@phosphor-icons/react";

interface Cartridge {
  id: GameModeId;
  title: string;
  subtitle: string;
  color: string;
  icon: React.ReactNode;
}

const CARTRIDGES: Cartridge[] = [
  {
    id: "rapid-fire",
    title: "RAPID-FIRE ARENA",
    subtitle: "45s speed rounds with chunky sentence starters",
    color: "#FF4655",
    icon: <Fire size={36} weight="fill" />,
  },
  {
    id: "sentence-scramble",
    title: "SENTENCE SCRAMBLE",
    subtitle: "Piece puzzle thoughts into lightning arguments",
    color: "#00B4D8",
    icon: <PuzzlePiece size={36} weight="fill" />,
  },
  {
    id: "beat-the-bomb",
    title: "BEAT THE BOMB",
    subtitle: "Pass the microphone before the cartoon fuse pops",
    color: "#FFB703",
    icon: <Bomb size={36} weight="fill" />,
  },
];

export default function MainMenuPage() {
  const activeGameMode = useDashStore((s) => s.activeGameMode);
  const setActiveGameMode = useDashStore((s) => s.setActiveGameMode);
  const setGameState = useDashStore((s) => s.setGameState);

  return (
    <main className="h-screen w-screen overflow-hidden select-none bg-[#1A103C] arcade-canvas p-6 flex flex-col justify-between items-center">
      {/* Top Banner / Hero Title */}
      <div className="flex flex-col items-center gap-1 text-center mt-2">
        <div className="flex items-center gap-2">
          <Sparkle size={28} weight="fill" className="text-yellow-400 animate-spin" />
          <span className="text-xs font-black uppercase tracking-widest text-cyan-300 font-display">
            100-INCH PROJECTOR CLASSROOM ARENA
          </span>
          <Sparkle size={28} weight="fill" className="text-yellow-400 animate-spin" />
        </div>
        <h1 className="text-6xl lg:text-7xl font-black font-display text-white text-outline-lg tracking-tight">
          D.A.S.H.
        </h1>
        <p className="text-sm font-black font-display uppercase tracking-widest text-yellow-300">
          DYNAMIC ARCADE SPEAKING HUB
        </p>
      </div>

      {/* Cartridge Carousel / Selector */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 my-auto">
        {CARTRIDGES.map((cart) => {
          const isSelected = activeGameMode === cart.id;
          return (
            <div
              key={cart.id}
              onClick={() => setActiveGameMode(cart.id)}
              style={{ backgroundColor: cart.color }}
              className={`p-6 rounded-3xl border-5 border-black text-white flex flex-col justify-between min-h-[220px] transition-all duration-200 cursor-pointer shadow-[0_10px_0_#000] relative ${
                isSelected
                  ? "scale-105 ring-4 ring-yellow-300 ring-offset-4 ring-offset-[#1A103C] z-10"
                  : "opacity-85 hover:opacity-100 hover:scale-102"
              }`}
            >
              {isSelected && (
                <span className="absolute -top-3.5 right-6 px-3 py-1 bg-yellow-300 text-black border-2 border-black font-display font-black text-xs uppercase tracking-wider rounded-full shadow-[0_2px_0_#000]">
                  SELECTED
                </span>
              )}

              <div className="flex items-center justify-between">
                <div className="p-3 bg-black/30 rounded-2xl border-2 border-black">
                  {cart.icon}
                </div>
                <span className="text-xs font-black uppercase text-black/80 bg-white/70 px-2 py-0.5 rounded-md">
                  CARTRIDGE
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black font-display text-outline tracking-wide">
                  {cart.title}
                </h3>
                <p className="text-xs font-bold text-white/95 mt-1 leading-snug">
                  {cart.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Launch & Control Navigation */}
      <div className="w-full max-w-5xl flex items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-3">
          <Link
            href="/roster"
            className="flex items-center gap-2 px-5 py-3 bg-gray-800 hover:bg-gray-700 active:translate-y-1 rounded-2xl border-4 border-black text-white font-display font-black text-sm uppercase tracking-wider shadow-[0_6px_0_#000]"
          >
            <Users size={22} weight="bold" />
            <span>ROSTER SHUFFLER</span>
          </Link>

          <Link
            href="/pad"
            className="flex items-center gap-2 px-5 py-3 bg-[#00B4D8] hover:bg-cyan-400 active:translate-y-1 rounded-2xl border-4 border-black text-white font-display font-black text-sm uppercase tracking-wider shadow-[0_6px_0_#000]"
          >
            <DeviceMobile size={22} weight="bold" />
            <span>TEACHER PAD</span>
          </Link>
        </div>

        <Link
          href="/arena"
          onClick={() => setGameState("playing")}
          className="flex items-center gap-3 px-8 py-3.5 bg-[#38B000] hover:bg-green-500 active:translate-y-1 rounded-2xl border-4 border-black text-white font-display font-black text-lg uppercase tracking-wider shadow-[0_8px_0_#000]"
        >
          <Play size={26} weight="fill" />
          <span>LAUNCH ARENA</span>
        </Link>
      </div>
    </main>
  );
}
