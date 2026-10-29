"use client";

import { useState, useEffect } from "react";

export function useJoinBaseUrl(): string {
  const [baseUrl, setBaseUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hostname = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : "";
    const protocol = window.location.protocol;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      fetch("/api/host-ip")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.ip) {
            setBaseUrl(`${protocol}//${data.ip}${port}`);
          } else {
            setBaseUrl(window.location.origin);
          }
        })
        .catch(() => {
          setBaseUrl(window.location.origin);
        });
    } else {
      queueMicrotask(() => {
        setBaseUrl(window.location.origin);
      });
    }
  }, []);

  return baseUrl;
}
