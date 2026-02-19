import { Item, ItemContent, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ITableData } from '../@interface/ai-search.interface';

interface AITableProps {
  tableData: ITableData;
}

export function AITable({ tableData }: AITableProps) {
  if (!tableData.columns.length || !tableData.rows.length) return null;

  return (
    <Item variant="outline" className="flex-col items-stretch">
      {tableData.title && (
        <ItemHeader className="flex-col items-center justify-center">
          <ItemTitle className="text-xs">{tableData.title}</ItemTitle>
        </ItemHeader>
      )}
      <ItemContent>
        <Table>
          <TableHeader>
            <TableRow>
              {tableData.columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.rows.map((row, idx) => (
              <TableRow key={idx}>
                {tableData.columns.map((col) => (
                  <TableCell key={col.key}>{row[col.key] ?? '—'}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ItemContent>
    </Item>
  );
}
