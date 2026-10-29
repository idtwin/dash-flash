import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";

const lanIPs = Object.values(networkInterfaces())
  .flat()
  .filter((iface) => iface && iface.family === "IPv4" && !iface.internal)
  .map((iface) => iface!.address);

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  allowedDevOrigins: [...lanIPs, "localhost:3000"],
};

export default nextConfig;
