import { JoinClient } from "@/app/join/[uuid]/JoinClient";
import { Endpoints } from "@/lib/api/endpoints";
import { ParticipantAuthResponseDTO } from "@/lib/api/types/auth-service.dto";
import { UUID } from "crypto";

async function authenticate(uuid: string): Promise<ParticipantAuthResponseDTO> {
  const response = await fetch(Endpoints.auth.authenticateParticipant().toFullPath(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ participantId: uuid }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Authentication failed");
  }

  return response.json();
}

export default async function Join({ params: { uuid } }: { params: { uuid: string } }) {
  let authData: ParticipantAuthResponseDTO | null = null;
  let error: Error | null = null;

  try {
    authData = await authenticate(uuid);
  } catch (e) {
    error = e as Error;
  }

  return <JoinClient initialData={authData} error={error} participantId={uuid as UUID} />;
}
