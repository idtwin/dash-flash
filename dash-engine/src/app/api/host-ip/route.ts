import { NextResponse } from "next/server";
import { networkInterfaces } from "node:os";

export async function GET() {
  const nets = networkInterfaces();
  let lanIp = "127.0.0.1";

  for (const name of Object.keys(nets)) {
    const ifaceList = nets[name];
    if (!ifaceList) continue;

    for (const net of ifaceList) {
      // Find non-internal IPv4 address (e.g. 192.168.x.x, 10.x.x.x, 172.x.x.x)
      if (net.family === "IPv4" && !net.internal) {
        lanIp = net.address;
        break;
      }
    }
    if (lanIp !== "127.0.0.1") break;
  }

  return NextResponse.json({ ip: lanIp });
}
