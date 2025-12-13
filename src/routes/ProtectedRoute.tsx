import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthForRoute } from "@/lib/auth/useAuthForRoute";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  allow: (role: string, path: string) => boolean;
  redirectTo: (fromPath: string, auth: { role: string; roomId?: number | null }) => string; // 의도 보존용
};

export function ProtectedRoute({ allow, redirectTo }: Props) {
  const auth = useAuthForRoute();
  const location = useLocation();

  if (auth.status === "loading") {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    );
  }

  const ok = allow(auth.role, location.pathname);
  if (!ok) {
    const to = redirectTo(location.pathname, {
      role: auth.role,
      roomId: auth.roomId,
    });
    return (
      <Navigate
        to={to}
        replace
        state={{
          denied: true,
          from: location.pathname,
          reason: "PARTICIPANT_RESTRICTED",
        }}
      />
    );
  }

  return <Outlet />;
}

