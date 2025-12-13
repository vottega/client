import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export function useDeniedToast() {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const state = location.state;
    if (!state?.denied) return;

    toast({
      title: "접근 권한이 없어요",
      description: "투표 참여자는 회의실 외에 접근할 수 없어요.",
      variant: "destructive",
    });

    // state 재사용(뒤로가기/리렌더) 방지
    navigate(location.pathname, { replace: true, state: null });
  }, [location, navigate, toast]);
}
