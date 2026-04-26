import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useOdontogramMutations } from '@/query/odontogram';

export function useOdontogramStatusForm(id: string, initialStatus: boolean) {
  const [selectedStatus, setSelectedStatus] = useState<boolean>(initialStatus);
  const { updateStatus } = useOdontogramMutations();

  useEffect(() => {
    setSelectedStatus(initialStatus);
  }, [initialStatus]);

  const handleSave = async () => {
    try {
      const result = await updateStatus.mutateAsync({ id, finished: selectedStatus });
      toast.success(result.message);
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
