import TheHeader from "@/components/TheHeader";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./Providers";
import { AppRouter } from "./router";

function App() {
  return (
    <Providers>
      <TheHeader />
      <AppRouter />
      <Toaster />
      <Sonner />
    </Providers>
  );
}

export default App;
