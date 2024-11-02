"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  DollarSign,
  LogOut,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Main } from "@/components/ui/main";

const sidebarRightData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
};

export default function Room() {
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
      <SidebarInset>
        <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">회의실 이름</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* contents */}
        <Main>
          <div className="flex w-full flex-col gap-4 md:gap-8 flex-grow">
            {/* <div className="grid grid-cols-2 gap-8">
              <Card x-chunk="dashboard-01-chunk-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">총 안건</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2 개</div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-01-chunk-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">인원 관리</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">17 명</div>
                </CardContent>
              </Card>
            </div> */}
            {/* <div className="grid gap-4 grid-rows-2 lg:grid-rows-none md:gap-8 lg:grid-cols-2 xl:grid-cols-3 flex-grow h-0">
              <Card className="xl:col-span-2 overflow-y-auto" x-chunk="dashboard-01-chunk-4">
                <CardHeader className="flex flex-row items-center sticky top-0 z-10 bg-white">
                  <div className="grid gap-2">
                    <CardTitle>안건 및 투표</CardTitle>
                    <CardDescription>최근 진행한 투표입니다.</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="ml-auto gap-1">
                        투표 생성하기
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>투표 생성하기</DialogTitle>
                        <DialogDescription>
                          기본적인 정보를 입력해 투표를 생성해주세요.
                        </DialogDescription>
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
                                  <Input {...field} placeholder="안건 제목을 입력해주세요." />
                                </FormControl>
                                <FormDescription>
                                  예: 개교 139주년 아카라카를 온누리에 티켓팅 관련 중앙운영위원회 대응
                                  논의의 안
                                </FormDescription>
                                <FormMessage />
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
                                  <Input {...field} placeholder="표결 내용을 입력해주세요." />
                                </FormControl>
                                <FormDescription>
                                  예: 아카라카를 온누리에 관련 중앙운영위원회 입장문을 작성해
                                  공개한다.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          ></FormField>
                          <DialogFooter>
                            <Button type="submit">생성하기</Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="">날짜</TableHead>
                        <TableHead>안건명</TableHead>
                        <TableHead className="text-right">상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="">2023-06-01</TableCell>
                        <TableCell>
                          <div className="font-medium">
                            개교 139주년 아카라카를 온누리에 티켓팅 관련 중앙운영위원회 대응 논의의 안
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="text-xs" variant="outline">
                            투표 전
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="">2023-06-02</TableCell>
                        <TableCell>
                          <div className="font-medium">
                            개교 139주년 아카라카를 온누리에 티켓팅 관련 중앙운영위원회 대응 논의의 안
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="text-xs" variant="outline">
                            투표 전
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="">2023-06-03</TableCell>
                        <TableCell>
                          <div className="font-medium">
                            개교 139주년 아카라카를 온누리에 티켓팅 관련 중앙운영위원회 대응 논의의 안
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="text-xs" variant="outline">
                            투표 전
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="">2023-06-04</TableCell>
                        <TableCell>
                          <div className="font-medium">
                            개교 139주년 아카라카를 온누리에 티켓팅 관련 중앙운영위원회 대응 논의의 안
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="text-xs" variant="outline">
                            투표 전
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="">2023-06-05</TableCell>
                        <TableCell>
                          <div className="font-medium">
                            개교 139주년 아카라카를 온누리에 티켓팅 관련 중앙운영위원회 대응 논의의 안
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="text-xs" variant="outline">
                            투표 전
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="">2023-06-06</TableCell>
                        <TableCell>
                          <div className="font-medium">
                            개교 139주년 아카라카를 온누리에 티켓팅 관련 중앙운영위원회 대응 논의의 안
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="text-xs" variant="outline">
                            투표 전
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="">2023-06-07</TableCell>
                        <TableCell>
                          <div className="font-medium">
                            개교 139주년 아카라카를 온누리에 티켓팅 관련 중앙운영위원회 대응 논의의 안
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="text-xs" variant="outline">
                            투표 전
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card className="overflow-y-auto" x-chunk="dashboard-01-chunk-5">
                <CardHeader className="flex-row gap-4 space-y-0 justify-between sticky top-0 z-10 bg-white">
                  <CardTitle>현재 접속 인원</CardTitle>
                  <div className="flex gap-2">
                    <Badge className="text-base" variant={"outline"}>
                      11명 / 20명
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="online">
                    <TabsList className="w-full grid grid-cols-2 mb-4">
                      <TabsTrigger value="online">온라인</TabsTrigger>
                      <TabsTrigger value="offline">오프라인</TabsTrigger>
                    </TabsList>
                    <TabsContent value="online">
                      <div className="grid gap-8 grid-cols-2">
                        <div className="flex items-center gap-4">
                          <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarImage src="/avatars/01.png" alt="Avatar" />
                            <AvatarFallback>민균</AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">윤민균</p>
                            <p className="text-sm text-muted-foreground">인지융 컴퓨터과학과</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarImage src="/avatars/02.png" alt="Avatar" />
                            <AvatarFallback>기현</AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">류기현</p>
                            <p className="text-sm text-muted-foreground">문과대학 중어중문학과</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarImage src="/avatars/02.png" alt="Avatar" />
                            <AvatarFallback>기현</AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">류기현</p>
                            <p className="text-sm text-muted-foreground">문과대학 중어중문학과</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarImage src="/avatars/02.png" alt="Avatar" />
                            <AvatarFallback>기현</AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">류기현</p>
                            <p className="text-sm text-muted-foreground">문과대학 중어중문학과</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarImage src="/avatars/02.png" alt="Avatar" />
                            <AvatarFallback>기현</AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">류기현</p>
                            <p className="text-sm text-muted-foreground">문과대학 중어중문학과</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarImage src="/avatars/02.png" alt="Avatar" />
                            <AvatarFallback>기현</AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">류기현</p>
                            <p className="text-sm text-muted-foreground">문과대학 중어중문학과</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarImage src="/avatars/02.png" alt="Avatar" />
                            <AvatarFallback>기현</AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">류기현</p>
                            <p className="text-sm text-muted-foreground">문과대학 중어중문학과</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarImage src="/avatars/02.png" alt="Avatar" />
                            <AvatarFallback>기현</AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">류기현</p>
                            <p className="text-sm text-muted-foreground">문과대학 중어중문학과</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarImage src="/avatars/02.png" alt="Avatar" />
                            <AvatarFallback>기현</AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">류기현</p>
                            <p className="text-sm text-muted-foreground">문과대학 중어중문학과</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="offline">
                      <div className="grid gap-8 grid-cols-2">
                        <div className="flex items-center gap-4">
                          <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarImage src="/avatars/01.png" alt="Avatar" />
                            <AvatarFallback>민균</AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">윤민균</p>
                            <p className="text-sm text-muted-foreground">인지융 컴퓨터과학과</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarImage src="/avatars/02.png" alt="Avatar" />
                            <AvatarFallback>기현</AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">류기현</p>
                            <p className="text-sm text-muted-foreground">문과대학 중어중문학과</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div> */}
            <Card className="grow-[2]">
              <CardHeader>
                <CardTitle>속기</CardTitle>
                <CardDescription>회의 속기가 이루어지는 공간이에요.</CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="w-full h-[20vh]" />
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
      <SidebarRight />
    </SidebarProvider>
  );
}

function SidebarRight({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
    <Sidebar collapsible="none" className="sticky hidden lg:flex top-0 h-svh border-l" {...props}>
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser user={sidebarRightData.user} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarSeparator className="mx-0" />
        <Card className="xl:col-span-2 overflow-y-auto" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-row items-center sticky top-0 z-10 bg-white">
            <div className="grid gap-2">
              <CardTitle>안건 및 투표</CardTitle>
              <CardDescription>최근 진행한 투표입니다.</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="ml-auto gap-1">
                  투표 생성하기
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>투표 생성하기</DialogTitle>
                  <DialogDescription>기본적인 정보를 입력해 투표를 생성해주세요.</DialogDescription>
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
                            <Input {...field} placeholder="안건 제목을 입력해주세요." />
                          </FormControl>
                          <FormDescription>
                            예: 개교 139주년 아카라카를 온누리에 티켓팅 관련 중앙운영위원회 대응
                            논의의 안
                          </FormDescription>
                          <FormMessage />
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
                            <Input {...field} placeholder="표결 내용을 입력해주세요." />
                          </FormControl>
                          <FormDescription>
                            예: 아카라카를 온누리에 관련 중앙운영위원회 입장문을 작성해 공개한다.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                    <DialogFooter>
                      <Button type="submit">생성하기</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="">날짜</TableHead>
                  <TableHead>안건명</TableHead>
                  <TableHead className="text-right">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="">2023-06-01</TableCell>
                  <TableCell>
                    <div className="font-medium">
                      개교 139주년 아카라카를 온누리에 티켓팅 관련 중앙운영위원회 대응 논의의 안
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge className="text-xs" variant="outline">
                      투표 전
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <SidebarSeparator className="mx-0" />

        <Card className="overflow-y-auto" x-chunk="dashboard-01-chunk-5">
          <CardHeader className="flex-row gap-4 space-y-0 justify-between sticky top-0 z-10 bg-white">
            <CardTitle>현재 접속 인원</CardTitle>
            <div className="flex gap-2">
              <Badge className="text-base" variant={"outline"}>
                11명 / 20명
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="online">
              <TabsList className="w-full grid grid-cols-2 mb-4">
                <TabsTrigger value="online">온라인</TabsTrigger>
                <TabsTrigger value="offline">오프라인</TabsTrigger>
              </TabsList>
              <TabsContent value="online">
                <div className="grid gap-8 grid-cols-2">
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/01.png" alt="Avatar" />
                      <AvatarFallback>민균</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">윤민균</p>
                      <p className="text-sm text-muted-foreground">인지융 컴퓨터과학과</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/02.png" alt="Avatar" />
                      <AvatarFallback>기현</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">류기현</p>
                      <p className="text-sm text-muted-foreground">문과대학 중어중문학과</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/02.png" alt="Avatar" />
                      <AvatarFallback>기현</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">류기현</p>
                      <p className="text-sm text-muted-foreground">문과대학 중어중문학과</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/02.png" alt="Avatar" />
                      <AvatarFallback>기현</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">류기현</p>
                      <p className="text-sm text-muted-foreground">문과대학 중어중문학과</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/02.png" alt="Avatar" />
                      <AvatarFallback>기현</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">류기현</p>
                      <p className="text-sm text-muted-foreground">문과대학 중어중문학과</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/02.png" alt="Avatar" />
                      <AvatarFallback>기현</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">류기현</p>
                      <p className="text-sm text-muted-foreground">문과대학 중어중문학과</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/02.png" alt="Avatar" />
                      <AvatarFallback>기현</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">류기현</p>
                      <p className="text-sm text-muted-foreground">문과대학 중어중문학과</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/02.png" alt="Avatar" />
                      <AvatarFallback>기현</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">류기현</p>
                      <p className="text-sm text-muted-foreground">문과대학 중어중문학과</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/02.png" alt="Avatar" />
                      <AvatarFallback>기현</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">류기현</p>
                      <p className="text-sm text-muted-foreground">문과대학 중어중문학과</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="offline">
                <div className="grid gap-8 grid-cols-2">
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/01.png" alt="Avatar" />
                      <AvatarFallback>민균</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">윤민균</p>
                      <p className="text-sm text-muted-foreground">인지융 컴퓨터과학과</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarImage src="/avatars/02.png" alt="Avatar" />
                      <AvatarFallback>기현</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">류기현</p>
                      <p className="text-sm text-muted-foreground">문과대학 중어중문학과</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus />
              <span>New Calendar</span>
            </SidebarMenuButton>
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
