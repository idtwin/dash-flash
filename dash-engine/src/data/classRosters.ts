import { GradeProfile } from "@/store/dashTypes";

export interface GradeClassRoster {
  profile: GradeProfile;
  gradeLabel: string;
  defaultRoster: string[];
}

export const CLASS_ROSTERS: Record<GradeProfile, GradeClassRoster> = {
  "primary-1-3": {
    profile: "primary-1-3",
    gradeLabel: "Primary (Grades 1-3)",
    defaultRoster: [
      "Leo", "Maya", "Sam", "Chloe", "Kai", "Noah", "Elena", "Finn",
      "Zara", "Alex", "Ruby", "Liam", "Toby", "Emma", "Lucas", "Lily"
    ],
  },
  "upper-elem-4-6": {
    profile: "upper-elem-4-6",
    gradeLabel: "Upper Elem (Grades 4-6)",
    defaultRoster: [
      "Mason", "Ella", "Owen", "Ivy", "Cole", "Sienna", "Jax", "Aria",
      "Lucas", "Zoe", "Milo", "Nora", "Ethan", "Stella", "Logan", "Harper"
    ],
  },
  "high-a1": {
    profile: "high-a1",
    gradeLabel: "High School (Beginner A1)",
    defaultRoster: [
      "David", "Sofia", "Marcus", "Elena", "Victor", "Maria", "Kenji", "Yuki",
      "Carlos", "Ana", "Gabriel", "Lucia", "Mateo", "Camila", "Jin", "Hana"
    ],
  },
  "high-adv": {
    profile: "high-adv",
    gradeLabel: "High School (Advanced Debate)",
    defaultRoster: [
      "Alexander", "Beatrice", "Christopher", "Diana", "Edward", "Fiona",
      "George", "Helena", "Ian", "Julianna", "Kieran", "Lorelei",
      "Maxwell", "Nadia", "Oliver", "Penelope"
    ],
  },
};

export function getRosterForGrade(grade: GradeProfile): string[] {
  return CLASS_ROSTERS[grade]?.defaultRoster ?? CLASS_ROSTERS["upper-elem-4-6"].defaultRoster;
}
