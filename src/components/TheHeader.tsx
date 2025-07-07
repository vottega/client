import { BaseHeader } from "@/components/Header.Base";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useLogout } from "@/lib/api/queries/auth";
import { NOT_AUTHENTICATED, useAuth } from "@/lib/auth/AuthContext";
import { CircleUser } from "lucide-react";
import { useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function TheHeader() {
  const auth = useAuth();
  const isLoggedIn = useMemo(() => auth !== NOT_AUTHENTICATED && auth?.role === "USER", [auth]);
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();

  const handleRoomButtonClick = useCallback(() => {
    navigate("/rooms");
  }, [navigate]);

  const handleLogout = useCallback(() => {
    logout(undefined, {
      onSuccess: () => {
        navigate("/");
      },
    });
  }, [logout, navigate]);

  return (
    <BaseHeader className="z-40">
      <BaseHeader.Logo className="hidden md:block" />
      <h1>Vottega</h1>
      {isLoggedIn && (
        <NavigationMenu className="flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Button variant="ghost" onClick={handleRoomButtonClick}>
                회의실
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">사용자 정보 메뉴 여닫기</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>류기현님</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>설정</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>로그아웃</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild>
            <Link to="/signin">로그인</Link>
          </Button>
        )}
      </div>
    </BaseHeader>
  );
}
