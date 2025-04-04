import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  message?: string;
  subtext?: string;
}

export function EmptyState({
  message = "표시할 데이터가 없습니다.",
  subtext,
  icon = <Inbox className="w-10 h-10 text-muted-foreground/50" />,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-12 text-muted-foreground">
      <div className="mb-3">{icon}</div>
      <p className="text-sm font-medium">{message}</p>
      {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
    </div>
  );
}
