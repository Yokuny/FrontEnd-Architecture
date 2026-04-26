import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';
import ProceduresSheet from '@/components/data-inputs/procedures-sheet';
import Add from '@/components/icons/Add.Icon';
import Delete from '@/components/icons/Delete.Icon';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

const ProcedureComponent = ({ form, disabled, currencyFormat, statusDictionary }: ProcedureComponentProps) => {
  const [procedures, setProcedures] = useState<NewProcedure[]>([{ procedure: '', price: 0, status: 'pending' }]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'procedures',
  });

  const addProcedure = () => {
    const procedureValue = form.getValues('procedures') || [];
    const lastProcedure = procedureValue.length > 0 ? procedureValue[procedureValue.length - 1] : null;
    if (lastProcedure && !lastProcedure.procedure) {
      toast.error('Não foi preenchido o nome do procedimento');
      return;
    }
    append({ procedure: '', price: 0, status: 'pending' });
    setProcedures((prev) => [...prev, { procedure: '', price: 0, status: 'pending' }]);
  };

  const removeProcedure = (index: number) => {
    const isLastItem = fields.length === 1;

    if (isLastItem) {
      form.setValue(`procedures.${index}` as const, { procedure: '', price: 0, status: 'pending' });
      setProcedures([{ procedure: '', price: 0, status: 'pending' }]);
    } else {
      remove(index);
      setProcedures((prev) => {
        const newProcedures = [...prev];
        newProcedures.splice(index, 1);
        return newProcedures;
      });
    }
  };

  const handleProcedure = (procedure: NewProcedure, index: number) => {
    const body = {
      procedure: procedure.procedure,
      price: Number(procedure.price),
      status: procedure.status,
      periodicity: procedure.periodicity,
    };
    form.setValue(`procedures.${index}` as const, body);
    setProcedures((prev) => {
      const newProcedures = [...prev];
      newProcedures[index] = procedure;
      return newProcedures;
    });
  };

  return (
    <div className="w-full">
      <Table>
        <TableBody className="[&_tr]:border-0">
          {fields.map((field, index) => {
            const proc = procedures[index];
            const isLastItem = index === fields.length - 1;

            return (
              <TableRow key={field.id} className="hover:bg-transparent">
                <TableCell className="pl-0">
                  {proc?.procedure ? <span className="text-sm">{proc.procedure}</span> : <ProceduresSheet handleProcedure={(p) => handleProcedure(p, index)} disabled={disabled} />}
                </TableCell>
                <TableCell>
                  {proc?.procedure && (
                    <span className="text-sm tabular-nums">
                      {proc.price && proc.price > 0 ? currencyFormat(proc.price) : <span className="text-muted-foreground">Não definido</span>}
                    </span>
                  )}
                </TableCell>
                <TableCell>{proc?.procedure && <span className="text-sm">{statusDictionary(proc.status)}</span>}</TableCell>
                <TableCell className="pr-0 text-right">
                  {proc?.procedure && (
                    <div className="flex items-center justify-end gap-2">
                      <Button type="button" variant="destructive" size="sm" onClick={() => removeProcedure(index)} disabled={disabled}>
                        <Delete className="size-4" />
                      </Button>
                      {isLastItem && (
                        <Button type="button" variant="default" size="sm" className="whitespace-nowrap" onClick={addProcedure} disabled={disabled}>
                          <Add className="size-4 stroke-3" />
                          <span className="hidden md:block">Adicionar</span>
                        </Button>
                      )}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProcedureComponent;

type NewProcedure = {
  procedure: string;
  price: number;
  status: string;
  periodicity?: string;
};

type ProcedureComponentProps = {
  form: any;
  disabled: boolean;
  currencyFormat: (value: number) => string;
  statusDictionary: (status: string) => string;
};
