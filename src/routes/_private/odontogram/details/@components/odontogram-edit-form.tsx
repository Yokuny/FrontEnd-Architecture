import DefaultFormLayout from '@/components/default-form-layout';
import Save from '@/components/icons/Save.Icon';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useOdontogramStatusForm } from '../@hooks/use-odontogram-status-form';

interface OdontogramEditFormProps {
  id: string;
  initialStatus: boolean;
}

export function OdontogramEditForm({ id, initialStatus }: OdontogramEditFormProps) {
  const { selectedStatus, setSelectedStatus, handleSave, isPending } = useOdontogramStatusForm(id, initialStatus);

  const sections = [
    {
      title: 'Status do Odontograma',
      description: 'Atualize o estado de conclusão do tratamento.',
      fields: [
        <Field key="status" className="w-full max-w-xs">
          <FieldLabel>Status</FieldLabel>
          <Select value={String(selectedStatus)} onValueChange={(value) => setSelectedStatus(value === 'true')} disabled={isPending}>
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
      <div className="px-6 pb-6 md:px-10">
        <Button type="button" onClick={handleSave} disabled={isPending}>
          {isPending ? <Spinner className="size-4" /> : <Save className="size-4" />}
          <span className="sr-only md:not-sr-only">Salvar</span>
        </Button>
      </div>
    </div>
  );
}
