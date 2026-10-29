"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRoomChannel } from "./useRoomChannel";
import {
  SYNC_EVENTS,
  GameSnapshotPayload,
  StudentAssignedPayload,
  CastVotePayload,
} from "@/lib/syncProtocol";

export function useStudentSync(roomCode: string, deviceId: string) {
  const [snapshot, setSnapshot] = useState<GameSnapshotPayload | null>(null);
  const [assignedTeamId, setAssignedTeamId] = useState<number | null>(null);

  const pendingVotesRef = useRef<{ left: number; right: number }>({ left: 0, right: 0 });

  const onMessage = useCallback(
    (event: string, payload: unknown) => {
      if (event === SYNC_EVENTS.GAME_STATE) {
        setSnapshot(payload as GameSnapshotPayload);
      } else if (event === SYNC_EVENTS.STUDENT_ASSIGNED) {
        const assigned = payload as StudentAssignedPayload;
        if (assigned.studentId === deviceId) {
          setAssignedTeamId(assigned.teamId);
        }
      }
    },
    [deviceId]
  );

  const { broadcast, syncStatus } = useRoomChannel(roomCode, onMessage);

  // High-frequency tap queue buffer: flushes every 400ms, max 6 taps per flush
  useEffect(() => {
    if (!roomCode) return;

    const timer = setInterval(() => {
      const { left, right } = pendingVotesRef.current;
      if (left > 0) {
        const batch = Math.min(6, left);
        pendingVotesRef.current.left -= batch;
        const payload: CastVotePayload = { direction: "left", taps: batch, deviceId };
        broadcast(SYNC_EVENTS.CAST_VOTE, payload);
      }
      if (right > 0) {
        const batch = Math.min(6, right);
        pendingVotesRef.current.right -= batch;
        const payload: CastVotePayload = { direction: "right", taps: batch, deviceId };
        broadcast(SYNC_EVENTS.CAST_VOTE, payload);
      }
    }, 400);

    return () => clearInterval(timer);
  }, [roomCode, deviceId, broadcast]);

  const tapVote = useCallback((direction: "left" | "right") => {
    if (direction === "left") {
      pendingVotesRef.current.left += 1;
    } else {
      pendingVotesRef.current.right += 1;
    }
  }, []);

  const requestJoin = useCallback(
    (name: string) => {
      broadcast(SYNC_EVENTS.STUDENT_JOIN, { name, deviceId });
    },
    [broadcast, deviceId]
  );

  return { snapshot, assignedTeamId, tapVote, requestJoin, syncStatus };
}
