export type GradeProfile =
  | "primary-1-3"
  | "upper-elem-4-6"
  | "high-a1"
  | "high-adv";

export type GameModeId =
  | "rapid-fire"
  | "sentence-scramble"
  | "beat-the-bomb";

export type MascotIconType =
  | "dragon"
  | "shark"
  | "tiger"
  | "frog"
  | "bear"
  | "wolf";

export type TeamCount = 2 | 3 | 4 | 5 | 6;

export type Multiplier = 1 | 2 | 3;

export type GameState = "lobby" | "playing" | "voting";

export interface Team {
  id: number;
  name: string;
  color: string;
  mascotIcon: MascotIconType;
  score: number;
  students: string[];
  activeStudentIndex: number;
}

export interface ConnectedStudent {
  id: string;
  name: string;
  teamId: number;
  lastActive: number;
}

export interface StagePrompt {
  id: string;
  category: string;
  prompt: string;
  hints: string[];
  starters: [string, string, string, string];
}

export const MASTER_TEAMS: Team[] = [
  {
    id: 1,
    name: "Dragons",
    color: "#FF4655",
    mascotIcon: "dragon",
    score: 0,
    students: ["Leo", "Maya", "Sam", "Chloe"],
    activeStudentIndex: 0,
  },
  {
    id: 2,
    name: "Sharks",
    color: "#00B4D8",
    mascotIcon: "shark",
    score: 0,
    students: ["Kai", "Noah", "Elena", "Finn"],
    activeStudentIndex: 0,
  },
  {
    id: 3,
    name: "Tigers",
    color: "#FFB703",
    mascotIcon: "tiger",
    score: 0,
    students: ["Zara", "Alex", "Ruby", "Liam"],
    activeStudentIndex: 0,
  },
  {
    id: 4,
    name: "Frogs",
    color: "#38B000",
    mascotIcon: "frog",
    score: 0,
    students: ["Toby", "Emma", "Lucas", "Lily"],
    activeStudentIndex: 0,
  },
  {
    id: 5,
    name: "Bears",
    color: "#9D4EDD",
    mascotIcon: "bear",
    score: 0,
    students: ["Owen", "Ivy", "Mason", "Ella"],
    activeStudentIndex: 0,
  },
  {
    id: 6,
    name: "Wolves",
    color: "#FB5607",
    mascotIcon: "wolf",
    score: 0,
    students: ["Jax", "Aria", "Cole", "Sienna"],
    activeStudentIndex: 0,
  },
];
