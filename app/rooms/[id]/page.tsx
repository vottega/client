"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";

import { Room } from "@/app/rooms/[id]/Room";
import { Avatars } from "@/components/liveblocks/Avatars";
import { Editor } from "@/components/liveblocks/Editor";
import { Status } from "@/components/liveblocks/Status";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Header } from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Main } from "@/components/ui/main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const sidebarRightData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
};

export default function Rooms({ params: { pageId } }: { params: { pageId: string } }) {
  console.log(pageId);
  const router = useRouter();
  const FormSchema = z.object({
    agendaName: z.string().min(1, { message: "안건명을 입력해주세요." }),
    voteContent: z.string().min(1, { message: "표결 내용을 입력해주세요." }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { agendaName: "", voteContent: "" },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // TODO: 통신
    console.log(data);

    const voteId = 1;
    // router.push(`/vote/${voteId}`);
  }
  return (
    <SidebarProvider>
      <SidebarInset className="max-w-full">
        <Header>
          <Header.Logo />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink className="line-clamp-1" href="/rooms">
                  내 회의실
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">회의실 이름</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <SidebarTrigger className="-mr-1 ml-auto rotate-180" />
        </Header>

        {/* contents */}
        <Main>
          <div className="flex w-full flex-col gap-4 md:gap-8 flex-grow">
            <Card className="grow-[2] flex flex-col max-w-full">
              <CardHeader>
                <CardTitle>속기</CardTitle>
                <CardDescription>회의 속기가 이루어지는 공간이에요.</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow h-0">
                <Shorthand pageId={pageId} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>투표 정보</CardTitle>
                <CardDescription>현재 진행 중이거나, 진행 예정인 안건이에요.</CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="w-full h-[10vh]" />
              </CardContent>
            </Card>
          </div>
        </Main>
      </SidebarInset>

      <SidebarRight side="right" />
    </SidebarProvider>
  );
}
function Shorthand({ pageId }: { pageId: string }) {
  return (
    <Room pageId={pageId}>
      {/* Sticky header */}
      <div className="sticky top-0 left-0 right-0 h-[60px] flex items-center justify-between px-4 z-20">
        <div className="absolute top-3 left-3">
          <Status />
        </div>
        <div />
        <Avatars />
      </div>

      <Editor />
    </Room>
  );
}
function SidebarRight({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const [votes, setVotes] = useState([]);
  const skeletonFill = useMemo(() => Math.max(3 - votes.length, 0), [votes]);
  const FormSchema = z.object({
    agendaName: z.string().min(1, { message: "안건명을 입력해주세요." }),
    voteContent: z.string().min(1, { message: "표결 내용을 입력해주세요." }),
    requiredAttendance: z.number().int().min(0, { message: "출석 필요 인원은 0명 이상입니다." }),
    proceduralQuorum: z.string().min(2, { message: "의사정족수를 입력해주세요." }),
    votingQuorum: z.string().min(2, { message: "의결정족수를 입력해주세요." }),
    startTime: z.string().datetime({ message: "시작 시간을 입력해주세요.", local: true }),
    startNow: z.boolean().default(true).optional(),
    secretBallot: z.boolean().default(false).optional(),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      agendaName: "",
      voteContent: "",
      requiredAttendance: 0,
      proceduralQuorum: "11",
      votingQuorum: "12",
      startTime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 16),
      startNow: true,
      secretBallot: false,
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // TODO: 통신
    console.log(data);

    const voteId = 1;
    // router.push(`/vote/${voteId}`);
  }

  return (
    <Sidebar className="hidden lg:flex h-svh border-l" {...props}>
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser user={sidebarRightData.user} />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <SidebarSeparator className="mx-0" />
        <div className="flex flex-col flex-grow h-0">
          <CardHeader className="flex flex-row items-center sticky top-0 z-10 bg-sidebar p-4">
            <div className="grid">
              <CardTitle className="text-xl">안건 및 투표</CardTitle>
              <CardDescription>최근 진행한 10건의 투표예요.</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="ml-auto gap-1">
                  투표 생성
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] h-fit overflow-y-scroll">
                <DialogHeader>
                  <DialogTitle>투표 생성하기</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="agendaName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>안건명</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="예: 개교 139주년 아카라카를 온누리에 티켓팅 관련 중앙운영위원회 대응
                            논의의 안"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                      rules={{ required: true }}
                    />
                    <FormField
                      control={form.control}
                      name="voteContent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>표결 내용</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="예: 아카라카를 온누리에 관련 중앙운영위원회 입장문을 작성해 공개한다."
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="requiredAttendance"
                      render={({ field }) => (
                        <FormItem className="flex justify-between items-center space-y-0">
                          <div className="flex flex-col">
                            <FormLabel>출석 필요 인원</FormLabel>
                            <FormMessage />
                          </div>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              className="w-[102px]"
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="proceduralQuorum"
                      render={({ field }) => (
                        <FormItem className="flex justify-between items-center space-y-0">
                          <div className="flex flex-col gap-2">
                            <FormLabel>의사정족수</FormLabel>
                            <FormDescription>
                              <Badge>10명</Badge> 이상 출석해야 회의를 진행할 수 있음
                            </FormDescription>
                          </div>
                          <FormControl>
                            <InputOTP
                              maxLength={2}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                            >
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                              </InputOTPGroup>
                              <span>/</span>
                              <InputOTPGroup>
                                <InputOTPSlot index={1} />
                              </InputOTPGroup>
                            </InputOTP>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="votingQuorum"
                      render={({ field }) => (
                        <FormItem className="flex justify-between items-center space-y-0">
                          <div className="flex flex-col gap-2">
                            <FormLabel>의결정족수</FormLabel>
                            <FormDescription>
                              <Badge>10명</Badge> 이상 찬성해야 안건을 가결할 수 있음
                            </FormDescription>
                          </div>
                          <FormControl>
                            <InputOTP
                              maxLength={2}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                            >
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                              </InputOTPGroup>
                              <span>/</span>
                              <InputOTPGroup>
                                <InputOTPSlot index={1} />
                              </InputOTPGroup>
                            </InputOTP>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-between items-center">
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem className="flex justify-between items-center space-y-0">
                            <FormLabel className="mr-4">시작 시간</FormLabel>
                            <FormControl>
                              <Input
                                type="datetime-local"
                                {...field}
                                className="w-fit"
                                onChange={(e) => {
                                  field.onChange(e.target.value + ":00");
                                }}
                                disabled={form.watch("startNow")}
                                min={field.value}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="startNow"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="mr-1">바로 시작</FormLabel>
                            <FormControl>
                              <Checkbox
                                className="align-text-bottom"
                                checked={field.value}
                                onCheckedChange={(checked) => field.onChange(checked)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="secretBallot"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="mr-1">무기명</FormLabel>
                          <FormControl>
                            <Checkbox
                              className="align-text-bottom"
                              checked={field.value}
                              onCheckedChange={(checked) => field.onChange(checked)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">생성하기</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <Table>
            <TableHeader className="sticky top-0 bg-sidebar z-10">
              <TableRow>
                <TableHead>안건명</TableHead>
                <TableHead className="text-right">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 2 }).map((_, idx) => (
                <Dialog key={idx}>
                  <DialogTrigger asChild>
                    <TableRow key={idx} className="h-0">
                      <TableCell className="font-medium">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-overflow">
                                개교 139주년 아카라카를 온누리에 티켓팅 관련 중앙운영위원회 대응
                                논의의 안
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>2023-06-26</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="text-xs" variant="outline">
                          투표 전
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>투표 정보</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input id="name" value="Pedro Duarte" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                          Username
                        </Label>
                        <Input id="username" value="@peduarte" className="col-span-3" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ))}
              {[...Array(skeletonFill)].map((_, idx) => (
                <TableRow key={votes.length + idx + 1} className="relative h-[73px] z-0">
                  <TableCell>
                    <Skeleton className="h-[40px] w-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-[40px] w-full ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="sr-only">
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <SidebarSeparator className="mx-0" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Dialog>
              <DialogTrigger asChild>
                <SidebarMenuButton>
                  <Users />
                  <span>현재 접속 인원</span>
                </SidebarMenuButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>현재 접속 인원</DialogTitle>
                  <DialogDescription className="flex justify-between items-center">
                    현재 접속 인원은 실시간으로 업데이트 됩니다.
                  </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="online">
                  <TabsList className="w-full grid grid-cols-2 mb-4">
                    <TabsTrigger value="online">온라인 (11)</TabsTrigger>
                    <TabsTrigger value="offline">오프라인 (9)</TabsTrigger>
                  </TabsList>
                  <TabsContent value="online">
                    <div className="grid gap-8 grid-cols-2 h-[318px] overflow-y-scroll">
                      {Array.from({ length: 10 }).map((_, idx) => (
                        <div className="flex items-center gap-4 h-fit" key={idx}>
                          <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarImage src="/avatars/01.png" alt="Avatar" />
                            <AvatarFallback>민균</AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">윤민균</p>
                            <p className="text-sm text-muted-foreground">인지융 컴퓨터과학과</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="offline">
                    <div className="grid gap-8 grid-cols-2 h-[318px] overflow-y-scroll">
                      {Array.from({ length: 20 }).map((_, idx) => (
                        <div key={idx} className="flex items-center gap-4 h-fit">
                          <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarImage src="/avatars/01.png" alt="Avatar" />
                            <AvatarFallback>기현</AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">류기현</p>
                            <p className="text-sm text-muted-foreground">문과대학 중어중문학과</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
