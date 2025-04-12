import { Loader2 } from "lucide-react";

interface LoaderProps {
  message?: string;
  size?: number;
}

export function Loader({ message = "로딩 중입니다...", size = 24 }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center text-muted-foreground py-10 gap-2">
      <Loader2 className="animate-spin" size={size} strokeWidth={2} />
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}
