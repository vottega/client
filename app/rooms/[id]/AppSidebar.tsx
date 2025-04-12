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
import { useVoteDialog } from "@/hooks/useDialog.vote";
import { Endpoints } from "@/lib/api/endpoints";
import { customFetch } from "@/lib/api/fetcher";
import {
  FractionVO,
  VoteResponseDTO,
  VoteSchema,
  type VoteDetailResponseDTO,
  type VoteRequestDTO,
} from "@/lib/api/types/vote-service.dto";
import { getKoreanTimeWithZeroSecond } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { z } from "zod";

const sidebarRightData = {
  user: {
    name: "류기현",
    email: "example@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  roomId: string;
}

export function AppSidebar({ roomId, ...props }: AppSidebarProps) {
  const getVoteList = useCallback((url: string) => customFetch<VoteResponseDTO[]>(url), []);

  const {
    data: voteList = [],
    mutate: refreshVoteList,
    error,
    isLoading,
  } = useSWR(Endpoints.vote.getInfo(roomId).toFullPath(), getVoteList);

  const skeletonFill = useMemo(() => Math.max(5 - voteList.length, 0), [voteList]);

  const { onFail, onSuccess, open, setOpen } = useVoteDialog();

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
            <Dialog open={open} onOpenChange={setOpen}>
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
                <VoteForm roomId={roomId} onFail={onFail} onSuccess={onSuccess} />
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
              {voteList.map((vote, idx) => (
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
                              <p>{vote.reservedStartTime.slice(0, 10)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="text-right pl-0 pr-2">
                        <Badge
                          className="text-xs whitespace-nowrap"
                          variant={vote.status === "ENDED" ? "default" : "outline"}
                        >
                          {vote.status === "ENDED" ? "완료" : "대기"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader className="flex-row items-center gap-2">
                      <DialogTitle>투표 정보</DialogTitle>
                      <DialogDescription>
                        {vote.status === "ENDED"
                          ? "완료된 투표 정보와 결과를 조회할 수 있어요"
                          : "대기 중인 투표 정보를 조회 및 수정할 수 있어요."}
                      </DialogDescription>
                    </DialogHeader>
                    {vote.status === "ENDED" ? (
                      <Tabs defaultValue="info">
                        <TabsList className="w-full grid grid-cols-2 mb-4">
                          <TabsTrigger value="info">투표 정보</TabsTrigger>
                          <TabsTrigger value="result">투표 결과</TabsTrigger>
                        </TabsList>
                        <TabsContent value="info">
                          <VoteInfo
                            existingVote={vote}
                            roomId={roomId}
                            onFail={onFail}
                            onSuccess={onSuccess}
                          />
                        </TabsContent>
                        <TabsContent value="result">
                          {/* TODO: 투표 결과 */}
                          <p>투표 결과</p>
                        </TabsContent>
                      </Tabs>
                    ) : (
                      <VoteInfo
                        existingVote={vote}
                        roomId={roomId}
                        onFail={onFail}
                        onSuccess={onSuccess}
                      />
                    )}
                  </DialogContent>
                </Dialog>
              ))}
              {[...Array(skeletonFill)].map((_, idx) => (
                <TableRow key={voteList.length + idx + 1} className="relative h-[73px] z-0">
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

export function VoteInfo({
  roomId,
  existingVote,
  onFail,
  onSuccess,
}: React.ComponentProps<typeof VoteForm>) {
  return (
    <VoteForm existingVote={existingVote} roomId={roomId} onFail={onFail} onSuccess={onSuccess} />
  );
}

export function VoteForm({
  roomId,
  existingVote,
  onSuccess,
  onFail,
}: {
  roomId: string;
  existingVote?: VoteResponseDTO;
  onSuccess: () => void;
  onFail: () => void;
}) {
  const form = useForm<z.infer<typeof VoteSchema>>({
    resolver: zodResolver(VoteSchema),
    defaultValues: {
      agendaName: "",
      voteName: "",
      minParticipantNumber: 0,
      minParticipantRate: { denominator: 1, numerator: 1 },
      passRate: { denominator: 2, numerator: 1 },
      reservedStartTime: getKoreanTimeWithZeroSecond(),
      startNow: true,
      isSecret: false,
      ...existingVote,
    },
  });

  const createVoteFetcher = (url: string, { arg }: { arg: VoteRequestDTO }) =>
    customFetch<VoteDetailResponseDTO>(url, { method: "POST", body: JSON.stringify(arg) });

  const {
    data,
    error,
    trigger: createVote,
  } = useSWRMutation(Endpoints.vote.create(roomId).toFullPath(), createVoteFetcher);

  const ratioToQuorum = useCallback((ratio: FractionVO) => {
    const { numerator, denominator } = ratio;
    return Math.min(partcipantCount, Math.ceil(partcipantCount * (numerator / denominator)));
  }, []);

  function onSubmit(data: z.infer<typeof VoteSchema>) {
    if (data.startNow) {
      data.reservedStartTime = getKoreanTimeWithZeroSecond();
    }

    const { startNow, ...reqBody } = data;

    createVote(reqBody);
  }

  const partcipantCount = 20;

  useEffect(() => {
    if (error) {
      onFail();
    }
  }, [error, onFail]);

  useEffect(() => {
    if (data) {
      onSuccess();
    }
  }, [data, onSuccess]);

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
                  disabled={existingVote?.status === "ENDED"}
                />
              </FormControl>
            </FormItem>
          )}
          rules={{ required: true }}
        />

        <FormField
          control={form.control}
          name="voteName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>표결 내용</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="예: 아카라카를 온누리에 관련 중앙운영위원회 입장문을 작성해 공개한다."
                  disabled={existingVote?.status === "ENDED"}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="minParticipantNumber"
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
                  disabled={existingVote?.status === "ENDED"}
                  value={field.value ?? 0}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="minParticipantRate"
          render={() => (
            <FormItem className="flex items-center justify-between gap-0">
              <div className="flex flex-col">
                <FormLabel>의사정족수</FormLabel>

                <FormDescription>
                  <span className="text-primary text-base font-semibold border-b-2 border-primary">
                    {ratioToQuorum(form.watch("minParticipantRate"))}명
                  </span>{" "}
                  이상 출석해야 회의를 진행할 수 있음
                </FormDescription>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <FormField
                  control={form.control}
                  name="minParticipantRate.numerator"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="w-10 p-1 text-center transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                          disabled={existingVote?.status === "ENDED"}
                          onChange={(e) => {
                            field.onChange(parseInt(e.target.value));
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <span className="text-muted-foreground">/</span>
                <FormField
                  control={form.control}
                  name="minParticipantRate.denominator"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="w-10 p-1 text-center transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                          disabled={existingVote?.status === "ENDED"}
                          onChange={(e) => {
                            field.onChange(parseInt(e.target.value));
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passRate"
          render={() => (
            <FormItem className="flex items-center justify-between gap-0">
              <div className="flex flex-col">
                <FormLabel>의결정족수</FormLabel>

                <FormDescription>
                  <span className="text-primary text-base font-semibold border-b-2 border-primary">
                    {ratioToQuorum(form.watch("passRate"))}명
                  </span>{" "}
                  이상 찬성해야 안건을 가결할 수 있음
                </FormDescription>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <FormField
                  control={form.control}
                  name="passRate.numerator"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="w-10 p-1 text-center transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                          disabled={existingVote?.status === "ENDED"}
                          onChange={(e) => {
                            field.onChange(parseInt(e.target.value));
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <span className="text-muted-foreground">/</span>
                <FormField
                  control={form.control}
                  name="passRate.denominator"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="w-10 p-1 text-center transition-all [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                          disabled={existingVote?.status === "ENDED"}
                          onChange={(e) => {
                            field.onChange(parseInt(e.target.value));
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-between items-center">
          <FormField
            control={form.control}
            name="reservedStartTime"
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
                    disabled={existingVote?.status === "ENDED" || form.watch("startNow")}
                    min={field.value ?? undefined}
                    value={field.value ?? undefined}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!(existingVote?.status === "ENDED") && (
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
                          form.setValue("reservedStartTime", getKoreanTimeWithZeroSecond());
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
          name="isSecret"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mr-1">무기명</FormLabel>
              <FormControl>
                <Checkbox
                  className="align-text-bottom"
                  checked={field.value ?? undefined}
                  onCheckedChange={(checked) => field.onChange(checked)}
                  disabled={existingVote?.status === "ENDED"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!(existingVote?.status === "ENDED") && (
          <DialogFooter>
            <Button type="submit">{existingVote ? "수정하기" : "생성하기"}</Button>
          </DialogFooter>
        )}
      </form>
    </Form>
  );
}
