import { DashState } from "@/store/useDashStore";
import {
  GameSnapshotPayload,
  DashActionPayload,
  StudentJoinPayload,
  StudentAssignedPayload,
} from "./syncProtocol";

export function buildGameSnapshot(store: DashState): GameSnapshotPayload {
  const curTeam = store.teams[store.activeTeamIndex] || store.teams[0];
  const activeSpeaker =
    curTeam?.students?.[curTeam.activeStudentIndex] || "Speaker Ready";

  const leftTeam = store.teams[0] || { name: "Team 1", color: "#FF4655", students: ["P1"] };
  const rightTeam = store.teams[1] || { name: "Team 2", color: "#00B4D8", students: ["P2"] };

  return {
    roomCode: store.roomCode,
    gameState: store.gameState,
    activeTeamIndex: store.activeTeamIndex,
    activeTeamName: curTeam ? curTeam.name : "Team 1",
    activeTeamColor: curTeam ? curTeam.color : "#FF4655",
    activeSpeaker,
    multiplier: store.multiplier,
    timerSeconds: store.timerSeconds,
    isTimerRunning: store.isTimerRunning,
    leftChallenger: {
      name: leftTeam.students[0] || "Challenger 1",
      team: leftTeam.name,
      color: leftTeam.color,
    },
    rightChallenger: {
      name: rightTeam.students[0] || "Challenger 2",
      team: rightTeam.name,
      color: rightTeam.color,
    },
    teams: store.teams.map((t) => ({
      id: t.id,
      name: t.name,
      color: t.color,
      score: t.score,
    })),
    tugOfWarMeter: store.tugOfWarMeter,
  };
}

export function applyActionToStore(action: DashActionPayload, store: DashState): void {
  switch (action.action) {
    case "ADD_POINTS": {
      const idx = action.teamIndex ?? store.activeTeamIndex;
      store.addPoints(idx, action.amount ?? 100);
      break;
    }
    case "STRIKE": {
      const idx = action.teamIndex ?? store.activeTeamIndex;
      store.addPoints(idx, -50);
      break;
    }
    case "NEXT_TURN":
      store.nextTurn();
      break;
    case "TOGGLE_TIMER":
      store.toggleTimer();
      break;
    case "CYCLE_MULTIPLIER":
      store.cycleMultiplier();
      break;
    case "RESET_TIMER":
      store.resetTimer();
      break;
  }
}

export function handleStudentJoin(
  join: StudentJoinPayload,
  store: DashState
): StudentAssignedPayload {
  const res = store.addStudent(join.name, join.deviceId);
  return {
    studentId: res.studentId,
    name: res.name,
    teamId: res.teamId,
  };
}

export function createVoteGate(cooldownMs = 300) {
  const lastTimestamps = new Map<string, number>();

  return function shouldAllowVote(deviceId: string): boolean {
    const now = Date.now();
    const last = lastTimestamps.get(deviceId) || 0;
    if (now - last < cooldownMs) {
      return false;
    }
    lastTimestamps.set(deviceId, now);
    return true;
  };
}
