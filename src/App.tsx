import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Providers } from "./Providers";

// Pages
import HomePage from "./pages/HomePage";
import SigninPage from "./pages/SigninPage";
import RegisterPage from "./pages/RegisterPage";
import RoomsPage from "./pages/RoomsPage";
import RoomDetailPage from "./pages/RoomDetailPage";
import RoomSettingsPage from "./pages/RoomSettingsPage";
import RoomSettingsParticipantsPage from "./pages/RoomSettingsParticipantsPage";
import RoomSettingsRolesPage from "./pages/RoomSettingsRolesPage";
import RoomSettingsVotesPage from "./pages/RoomSettingsVotesPage";
import NewRoomPage from "./pages/NewRoomPage";
import JoinPage from "./pages/JoinPage";

function App() {
  return (
    <Providers>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/signin/register" element={<RegisterPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/rooms/new" element={<NewRoomPage />} />
        <Route path="/rooms/:id" element={<RoomDetailPage />} />
        <Route path="/rooms/:id/settings" element={<RoomSettingsPage />} />
        <Route path="/rooms/:id/settings/participants" element={<RoomSettingsParticipantsPage />} />
        <Route path="/rooms/:id/settings/roles" element={<RoomSettingsRolesPage />} />
        <Route path="/rooms/:id/settings/votes" element={<RoomSettingsVotesPage />} />
        <Route path="/join/:uuid" element={<JoinPage />} />
      </Routes>
      <Toaster />
      <Sonner />
    </Providers>
  );
}

export default App;
