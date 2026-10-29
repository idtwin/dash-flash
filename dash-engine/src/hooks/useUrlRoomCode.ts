"use client";

import { useSearchParams } from "next/navigation";

export function useUrlRoomCode(fallback = ""): string {
  const searchParams = useSearchParams();
  const rawCode = searchParams?.get("code") || fallback;
  return rawCode.trim().toUpperCase();
}
