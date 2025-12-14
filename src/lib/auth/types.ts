import type { Role } from "@/lib/api/types/auth-service.dto";

export type AuthState =
  | { status: "loading" }
  | { status: "authed"; role: Role; userId?: string | null; participantId?: string | null; roomId?: number | null };

