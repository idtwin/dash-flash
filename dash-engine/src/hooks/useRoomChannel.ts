"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { getRoomTopic, SyncEventType } from "@/lib/syncProtocol";

type MessageHandler = (event: string, payload: unknown) => void;

export type SyncStatus =
  | "connected"
  | "connecting"
  | "local_only"
  | "disconnected"
  | "error";

export function useRoomChannel(roomCode: string, onMessage: MessageHandler) {
  const handlerRef = useRef(onMessage);
  useEffect(() => {
    handlerRef.current = onMessage;
  });

  const [syncStatus, setSyncStatus] = useState<SyncStatus>(
    isSupabaseConfigured ? "connecting" : "local_only"
  );

  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const supabaseChannelRef = useRef<ReturnType<NonNullable<typeof supabase>["channel"]> | null>(null);

  const broadcast = useCallback(
    async (event: SyncEventType, payload: unknown) => {
      // 1. BroadcastChannel for same-origin tabs/local devices
      if (broadcastChannelRef.current) {
        try {
          broadcastChannelRef.current.postMessage({ event, payload });
        } catch (err) {
          console.warn("BroadcastChannel error:", err);
        }
      }

      // 2. Supabase Realtime if configured
      if (supabaseChannelRef.current && isSupabaseConfigured) {
        try {
          await supabaseChannelRef.current.send({
            type: "broadcast",
            event,
            payload,
          });
        } catch (err) {
          console.warn("Supabase send error:", err);
        }
      }
    },
    []
  );

  useEffect(() => {
    if (!roomCode) return;
    const topic = getRoomTopic(roomCode);

    // Initialize local BroadcastChannel
    let localBc: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      localBc = new BroadcastChannel(topic);
      localBc.onmessage = (e) => {
        if (e.data && e.data.event) {
          handlerRef.current(e.data.event, e.data.payload);
        }
      };
      broadcastChannelRef.current = localBc;
    }

    // Initialize Supabase channel if configured
    if (supabase && isSupabaseConfigured) {
      const channel = supabase.channel(topic, {
        config: { broadcast: { self: false } },
      });

      channel
        .on("broadcast", { event: "*" }, (msg) => {
          if (msg.event) {
            handlerRef.current(msg.event, msg.payload);
          }
        })
        .subscribe((status, err) => {
          if (status === "SUBSCRIBED") {
            setSyncStatus("connected");
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            setSyncStatus("error");
            if (err) console.warn("Supabase Realtime subscription error:", err);
          } else if (status === "CLOSED") {
            setSyncStatus("disconnected");
          }
        });

      supabaseChannelRef.current = channel;
    } else {
      setSyncStatus("local_only");
    }

    return () => {
      if (localBc) {
        localBc.close();
        broadcastChannelRef.current = null;
      }
      if (supabaseChannelRef.current && supabase) {
        supabase.removeChannel(supabaseChannelRef.current);
        supabaseChannelRef.current = null;
      }
    };
  }, [roomCode]);

  return { broadcast, syncStatus };
}
