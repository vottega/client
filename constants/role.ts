export const ROLES = new Map([
  ["의장", { role: "의장", canVote: true }],
  ["회의자", { role: "회의자", canVote: true }],
  ["서기", { role: "서기", canVote: true }],
]);
export type Role = {
  role: string;
  canVote: boolean;
};
export type Roles = Map<string, Role>;
