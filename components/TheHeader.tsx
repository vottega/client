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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CircleUser, Menu, Package2 } from "lucide-react";
import Link from "next/link";

export default function TheHeader() {
  return (
    <BaseHeader className="z-40">
      <BaseHeader.Logo className="hidden md:block" />
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
              대시보드
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/rooms" className={navigationMenuTriggerStyle()}>
              회의실
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">네비게이션 메뉴 여닫기</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="sr-only">vottega</span>
            </Link>
            <Link href="#" className="hover:text-foreground">
              대시보드
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              회의실
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
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
      </div>
    </BaseHeader>
  );
}
