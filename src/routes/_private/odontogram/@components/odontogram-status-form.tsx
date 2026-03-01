import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOdontogramMutations } from '@/query/odontogram';

export function OdontogramStatusForm({ id, initialStatus }: { id: string; initialStatus: boolean }) {
  const [selectedStatus, setSelectedStatus] = useState<boolean>(initialStatus);
  const { updateStatus } = useOdontogramMutations();

  const handleStatusChange = async () => {
    try {
      await updateStatus.mutateAsync({ id, finished: selectedStatus });
      toast.success('Status atualizado com sucesso');
    } catch (e: any) {
      toast.error(e.message || 'Erro ao atualizar status');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <CardContent className="w-full max-w-6xl space-y-4 rounded-md border p-6">
        <h3 className="font-medium text-lg">Status do Odontograma</h3>
        <div className="flex max-w-xs flex-col gap-2">
          <Select value={String(selectedStatus)} onValueChange={(value: string) => setSelectedStatus(value === 'true')} disabled={updateStatus.isPending}>
            <SelectTrigger size="sm" className="w-full">
              <SelectValue>{selectedStatus ? 'Finalizado' : 'Em andamento'}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Finalizado</SelectItem>
              <SelectItem value="false">Em andamento</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="button" onClick={handleStatusChange} disabled={updateStatus.isPending} className="mt-4">
          {updateStatus.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          Salvar
        </Button>
      </CardContent>
    </div>
  );
}
