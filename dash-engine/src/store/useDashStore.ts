import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  GameState,
  GameModeId,
  GradeProfile,
  TeamCount,
  Multiplier,
  Team,
  ConnectedStudent,
  MASTER_TEAMS,
} from "./dashTypes";
import {
  generateRoomCode,
  uniqueDisplayName,
  pickBalancedTeam,
  tugStepPerTap,
} from "./lobbyLogic";

export interface DashState {
  roomCode: string;
  gameState: GameState;
  connectedStudents: ConnectedStudent[];
  tugOfWarMeter: number;
  activeGameMode: GameModeId;
  gradeProfile: GradeProfile;
  teams: Team[];
  activeTeamIndex: number;
  roundNumber: number;
  totalRounds: number;
  multiplier: Multiplier;
  timerSeconds: number;
  maxTimerSeconds: number;
  isTimerRunning: boolean;
  promptIndex: number;

  setGameState: (state: GameState) => void;
  addStudent: (name: string, deviceId?: string) => { studentId: string; teamId: number; name: string };
  registerVote: (direction: "left" | "right", taps: number) => void;
  resetLobby: () => void;
  setActiveGameMode: (mode: GameModeId) => void;
  addPoints: (teamIndex: number, amount: number) => void;
  nextTurn: () => void;
  setTeamCount: (count: TeamCount) => void;
  shuffleAndBalanceTeams: (presentStudents: string[], count: TeamCount) => void;
  setGradeProfile: (grade: GradeProfile) => void;
  cycleMultiplier: () => void;
  toggleTimer: () => void;
  resetTimer: (seconds?: number) => void;
  tickTimer: () => void;
}

export const useDashStore = create<DashState>()(
  persist(
    (set, get) => ({
      roomCode: generateRoomCode(),
      gameState: "lobby",
      connectedStudents: [],
      tugOfWarMeter: 50,
      activeGameMode: "rapid-fire",
      gradeProfile: "upper-elem-4-6",
      teams: MASTER_TEAMS.slice(0, 5),
      activeTeamIndex: 0,
      roundNumber: 1,
      totalRounds: 10,
      multiplier: 1,
      timerSeconds: 45,
      maxTimerSeconds: 45,
      isTimerRunning: false,
      promptIndex: 0,

      setGameState: (state) => set({ gameState: state }),

      addStudent: (rawName, deviceId) => {
        const { connectedStudents, teams } = get();
        const id = deviceId || `std_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        const existing = connectedStudents.find((s) => s.id === id);
        if (existing) return { studentId: existing.id, teamId: existing.teamId, name: existing.name };

        const name = uniqueDisplayName(rawName, connectedStudents);
        const teamId = pickBalancedTeam(teams, connectedStudents);
        const newStudent: ConnectedStudent = { id, name, teamId, lastActive: Date.now() };

        set({ connectedStudents: [...connectedStudents, newStudent] });
        return { studentId: id, teamId, name };
      },

      registerVote: (direction, taps) => {
        const { tugOfWarMeter, connectedStudents } = get();
        const step = tugStepPerTap(connectedStudents.length) * taps;
        const delta = direction === "right" ? step : -step;
        const next = Math.max(0, Math.min(100, tugOfWarMeter + delta));
        set({ tugOfWarMeter: next });
      },

      resetLobby: () =>
        set({
          roomCode: generateRoomCode(),
          connectedStudents: [],
          gameState: "lobby",
          tugOfWarMeter: 50,
          roundNumber: 1,
          promptIndex: 0,
          isTimerRunning: false,
          timerSeconds: 45,
        }),

      setActiveGameMode: (activeGameMode) => set({ activeGameMode }),

      addPoints: (teamIndex, amount) => {
        const { teams, multiplier } = get();
        if (teamIndex < 0 || teamIndex >= teams.length) return;
        const updated = teams.map((team, idx) =>
          idx === teamIndex
            ? { ...team, score: Math.max(0, team.score + amount * multiplier) }
            : team
        );
        set({ teams: updated });
      },

      nextTurn: () => {
        const { teams, activeTeamIndex, roundNumber, maxTimerSeconds } = get();
        const curTeam = teams[activeTeamIndex];
        const nextStudentIdx =
          curTeam && curTeam.students.length > 0
            ? (curTeam.activeStudentIndex + 1) % curTeam.students.length
            : 0;

        const updatedTeams = teams.map((t, i) =>
          i === activeTeamIndex ? { ...t, activeStudentIndex: nextStudentIdx } : t
        );
        const nextTeamIdx = (activeTeamIndex + 1) % teams.length;
        set((state) => ({
          teams: updatedTeams,
          activeTeamIndex: nextTeamIdx,
          roundNumber: roundNumber + 1,
          promptIndex: state.promptIndex + 1,
          timerSeconds: maxTimerSeconds,
          isTimerRunning: false,
        }));
      },

      setTeamCount: (count) => {
        const validCount = Math.max(2, Math.min(6, count)) as TeamCount;
        const existing = get().teams;
        const result = MASTER_TEAMS.slice(0, validCount).map((master) => {
          const found = existing.find((t) => t.id === master.id);
          return found ? { ...master, score: found.score, students: found.students } : master;
        });
        set({
          teams: result,
          activeTeamIndex: Math.min(get().activeTeamIndex, result.length - 1),
        });
      },

      shuffleAndBalanceTeams: (presentStudents, count) => {
        const validCount = Math.max(2, Math.min(6, count)) as TeamCount;
        const shuffled = [...presentStudents].sort(() => Math.random() - 0.5);
        const baseTeams = MASTER_TEAMS.slice(0, validCount).map((t) => ({
          ...t,
          score: 0,
          students: [] as string[],
          activeStudentIndex: 0,
        }));

        shuffled.forEach((name, i) => {
          baseTeams[i % validCount].students.push(name);
        });

        set({ teams: baseTeams, activeTeamIndex: 0, roundNumber: 1 });
      },

      setGradeProfile: (gradeProfile) => set({ gradeProfile, promptIndex: 0 }),

      cycleMultiplier: () => {
        const next = ((get().multiplier % 3) + 1) as Multiplier;
        set({ multiplier: next });
      },

      toggleTimer: () => set((s) => ({ isTimerRunning: !s.isTimerRunning })),

      resetTimer: (sec) => {
        const duration = sec ?? get().maxTimerSeconds;
        set({ timerSeconds: duration, isTimerRunning: false });
      },

      tickTimer: () => {
        const { timerSeconds, isTimerRunning } = get();
        if (!isTimerRunning) return;
        if (timerSeconds <= 1) {
          set({ timerSeconds: 0, isTimerRunning: false });
        } else {
          set({ timerSeconds: timerSeconds - 1 });
        }
      },
    }),
    {
      name: "dash-arcade-storage-v3",
      partialize: (s) => ({
        roomCode: s.roomCode,
        teams: s.teams,
        gradeProfile: s.gradeProfile,
        activeGameMode: s.activeGameMode,
      }),
    }
  )
);
