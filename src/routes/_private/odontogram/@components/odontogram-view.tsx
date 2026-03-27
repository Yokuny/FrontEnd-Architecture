import DefaultLoading from '@/components/default-loading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { capitalizeString } from '@/lib/helpers/formatter.helper';
import { useOdontogramDetailQuery } from '@/query/odontogram';

type OdontogramViewProps = {
  id: string;
  isOpen?: boolean;
};

export function OdontogramView({ id, isOpen = true }: OdontogramViewProps) {
  const { data: odontogram, isLoading } = useOdontogramDetailQuery(isOpen ? id : undefined);

  if (isLoading || !odontogram) return <DefaultLoading />;

  const teethWithProcedures = odontogram.teeth?.filter((tooth) => {
    return tooth.faces && Object.values(tooth.faces).some(Boolean);
  });

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-secondary">
          <TableHead className="h-7 w-[80px] px-4 py-1.5 font-medium text-foreground text-xs">Dente</TableHead>
          <TableHead className="h-7 px-4 py-1.5 font-medium text-foreground text-xs">Face</TableHead>
          <TableHead className="h-7 px-4 py-1.5 font-medium text-foreground text-xs">Procedimento</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teethWithProcedures?.length ? (
          teethWithProcedures.flatMap((tooth) =>
            Object.entries(tooth.faces)
              .filter(([, value]) => Boolean(value))
              .map(([face, procedure]) => (
                <TableRow key={`${tooth.number}-${face}`} className="border-b-0">
                  <TableCell className="px-4 py-2 font-mono font-semibold text-xs tabular-nums">{tooth.number}</TableCell>
                  <TableCell className="px-4 py-2 text-muted-foreground text-xs">{capitalizeString(face)}</TableCell>
                  <TableCell className="px-4 py-2 font-medium text-xs">{procedure as string}</TableCell>
                </TableRow>
              )),
          )
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="px-4 py-4 text-center text-muted-foreground text-xs">
              Nenhum procedimento registrado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
