import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, CloudUpload, Columns } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { TableBody, Table as TableBox, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { currencyFormat } from '@/lib/helpers/formatter.helper';
import type { ProcedureData } from '@/lib/interfaces';

const SortableComponent = ({ column, title }: { column: any; title: string }) => {
  return (
    <div className="flex w-full cursor-pointer items-center gap-1 hover:text-primary" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {title}
      <ArrowUpDown className="size-3" />
    </div>
  );
};

const EditableCell = ({ value, row, column, table }: { value: any; row: any; column: any; table: any }) => {
  const initialValue = value;
  const [editing, setEditing] = useState(false);
  const [cellValue, setCellValue] = useState(value ?? '');

  const onBlur = () => {
    setEditing(false);
    table.options.meta?.updateData(row.index, column.id, cellValue);
  };

  useEffect(() => {
    setCellValue(initialValue ?? '');
  }, [initialValue]);

  if (editing) {
    return <Input value={cellValue ?? ''} onChange={(e) => setCellValue(e.target.value)} onBlur={onBlur} autoFocus className="w-full min-w-[100px]" />;
  }

  return (
    <div className="w-full cursor-pointer py-1" onClick={() => setEditing(true)}>
      {column.id === 'procedure' || column.id === 'group' ? (
        cellValue
      ) : column.id === 'periodicity' ? (
        <span className="text-muted-foreground">{cellValue ? `${cellValue} dias` : '-'}</span>
      ) : (
        <Badge variant={column.id === 'costPrice' ? 'secondary' : column.id === 'suggestedPrice' ? 'outline' : 'default'} className="flex w-fit gap-2">
          {currencyFormat(cellValue)}
        </Badge>
      )}
    </div>
  );
};

const columns: ColumnDef<ProcedureData>[] = [
  {
    accessorKey: 'procedure',
    header: ({ column }) => <SortableComponent column={column} title="Procedimento" />,
    cell: ({ getValue, row, column, table }) => <EditableCell value={getValue()} row={row} column={column} table={table} />,
  },
  {
    accessorKey: 'group',
    header: ({ column }) => <SortableComponent column={column} title="Agrupador" />,
    cell: ({ getValue, row, column, table }) => <EditableCell value={getValue()} row={row} column={column} table={table} />,
  },
  {
    accessorKey: 'costPrice',
    header: ({ column }) => <SortableComponent column={column} title="Custo" />,
    cell: ({ getValue, row, column, table }) => <EditableCell value={getValue()} row={row} column={column} table={table} />,
  },
  {
    accessorKey: 'suggestedPrice',
    header: ({ column }) => <SortableComponent column={column} title="Sugerido" />,
    cell: ({ getValue, row, column, table }) => <EditableCell value={getValue()} row={row} column={column} table={table} />,
  },
  {
    accessorKey: 'savedPrice',
    header: ({ column }) => <SortableComponent column={column} title="Salvo" />,
    cell: ({ getValue, row, column, table }) => <EditableCell value={getValue()} row={row} column={column} table={table} />,
  },
  {
    accessorKey: 'periodicity',
    header: ({ column }) => <SortableComponent column={column} title="Periodicidade" />,
    cell: ({ getValue, row, column, table }) => <EditableCell value={getValue()} row={row} column={column} table={table} />,
  },
];

interface ProcedureTableProps {
  data: ProcedureData[];
  hasChanges?: boolean;
  saveProcedure?: () => void;
  onUpdate: (updatedData: ProcedureData[]) => void;
  isPending?: boolean;
}

export function SettingsProceduresTable({ data, hasChanges, saveProcedure, onUpdate, isPending }: ProcedureTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    initialState: {
      pagination: { pageSize: 20 },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    meta: {
      updateData: (rowIndex: number, columnId: string, value: any) => {
        const newData = [...tableData];
        const oldData = newData[rowIndex];
        if (!oldData) return;

        let processedValue = value;

        if (columnId.includes('Price') || columnId === 'periodicity') {
          if (value === '' || value === null || value === undefined) {
            processedValue = columnId === 'periodicity' ? undefined : 0;
          } else {
            const numValue = parseFloat(value);
            processedValue = Number.isNaN(numValue) ? (columnId === 'periodicity' ? undefined : 0) : numValue;
          }
        }

        const updatedData: ProcedureData = {
          ...oldData,
          [columnId]: processedValue,
        };

        newData[rowIndex] = updatedData;
        setTableData(newData);
        onUpdate(newData);
      },
    },
  });

  return (
    <div className="mt-4 w-full rounded-lg border">
      <div className="flex w-full items-center justify-between gap-3 bg-muted/30 p-4">
        <Input
          placeholder="Buscar procedimento..."
          value={(table.getColumn('procedure')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('procedure')?.setFilterValue(event.target.value)}
          className="w-full max-w-[240px] bg-background font-normal text-sm tracking-wide"
        />
        <div className="ml-auto flex gap-2">
          {hasChanges && tableData.length > 0 && (
            <Button onClick={saveProcedure} disabled={isPending} className="flex gap-2" size="sm">
              {isPending ? <Spinner className="size-4" /> : <CloudUpload className="size-4" />}
              <span className="hidden sm:inline">Atualizar Alterações</span>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns className="mr-2 hidden size-4 sm:inline" />
                Colunas
                <ChevronDown className="ml-2 size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                      {column.id === 'costPrice'
                        ? 'Custo'
                        : column.id === 'suggestedPrice'
                          ? 'Sugerido'
                          : column.id === 'savedPrice'
                            ? 'Salvo'
                            : column.id === 'periodicity'
                              ? 'Periodicidade'
                              : column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <TableBox>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="py-2 text-sm">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Sem resultado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableBox>

      <div className="flex items-center justify-between space-x-2 bg-muted/30 p-4">
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">Frequência:</span>
            <Select onValueChange={(value) => table.setPageSize(parseInt(value, 10))}>
              <SelectTrigger className="h-8 w-16 gap-2 bg-background">
                <SelectValue placeholder="20" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="hidden items-center gap-1 sm:flex">
            <span>
              Mostrando {table.getRowModel().rows.length} de {tableData.length}.
            </span>
            <span>
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount() || 1}.
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="flex h-8 items-center gap-1">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="flex h-8 items-center gap-1">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
