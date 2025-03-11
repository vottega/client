"use client";

import { ArrowUpRight, BadgeCheck, Bell, ChevronsUpDown, LogOut, Plus, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
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
import { Vote, VoteSchema } from "@/constants/vote";
import { useRoomContext } from "@/hooks/useRoomContext";
import { getKoreanTimeWithZeroSecond } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const sidebarRightData = {
  user: {
    name: "류기현",
    email: "example@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [votes, setVotes] = useState<Vote[]>([
    {
      agendaName: "개교 139주년 아카라카를 온누리에 티켓팅 관련 중앙운영위원회 대응 논의의 안",
      voteContent: "아카라카를 온누리에 관련 중앙운영위원회 입장문을 작성해 공개한다.",
      requiredAttendance: 0,
      proceduralQuorum: "24",
      votingQuorum: "12",
      startTime: "2025-01-24T14:00:00",
      startNow: false,
      secretBallot: true,
      isFinished: false,
    },
    {
      agendaName:
        "개교 139주년 아카라카를 온누리에 티켓팅 관련 중앙운영위원회 대응 논의의 안 개교 139주년 아카라카를 온누리에 티켓팅 관련 중앙운영위원회 대응 논의의 안",
      voteContent: "아카라카를 온누리에 관련 중앙운영위원회 입장문을 작성해 공개한다.",
      requiredAttendance: 0,
      proceduralQuorum: "12",
      votingQuorum: "12",
      startTime: "2025-01-24T14:00:00",
      startNow: false,
      secretBallot: false,
      isFinished: false,
    },
    {
      agendaName: "중앙운영위원회 대응 논의의 안",
      voteContent: "아카라카를 온누리에 관련 중앙운영위원회 입장문을 작성해 공개한다.",
      requiredAttendance: 0,
      proceduralQuorum: "12",
      votingQuorum: "12",
      startTime: "2025-01-24T14:00:00",
      startNow: false,
      secretBallot: false,
      isFinished: true,
    },
  ]);
  const skeletonFill = useMemo(() => Math.max(5 - votes.length, 0), [votes]);

  return (
    <Sidebar className="hidden lg:flex h-svh border-l" {...props}>
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser user={sidebarRightData.user} />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <div className="flex flex-col flex-grow h-0">
          <CardHeader className="flex flex-row items-center sticky top-0 z-10 bg-sidebar p-4 md:py-6">
            <div className="grid">
              <CardTitle className="text-xl">안건 및 투표</CardTitle>
              <CardDescription>최근 진행한 투표예요.</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="ml-auto gap-1">
                  투표 생성
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>투표 생성하기</DialogTitle>
                </DialogHeader>
                <VoteForm />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <Table>
            <TableHeader className="sticky top-0 bg-sidebar z-10">
              <TableRow>
                <TableHead>안건명</TableHead>
                <TableHead className="text-right pl-0">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {votes.map((vote, idx) => (
                <Dialog key={idx}>
                  <DialogTrigger asChild>
                    <TableRow key={idx} className="h-0 cursor-pointer">
                      <TableCell className="font-medium">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-overflow">{vote.agendaName}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{vote.startTime.slice(0, 10)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="text-right pl-0 pr-2">
                        <Badge
                          className="text-xs whitespace-nowrap"
                          variant={vote.isFinished ? "default" : "outline"}
                        >
                          {vote.isFinished ? "완료" : "대기"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader className="flex-row items-center gap-2">
                      <DialogTitle>투표 정보</DialogTitle>
                      <DialogDescription>
                        {vote.isFinished
                          ? "완료된 투표 정보와 결과를 조회할 수 있어요"
                          : "대기 중인 투표 정보를 조회 및 수정할 수 있어요."}
                      </DialogDescription>
                    </DialogHeader>
                    {vote.isFinished ? (
                      <Tabs defaultValue="info">
                        <TabsList className="w-full grid grid-cols-2 mb-4">
                          <TabsTrigger value="info">투표 정보</TabsTrigger>
                          <TabsTrigger value="result">투표 결과</TabsTrigger>
                        </TabsList>
                        <TabsContent value="info">
                          <VoteInfo vote={vote} />
                        </TabsContent>
                        <TabsContent value="result">
                          {/* TODO: 투표 결과 */}
                          <p>투표 결과</p>
                        </TabsContent>
                      </Tabs>
                    ) : (
                      <VoteInfo vote={vote} />
                    )}
                  </DialogContent>
                </Dialog>
              ))}
              {[...Array(skeletonFill)].map((_, idx) => (
                <TableRow key={votes.length + idx + 1} className="relative h-[73px] z-0">
                  <TableCell>
                    <Skeleton className="h-[40px] w-full" />
                  </TableCell>
                  <TableCell className="text-right pl-0 pr-2">
                    <Skeleton className="h-[22px] w-full rounded-full" />
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
                <AvatarFallback className="rounded-lg">{user.name.slice(0, 2)}</AvatarFallback>
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
                  <AvatarFallback className="rounded-lg">{user.name.slice(0, 2)}</AvatarFallback>
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
                <BadgeCheck className="mr-2" />
                계정
                <ArrowUpRight size={10} className="-translate-y-2" />
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Bell className="mr-2" />
                공지
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2" />
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function VoteInfo({ vote }: { vote: Vote }) {
  return <VoteForm existingVote={vote} />;
}

function VoteForm({ existingVote }: { existingVote?: Vote }) {
  const form = useForm<z.infer<typeof VoteSchema>>({
    resolver: zodResolver(VoteSchema),
    defaultValues: {
      agendaName: "",
      voteContent: "",
      requiredAttendance: 0,
      // TODO: input otp > custom fraction input으로 전환
      proceduralQuorum: "11",
      votingQuorum: "12",
      startTime: getKoreanTimeWithZeroSecond(),
      startNow: true,
      secretBallot: false,
      ...existingVote,
    },
  });

  const ratioToQuorum = useCallback((ratio: string) => {
    const [numerator, denominator] = ratio.split("").map((str) => parseInt(str));

    if (numerator > denominator) {
      return partcipantCount;
    }

    return Math.ceil(partcipantCount * (numerator / denominator));
  }, []);

  function onSubmit(data: z.infer<typeof VoteSchema>) {
    if (data.startNow) {
      data.startTime = getKoreanTimeWithZeroSecond();
    }
    data.proceduralQuorum = ratioToQuorum(data.proceduralQuorum).toString();
    data.votingQuorum = ratioToQuorum(data.votingQuorum).toString();
  }

  const { participants } = useRoomContext();

  const partcipantCount = 20;

  const quorumRatioPattern = "^[1-9]+$";

  return (
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
                  placeholder="예: 개교 139주년 아카라카를 온누리에 티켓팅 관련 중앙운영위원회 대응 논의의 안"
                  disabled={existingVote?.isFinished}
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
                  disabled={existingVote?.isFinished}
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
                  disabled={existingVote?.isFinished}
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
                  <span className="text-primary text-base font-semibold border-b-2 border-primary">
                    {ratioToQuorum(field.value)}명
                  </span>{" "}
                  이상 출석해야 회의를 진행할 수 있음
                </FormDescription>
              </div>
              <FormControl>
                <InputOTP
                  maxLength={2}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  disabled={existingVote?.isFinished}
                  pattern={quorumRatioPattern}
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
                  <span className="text-primary text-base font-semibold border-b-2 border-primary">
                    {ratioToQuorum(field.value)}명
                  </span>{" "}
                  이상 찬성해야 안건을 가결할 수 있음
                </FormDescription>
              </div>
              <FormControl>
                <InputOTP
                  maxLength={2}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  disabled={existingVote?.isFinished}
                  pattern={quorumRatioPattern}
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
                    disabled={existingVote?.isFinished || form.watch("startNow")}
                    min={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!existingVote?.isFinished && (
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
                      onCheckedChange={(checked) => {
                        if (checked) {
                          form.setValue("startTime", getKoreanTimeWithZeroSecond());
                        }
                        field.onChange(checked);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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
                  disabled={existingVote?.isFinished}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!existingVote?.isFinished && (
          <DialogFooter>
            <Button type="submit">{existingVote ? "수정하기" : "생성하기"}</Button>
          </DialogFooter>
        )}
      </form>
    </Form>
  );
}
