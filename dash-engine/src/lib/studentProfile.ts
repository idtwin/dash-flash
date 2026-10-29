const DEVICE_KEY = "dash_device_id_v1";
const LAST_NAME_KEY = "dash_last_name_v1";
const LAST_ROOM_KEY = "dash_last_room_v1";

export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "server_device";
  let deviceId = localStorage.getItem(DEVICE_KEY);
  if (!deviceId) {
    deviceId = `dev_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(DEVICE_KEY, deviceId);
  }
  return deviceId;
}

export function saveLastStudentSession(name: string, roomCode: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_NAME_KEY, name.trim());
  localStorage.setItem(LAST_ROOM_KEY, roomCode.trim().toUpperCase());
}

export function getLastStudentSession(): { name: string; roomCode: string } {
  if (typeof window === "undefined") return { name: "", roomCode: "" };
  return {
    name: localStorage.getItem(LAST_NAME_KEY) || "",
    roomCode: localStorage.getItem(LAST_ROOM_KEY) || "",
  };
}
