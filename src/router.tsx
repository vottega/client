import { Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/lib/auth/AuthGuard";

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

// Main Router Component
export function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/signin/register" element={<RegisterPage />} />
      <Route path="/join/:uuid" element={<JoinPage />} />

      {/* Protected Routes - wrapped with AuthGuard */}
      <Route
        path="/*"
        element={
          <AuthGuard>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/rooms/new" element={<NewRoomPage />} />
              <Route path="/rooms/:id" element={<RoomDetailPage />} />
              <Route path="/rooms/:id/settings" element={<RoomSettingsPage />} />
              <Route
                path="/rooms/:id/settings/participants"
                element={<RoomSettingsParticipantsPage />}
              />
              <Route path="/rooms/:id/settings/roles" element={<RoomSettingsRolesPage />} />
              <Route path="/rooms/:id/settings/votes" element={<RoomSettingsVotesPage />} />
            </Routes>
          </AuthGuard>
        }
      />
    </Routes>
  );
}
