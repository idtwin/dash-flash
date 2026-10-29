"use client";

import { useSyncExternalStore } from "react";

function emptySubscribe() {
  return () => {};
}

export function useClientValue<T>(getValue: () => T, serverFallback: T): T {
  return useSyncExternalStore(
    emptySubscribe,
    getValue,
    () => serverFallback
  );
}
