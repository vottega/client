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
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { getToken } from "@/lib/auth";
import { useAuth } from "@/lib/auth/AuthContext";
import { CircleUser } from "lucide-react";
import { Link } from "react-router-dom";

export default function TheHeader() {
  const { userId, role } = useAuth();
  const token = getToken();
  const isLoggedIn = token != null && userId != undefined && role === "USER";
  console.log(token, userId, role, isLoggedIn);

  return (
    <BaseHeader className="z-40">
      <BaseHeader.Logo className="hidden md:block" />
      <h1>Vottega</h1>
      {isLoggedIn && (
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink href="/rooms" className={navigationMenuTriggerStyle()}>
                회의실
              </NavigationMenuLink>
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
              <DropdownMenuItem>로그아웃</DropdownMenuItem>
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
