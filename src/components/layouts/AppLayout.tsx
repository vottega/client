import { ReactNode } from "react";
import TheHeader from "@/components/TheHeader";

interface AppLayoutProps {
  children: ReactNode;
  showHeader?: boolean; // 명시적 제어를 위한 prop
  forceHeader?: boolean; // 강제로 헤더를 표시/숨김
}

export function AppLayout({ children, showHeader, forceHeader }: AppLayoutProps) {
  // forceHeader가 있으면 우선 적용, 없으면 showHeader 사용
  const shouldShowHeader = forceHeader !== undefined ? forceHeader : (showHeader ?? false);

  return (
    <div className="min-h-screen flex flex-col">
      {shouldShowHeader && <TheHeader />}
      <main className="flex-1">{children}</main>
    </div>
  );
}

// 편의를 위한 특화된 레이아웃 컴포넌트들
export function HeaderLayout({ children }: { children: ReactNode }) {
  return <AppLayout showHeader={true}>{children}</AppLayout>;
}

export function NoHeaderLayout({ children }: { children: ReactNode }) {
  return <AppLayout showHeader={false}>{children}</AppLayout>;
}
