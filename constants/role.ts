export const ROLES = new Map([
  ["의장", { value: "의장", canVote: true }],
  ["회의자", { value: "회의자", canVote: true }],
  ["서기", { value: "서기", canVote: true }],
]);
export type Role = {
  value: string;
  canVote: boolean;
};
export type Roles = Map<string, Role>;
