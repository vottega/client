import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./Providers";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
      <Toaster />
      <Sonner />
    </Providers>
  );
}

export default App;
