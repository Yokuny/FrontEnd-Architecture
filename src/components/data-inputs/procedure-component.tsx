import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';
import ProceduresSheet from '@/components/data-inputs/procedures-sheet';
import Add from '@/components/icons/Add.Icon';
import Delete from '@/components/icons/Delete.Icon';
import { Button } from '@/components/ui/button';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';

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

  const columns: DataTableColumn<{ id: string; index: number }>[] = [
    {
      key: 'id' as any,
      header: '',
      render: (_, row) => {
        const proc = procedures[row.index];
        return proc?.procedure ? <span>{proc.procedure}</span> : <ProceduresSheet handleProcedure={(p) => handleProcedure(p, row.index)} disabled={disabled} />;
      },
    },
    {
      key: 'id' as any,
      header: '',
      render: (_, row) => {
        const proc = procedures[row.index];
        if (!proc?.procedure) return null;
        return <span className="tabular-nums">{proc.price && proc.price > 0 ? currencyFormat(proc.price) : <span className="text-muted-foreground">Não definido</span>}</span>;
      },
    },
    {
      key: 'id' as any,
      header: '',
      render: (_, row) => {
        const proc = procedures[row.index];
        if (!proc?.procedure) return null;
        return <span>{statusDictionary(proc.status)}</span>;
      },
    },
    {
      key: 'id' as any,
      header: '',
      render: (_, row) => {
        const proc = procedures[row.index];
        const isLastItem = row.index === procedures.length - 1;
        return proc?.procedure ? (
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => removeProcedure(row.index)} disabled={disabled}>
              <Delete className="size-4" />
            </Button>
            {isLastItem && (
              <Button type="button" variant="default" size="sm" className="whitespace-nowrap" onClick={addProcedure} disabled={disabled}>
                <Add className="size-4 stroke-3 md:mr-2" />
                <p className="hidden md:block">Adicionar</p>
              </Button>
            )}
          </div>
        ) : null;
      },
    },
  ];

  const data = fields.map((f, i) => ({ id: f.id, index: i }));

  return (
    <div className="w-full">
      <DataTable data={data} columns={columns} searchable={false} showPagination={false} bordered={false} hideHeader compact />
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
