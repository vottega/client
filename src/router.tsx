import { Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/lib/auth/AuthGuard";
import { AppLayout } from "@/components/layouts/AppLayout";

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

// 라우트 설정 타입
interface RouteConfig {
  path: string;
  element: React.ComponentType;
  showHeader: boolean;
}

// 공개 라우트 설정
const publicRoutes: RouteConfig[] = [
  { path: "/signin", element: SigninPage, showHeader: true },
  { path: "/signin/register", element: RegisterPage, showHeader: true },
  { path: "/join/:uuid", element: JoinPage, showHeader: false },
];

// 보호된 라우트 설정
const protectedRoutes: RouteConfig[] = [
  { path: "/", element: HomePage, showHeader: true },
  { path: "/rooms", element: RoomsPage, showHeader: true },
  { path: "/rooms/new", element: NewRoomPage, showHeader: true },
  { path: "/rooms/:id", element: RoomDetailPage, showHeader: false },
  { path: "/rooms/:id/settings", element: RoomSettingsPage, showHeader: false },
  {
    path: "/rooms/:id/settings/participants",
    element: RoomSettingsParticipantsPage,
    showHeader: false,
  },
  { path: "/rooms/:id/settings/roles", element: RoomSettingsRolesPage, showHeader: false },
  { path: "/rooms/:id/settings/votes", element: RoomSettingsVotesPage, showHeader: false },
];

// 통합된 라우트 렌더링 함수
function renderRoute(config: RouteConfig, requireAuth: boolean) {
  const { path, element: Element, showHeader } = config;

  const wrappedElement = (
    <AppLayout showHeader={showHeader}>
      <Element />
    </AppLayout>
  );

  return (
    <Route
      key={path}
      path={path}
      element={requireAuth ? <AuthGuard>{wrappedElement}</AuthGuard> : wrappedElement}
    />
  );
}

function renderPublicRoute(config: RouteConfig) {
  return renderRoute(config, false);
}

function renderProtectedRoute(config: RouteConfig) {
  return renderRoute(config, true);
}

// Main Router Component
export function AppRouter() {
  return (
    <Routes>
      {/* 공개 라우트 */}
      {publicRoutes.map(renderPublicRoute)}

      {/* 보호된 라우트 */}
      {protectedRoutes.map(renderProtectedRoute)}
    </Routes>
  );
}
