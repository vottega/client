import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ParticipantResponseDTO } from "@/lib/api/types/room-service.dto";
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
import { ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";

export function OnlineOffline({ participants }: { participants: ParticipantResponseDTO[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<ParticipantResponseDTO>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              이름
              <ArrowUpDown />
            </Button>
          );
        },

        cell: ({ row }) => (
          <div className="flex items-center gap-2 font-medium">
            {row.getValue("name")}
            {row.getValue("isEntered") ? (
              <span className={`flex h-2 w-2 rounded-full bg-sky-500`} />
            ) : (
              <span className={`flex h-2 w-2 rounded-full bg-neutral-500`} />
            )}
          </div>
        ),
      },
      {
        accessorKey: "position",
        header: "소속",
        cell: ({ row }) => <div>{row.getValue("position")}</div>,
      },
      {
        accessorKey: "participantRole",
        header: () => "역할",
        cell: ({ row }) => {
          return <div>{row.original.participantRole.role}</div>;
        },
      },
      {
        accessorKey: "isEntered",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="ml-auto flex"
          >
            상태
            <ArrowUpDown />
          </Button>
        ),
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2 justify-end font-medium">
              {row.getValue("isEntered") ? (
                <>
                  온라인 <span className={`flex h-2 w-2 rounded-full bg-sky-500`} />
                </>
              ) : (
                <>
                  오프라인 <span className={`flex h-2 w-2 rounded-full bg-neutral-500`} />
                </>
              )}
            </div>
          );
        },
      },
    ],
    [],
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
