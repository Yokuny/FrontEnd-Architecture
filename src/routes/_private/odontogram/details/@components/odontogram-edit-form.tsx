import DefaultFormLayout from '@/components/default-form-layout';
import { Field, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OdontogramEditFormProps {
  selectedStatus: boolean;
  onStatusChange: (status: boolean) => void;
  isPending: boolean;
}

export function OdontogramEditForm({ selectedStatus, onStatusChange, isPending }: OdontogramEditFormProps) {
  const sections = [
    {
      title: 'Status do Odontograma',
      description: 'Atualize o estado de conclusão do tratamento.',
      fields: [
        <Field key="status" className="w-full max-w-xs">
          <FieldLabel>Status</FieldLabel>
          <Select value={String(selectedStatus)} onValueChange={(value) => onStatusChange(value === 'true')} disabled={isPending}>
            <SelectTrigger className="w-full">
              <SelectValue>{selectedStatus ? 'Finalizado' : 'Em andamento'}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Finalizado</SelectItem>
              <SelectItem value="false">Em andamento</SelectItem>
            </SelectContent>
          </Select>
        </Field>,
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <DefaultFormLayout sections={sections} />
    </div>
  );
}
