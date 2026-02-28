import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';
import ProceduresSheet from '@/components/data-inputs/procedures-sheet';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

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

const ProcedureComponent = ({ form, disabled, currencyFormat, statusDictionary }: ProcedureComponentProps) => {
  const [procedures, setProcedures] = useState<NewProcedure[]>([
    {
      procedure: '',
      price: 0,
      status: 'pending',
    },
  ]);

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
    <div className="w-full overflow-x-auto">
      <Table>
        <TableBody>
          {fields.map((field, index) => {
            const procedure = procedures[index];
            return (
              <TableRow key={field.id} className="hover:bg-transparent">
                {procedure?.procedure ? (
                  <>
                    <TableCell className="p-1 pl-2 md:p-2">{procedure.procedure}</TableCell>
                    <TableCell className="p-1 tabular-nums md:p-2">
                      {procedure.price && procedure.price > 0 ? currencyFormat(procedure.price) : <span className="text-muted-foreground">Não definido</span>}
                    </TableCell>
                    <TableCell className="p-1 md:p-2">{statusDictionary(procedure.status)}</TableCell>
                  </>
                ) : (
                  <TableCell className="w-fit p-1 pl-2 md:p-2">
                    <ProceduresSheet handleProcedure={(proc) => handleProcedure(proc, index)} disabled={disabled} />
                  </TableCell>
                )}
                <TableCell className="w-fit p-1 md:p-2">
                  {procedure?.procedure && (
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => removeProcedure(index)} disabled={disabled}>
                        <Trash2 className="size-4" />
                      </Button>
                      {index === procedures.length - 1 && (
                        <Button type="button" variant="default" size="sm" className="whitespace-nowrap" onClick={addProcedure} disabled={disabled}>
                          <Plus className="size-4 stroke-3 md:mr-2" />
                          <p className="hidden md:block">Adicionar</p>
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
