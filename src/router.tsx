import { createBrowserRouter } from "react-router-dom";
import { AuthGuard } from "@/lib/auth/AuthGuard";
import { AppLayout } from "@/components/layouts/AppLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";

// Public Pages (no authentication required)
import SigninPage from "./pages/SigninPage";
import RegisterPage from "./pages/RegisterPage";
import JoinPage from "./pages/JoinPage";

// Protected Pages (authentication required)
import HomePage from "./pages/HomePage";
import RoomsPage from "./pages/RoomsPage";
import RoomDetailPage from "./pages/RoomDetailPage";
import RoomSettingsPage from "./pages/RoomSettingsPage";
import RoomSettingsParticipantsPage from "./pages/RoomSettingsParticipantsPage";
import RoomSettingsRolesPage from "./pages/RoomSettingsRolesPage";
import RoomSettingsVotesPage from "./pages/RoomSettingsVotesPage";
import NewRoomPage from "./pages/NewRoomPage";

// 참여자가 접근 가능한 경로인지 확인
const isParticipantAllowedPath = (path: string) => {
  // 참여자는 오직 "/rooms/:id"에만 접근 가능 (설정 페이지 제외)
  return /^\/rooms\/[^/]+$/.test(path);
};

// 참여자 거부 시 리다이렉트 경로 결정
const redirectForParticipant = (
  _fromPath: string,
  auth: { role: string; roomId?: number | null },
) => {
  // 참여자의 경우 roomId를 사용하여 해당 룸으로 리다이렉트
  if (auth.role === "PARTICIPANT" && auth.roomId) {
    return `/rooms/${auth.roomId}`;
  }
  return "/";
};

export const router = createBrowserRouter([
  // 공개 라우트 (인증 불필요)
  {
    path: "/signin",
    element: (
      <AppLayout showHeader={true}>
        <SigninPage />
      </AppLayout>
    ),
  },
  {
    path: "/signin/register",
    element: (
      <AppLayout showHeader={true}>
        <RegisterPage />
      </AppLayout>
    ),
  },
  {
    path: "/join/:uuid",
    element: (
      <AppLayout showHeader={false}>
        <JoinPage />
      </AppLayout>
    ),
  },

  // 인증 필요 라우트 - 모든 인증된 사용자 접근 가능하지만, 참여자는 /rooms/:id만 허용
  {
    element: (
      <AuthGuard>
        <ProtectedRoute
          allow={(role, path) => {
            // USER는 모든 경로 접근 가능
            if (role === "USER") {
              return true;
            }
            // PARTICIPANT는 오직 /rooms/:id만 접근 가능
            if (role === "PARTICIPANT") {
              return isParticipantAllowedPath(path);
            }
            return false;
          }}
          redirectTo={(fromPath, auth) => redirectForParticipant(fromPath, auth)}
        />
      </AuthGuard>
    ),
    children: [
      {
        path: "/",
        element: (
          <AppLayout showHeader={true}>
            <HomePage />
          </AppLayout>
        ),
      },
      {
        path: "/rooms",
        element: (
          <AppLayout showHeader={true}>
            <RoomsPage />
          </AppLayout>
        ),
      },
      {
        path: "/rooms/new",
        element: (
          <AppLayout showHeader={true}>
            <NewRoomPage />
          </AppLayout>
        ),
      },
      {
        path: "/rooms/:id",
        element: (
          <AppLayout showHeader={false}>
            <RoomDetailPage />
          </AppLayout>
        ),
      },
      {
        path: "/rooms/:id/settings",
        element: (
          <AppLayout showHeader={false}>
            <RoomSettingsPage />
          </AppLayout>
        ),
      },
      {
        path: "/rooms/:id/settings/participants",
        element: (
          <AppLayout showHeader={false}>
            <RoomSettingsParticipantsPage />
          </AppLayout>
        ),
      },
      {
        path: "/rooms/:id/settings/roles",
        element: (
          <AppLayout showHeader={false}>
            <RoomSettingsRolesPage />
          </AppLayout>
        ),
      },
      {
        path: "/rooms/:id/settings/votes",
        element: (
          <AppLayout showHeader={false}>
            <RoomSettingsVotesPage />
          </AppLayout>
        ),
      },
    ],
  },
]);
