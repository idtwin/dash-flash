import { GameState, Multiplier, Team } from "@/store/dashTypes";

export const SYNC_EVENTS = {
  DASH_ACTION: "DASH_ACTION",
  STUDENT_JOIN: "STUDENT_JOIN",
  STUDENT_ASSIGNED: "STUDENT_ASSIGNED",
  GAME_STATE: "GAME_STATE",
  CAST_VOTE: "CAST_VOTE",
} as const;

export type SyncEventType = (typeof SYNC_EVENTS)[keyof typeof SYNC_EVENTS];

export type DashRemoteActionType =
  | "ADD_POINTS"
  | "STRIKE"
  | "NEXT_TURN"
  | "TOGGLE_TIMER"
  | "CYCLE_MULTIPLIER"
  | "RESET_TIMER";

export interface DashActionPayload {
  action: DashRemoteActionType;
  teamIndex?: number;
  amount?: number;
}

export interface StudentJoinPayload {
  name: string;
  deviceId: string;
}

export interface StudentAssignedPayload {
  studentId: string;
  name: string;
  teamId: number;
}

export interface CastVotePayload {
  direction: "left" | "right";
  taps: number;
  deviceId: string;
}

export interface GameSnapshotPayload {
  roomCode: string;
  gameState: GameState;
  activeTeamIndex: number;
  activeTeamName: string;
  activeTeamColor: string;
  activeSpeaker: string;
  multiplier: Multiplier;
  timerSeconds: number;
  isTimerRunning: boolean;
  leftChallenger: { name: string; team: string; color: string };
  rightChallenger: { name: string; team: string; color: string };
  teams: Array<Pick<Team, "id" | "name" | "color" | "score">>;
  tugOfWarMeter: number;
}

export function getRoomTopic(code: string): string {
  return `dash-room-${code.trim().toUpperCase()}`;
}
