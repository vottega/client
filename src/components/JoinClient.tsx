import { ParticipantAuthResponseDTO } from "@/lib/api/types/auth-service.dto";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/button";

interface JoinClientProps {
  initialData: ParticipantAuthResponseDTO | null;
  error: Error | null;
  participantId: string;
  onRetry: () => void;
}

export function JoinClient({ initialData, error, participantId, onRetry }: JoinClientProps) {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  useEffect(() => {
    if (error) {
      console.error("Authentication failed:", error);
      return;
    }

    if (initialData) {
      // Store token in localStorage
      localStorage.setItem("token", initialData.token);

      // Set auth context
      setAuth({
        role: "PARTICIPANT",
        participantId: participantId,
      });

      // Redirect to room page
      navigate(`/rooms/${initialData.roomId}`);
    }
  }, [initialData, error, navigate, participantId, setAuth]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">입장에 실패했습니다</h1>
          <p className="text-gray-600 mb-4">
            회의실 입장에 실패했습니다. 다시 시도하시거나 관리자에게 문의해주세요.
          </p>
          <Button onClick={onRetry}>다시 시도</Button>
        </div>
      </div>
    );
  }

  if (!initialData) {
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
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">회의실 입장 중...</h1>
        <p className="text-gray-600">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}
