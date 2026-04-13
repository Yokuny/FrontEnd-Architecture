import { useState } from 'react';
import { toast } from 'sonner';
import { useOdontogramMutations } from '@/query/odontogram';

export function useOdontogramStatusForm(id: string, initialStatus: boolean) {
  const [selectedStatus, setSelectedStatus] = useState<boolean>(initialStatus);
  const { updateStatus } = useOdontogramMutations();

  const handleSave = async () => {
    try {
      await updateStatus.mutateAsync({ id, finished: selectedStatus });
      toast.success('Status atualizado com sucesso');
    } catch {
      // error handled globally via MutationCache.onError
    }
  };

  return {
    selectedStatus,
    setSelectedStatus,
    handleSave,
    isPending: updateStatus.isPending,
  };
}
