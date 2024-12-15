import { Providers } from "@/app/Providers";

export default function RoomLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
