import { Team, ConnectedStudent } from "./dashTypes";

const CONSONANTS = "BCDFGHJKLMNPQRSTVWXZ";

export function generateRoomCode(): string {
  let result = "";
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * CONSONANTS.length);
    result += CONSONANTS[randomIndex];
  }
  return result;
}

export function uniqueDisplayName(name: string, roster: ConnectedStudent[]): string {
  const trimmed = name.trim();
  if (!trimmed) return "Player";

  const existingNames = new Set(roster.map((s) => s.name.toLowerCase()));
  if (!existingNames.has(trimmed.toLowerCase())) {
    return trimmed;
  }

  let counter = 2;
  while (existingNames.has(`${trimmed.toLowerCase()} ${counter}`)) {
    counter++;
  }
  return `${trimmed} ${counter}`;
}

export function pickBalancedTeam(teams: Team[], roster: ConnectedStudent[]): number {
  if (teams.length === 0) return 1;

  // Count connected students per team
  const counts = new Map<number, number>();
  teams.forEach((t) => counts.set(t.id, 0));

  roster.forEach((s) => {
    if (counts.has(s.teamId)) {
      counts.set(s.teamId, (counts.get(s.teamId) || 0) + 1);
    }
  });

  let minCount = Infinity;
  let bestTeamId = teams[0].id;

  for (const team of teams) {
    const c = counts.get(team.id) ?? 0;
    if (c < minCount) {
      minCount = c;
      bestTeamId = team.id;
    }
  }

  return bestTeamId;
}

export function tugStepPerTap(connectedCount: number): number {
  const count = Math.max(1, connectedCount);
  const rawStep = Math.ceil(20 / count);
  return Math.min(5, Math.max(1, rawStep));
}
