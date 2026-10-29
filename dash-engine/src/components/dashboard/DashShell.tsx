"use client";

import React, { useState } from "react";
import { useDashStore } from "@/store/useDashStore";
import { useArenaSync } from "@/hooks/useArenaSync";
import { KeyboardRefereeListener } from "./KeyboardRefereeListener";
import { TopMascotBar } from "./TopMascotBar";
import { CenterStageCard } from "./CenterStageCard";
import { TugOfWarBar } from "./TugOfWarBar";
import { BottomTelemetryBar } from "./BottomTelemetryBar";
import { QuickSetupPanel } from "./QuickSetupPanel";
import { LobbyScreen } from "./LobbyScreen";

export function DashShell() {
  const gameState = useDashStore((s) => s.gameState);
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  // Activate arena synchronization for remote teacher pads & student controller devices
  useArenaSync();

  if (gameState === "lobby") {
    return <LobbyScreen />;
  }

  return (
    <main className="h-screen w-screen overflow-hidden select-none bg-[#1A103C] arcade-canvas flex flex-col justify-between p-4">
      {/* Global Hotkey Referee */}
      <KeyboardRefereeListener />

      {/* Top Header: Mascot & Score Pods */}
      <TopMascotBar />

      {/* Center Stage Arena */}
      <div className="w-full flex-1 flex flex-col gap-3 my-2 max-h-[72vh] justify-between">
        <CenterStageCard />
        <TugOfWarBar />
      </div>

      {/* Bottom Control & Status Telemetry Bar */}
      <BottomTelemetryBar onToggleSetup={() => setIsSetupOpen(true)} />

      {/* Referee Settings Drawer */}
      <QuickSetupPanel
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
      />
    </main>
  );
}
