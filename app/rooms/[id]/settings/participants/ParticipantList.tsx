"use client";

import { Invitation, InvitationForm } from "@/app/rooms/[id]/settings/participants/Invitation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPhone } from "@/lib/utils";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Hand, MoreHorizontal } from "lucide-react";
import { Dispatch, SetStateAction, useMemo, useState } from "react";

export type Participant = Invitation & {
  role: string | null;
};

const data: Participant[] = [
  {
    name: "류기현",
    phoneNumber: "01012345678",
    position: "중문 정",
    role: "의장",
  },
  {
    name: "윤민균",
    phoneNumber: "01012345679",
    position: "인지융 부",
    role: "서기",
  },
  {
    name: "류기현",
    phoneNumber: "01012345678",
    position: "중문 정",
    role: "의장",
  },
  {
    name: "윤민균",
    phoneNumber: "01012345679",
    position: "인지융 부",
    role: "서기",
  },
  {
    name: "류기현",
    phoneNumber: "01012345678",
    position: "중문 정",
    role: "의장",
  },
  {
    name: "윤민균",
    phoneNumber: "01012345679",
    position: "인지융 부",
    role: "서기",
  },
  {
    name: "류기현",
    phoneNumber: "01012345678",
    position: "중문 정",
    role: "의장",
  },
  {
    name: "윤민균",
    phoneNumber: "01012345679",
    position: "인지융 부",
    role: "서기",
  },
  {
    name: "류기현",
    phoneNumber: "01012345678",
    position: "중문 정",
    role: "의장",
  },
  {
    name: "윤민균",
    phoneNumber: "01012345679",
    position: "인지융 부",
    role: "서기",
  },
  {
    name: "류기현",
    phoneNumber: "01012345678",
    position: "중문 정",
    role: "의장",
  },
  {
    name: "윤민균",
    phoneNumber: "01012345679",
    position: "인지융 부",
    role: "서기",
  },
  {
    name: "류기현",
    phoneNumber: "01012345678",
    position: "중문 정",
    role: "의장",
  },
  {
    name: "윤민균",
    phoneNumber: "01012345679",
    position: "인지융 부",
    role: "서기",
  },
  {
    name: "류기현",
    phoneNumber: "01012345678",
    position: "중문 정",
    role: "의장",
  },
  {
    name: "윤민균",
    phoneNumber: "01012345679",
    position: "인지융 부",
    role: "서기",
  },
];

const translation = {
  name: "이름",
  phoneNumber: "전화번호",
  position: "소속",
  role: "역할",
};

// TODO: 추가 시 페이지네이션 유지, 스크롤 시 추가 폼 sticky, 추가 시 새롭게 추가된 요소로 scrollIntoView
export function ParticipantList() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [participants, setParticipants] = useState<Participant[]>(data);

  const columns: ColumnDef<Participant>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              {translation.name}
              <ArrowUpDown />
            </Button>
          );
        },

        cell: ({ row }) => <div>{row.getValue("name")}</div>,
      },
      {
        accessorKey: "position",
        header: translation.position,
        cell: ({ row }) => <div>{row.getValue("position")}</div>,
      },
      {
        accessorKey: "phoneNumber",
        header: translation.phoneNumber,
        cell: ({ row }) => <div>{formatPhone(row.getValue("phoneNumber"))}</div>,
      },
      {
        accessorKey: "role",
        header: () => <div className="text-right">{translation.role}</div>,
        cell: ({ row }) => {
          return <div className="text-right font-medium">{row.getValue("role")}</div>;
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const participant = row.original;
          return <MoreButton participant={participant} setParticipants={setParticipants} />;
        },
      },
    ],
    [setParticipants],
  );

  const table = useReactTable({
    data: participants,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="이름으로 검색"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <div className="ml-auto flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                정보 표시 <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {translation[column.id as keyof typeof translation]}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover>
            <PopoverTrigger asChild>
              <Button>참여자 추가</Button>
            </PopoverTrigger>
            <PopoverContent className="w-[23rem]">
              <InvitationForm participants={participants} setParticipants={setParticipants} />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  검색 결과가 없어요.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end gap-4 space-x-2 py-4">
        <span className="text-sm text-muted-foreground">
          <span className="font-semibold text-primary">
            {Math.min(10 * (table.getState().pagination.pageIndex + 1), participants.length)}
          </span>{" "}
          / {participants.length}명
        </span>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            이전
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MoreButton({
  participant,
  setParticipants,
}: {
  participant: Participant;
  setParticipants: Dispatch<SetStateAction<Participant[]>>;
}) {
  const [dialogMenu, setDialogMenu] = useState<"none" | "kickParticipant">("none");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const handleConfirmKick = () => {
    setParticipants((prev) => prev.filter((p) => !Object.is(p, participant)));
  };

  return (
    <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 mx-auto">
            <span className="sr-only">메뉴 열기</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => {
              setDialogMenu("kickParticipant");
              setDropdownOpen(false);
              setAlertOpen(true);
            }}
          >
            <Hand size={16} className="-rotate-45 mr-2" />
            멤버 내보내기
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {dialogMenu === "kickParticipant" && (
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              <span className="text-primary">{participant.name}</span>님을 정말 내보내시겠어요?
            </AlertDialogTitle>
            <AlertDialogDescription>한번 내보내면 되돌릴 수 없어요.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlertOpen(false)}>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmKick}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
}
