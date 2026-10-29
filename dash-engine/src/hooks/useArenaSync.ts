"use client";

import { useEffect, useRef, useCallback } from "react";
import { useDashStore } from "@/store/useDashStore";
import { useRoomChannel } from "./useRoomChannel";
import {
  SYNC_EVENTS,
  SyncEventType,
  DashActionPayload,
  StudentJoinPayload,
  CastVotePayload,
} from "@/lib/syncProtocol";
import {
  buildGameSnapshot,
  applyActionToStore,
  handleStudentJoin,
  createVoteGate,
} from "@/lib/arenaHost";

export function useArenaSync() {
  const store = useDashStore();
  const roomCode = store.roomCode;
  const voteGateRef = useRef(createVoteGate(200));
  const broadcastRef = useRef<((event: SyncEventType, payload: unknown) => void) | null>(null);

  const onMessage = useCallback(
    (event: string, payload: unknown) => {
      const state = useDashStore.getState();

      if (event === SYNC_EVENTS.DASH_ACTION) {
        applyActionToStore(payload as DashActionPayload, state);
      } else if (event === SYNC_EVENTS.STUDENT_JOIN) {
        const joinPayload = payload as StudentJoinPayload;
        const assigned = handleStudentJoin(joinPayload, state);
        broadcastRef.current?.(SYNC_EVENTS.STUDENT_ASSIGNED, assigned);
      } else if (event === SYNC_EVENTS.CAST_VOTE) {
        const vote = payload as CastVotePayload;
        if (voteGateRef.current(vote.deviceId)) {
          state.registerVote(vote.direction, vote.taps);
        }
      }
    },
    []
  );

  const { broadcast, syncStatus } = useRoomChannel(roomCode, onMessage);

  useEffect(() => {
    broadcastRef.current = broadcast;
  }, [broadcast]);

  // Periodically and reactively broadcast GAME_STATE snapshot
  useEffect(() => {
    const snapshot = buildGameSnapshot(store);
    broadcast(SYNC_EVENTS.GAME_STATE, snapshot);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    broadcast,
    store.gameState,
    store.activeTeamIndex,
    store.multiplier,
    store.timerSeconds,
    store.isTimerRunning,
    store.tugOfWarMeter,
    store.roundNumber,
  ]);

  return { broadcast, syncStatus };
}
