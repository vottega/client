import { JoinClient } from "@/components/JoinClient";
import { useAuthenticateParticipant } from "@/lib/api/queries/auth";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function JoinPage() {
  const { uuid } = useParams<{ uuid: string }>();

  const {
    mutate: authenticate,
    data: authData,
    error,
    isPending: isLoading,
  } = useAuthenticateParticipant();

  useEffect(() => {
    if (uuid) {
      authenticate({ participantId: uuid });
    }
  }, [uuid, authenticate]);

  const handleRetry = () => {
    if (uuid) {
      authenticate({ participantId: uuid });
    }
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
      initialData={authData || null}
      error={error || null}
      participantId={uuid || ""}
      onRetry={handleRetry}
    />
  );
}
