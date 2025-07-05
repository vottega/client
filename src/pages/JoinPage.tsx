import { JoinClient } from "@/components/JoinClient";
import { Endpoints } from "@/lib/api/endpoints";
import { ParticipantAuthResponseDTO } from "@/lib/api/types/auth-service.dto";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

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

export default function JoinPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const [authData, setAuthData] = useState<ParticipantAuthResponseDTO | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleAuthenticate = async () => {
    if (!uuid) {
      setError(new Error("유효하지 않은 링크입니다"));
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      setIsLoading(true);
      const data = await authenticate(uuid);
      setAuthData(data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleAuthenticate();
  }, [uuid]);

  const handleRetry = () => {
    handleAuthenticate();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">회의실 입장 중...</h1>
          <p className="text-gray-600">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <JoinClient
      initialData={authData}
      error={error}
      participantId={uuid || ""}
      onRetry={handleRetry}
    />
  );
}
