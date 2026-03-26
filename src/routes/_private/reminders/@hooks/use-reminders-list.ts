import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { toast } from 'sonner';
import { t } from '@/lib/helpers/translate';
import { useCheckReminders, useRemindersQuery } from '@/query/reminders';
import { reminderColumns } from '../@utils/columns';
import { endOfDay, startOfDay } from '../@utils/date';

export function useRemindersList() {
  const navigate = useNavigate();
  const { showAll, page, size } = useSearch({ from: '/_private/reminders/' });
  const checkReminders = useCheckReminders();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfDay(today),
    to: endOfDay(today),
  });

  const { data: reminders, isLoading } = useRemindersQuery({
    startDate: dateRange?.from ? dateRange.from.toISOString() : startOfDay(today).toISOString(),
    endDate: dateRange?.to ? dateRange.to.toISOString() : endOfDay(today).toISOString(),
    status: showAll ? undefined : 'pending',
  });

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked && reminders) {
        setSelectedIds(reminders.map((r) => r._id));
      } else {
        setSelectedIds([]);
      }
    },
    [reminders],
  );

  const handleSelectOne = useCallback((id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) return [...prev, id];
      return prev.filter((selectedId) => selectedId !== id);
    });
  }, []);

  const handleBulkCheck = async () => {
    if (selectedIds.length === 0) {
      toast.error('Selecione pelo menos um lembrete');
      return;
    }

    try {
      await checkReminders.mutateAsync({ ids: selectedIds, status: 'done' });
      const label = selectedIds.length > 1 ? t('reminder.completed.plural') : t('reminder.completed.singular');
      toast.success(`${selectedIds.length} ${label}`);
      setSelectedIds([]);
    } catch (e: unknown) {
      toast.error((e as Error).message || t('error.completing.reminders'));
    }
  };

  const handlePageChange = useCallback((newPage: number) => navigate({ search: (prev: any) => ({ ...prev, page: newPage }), replace: true }), [navigate]);

  const handlePageSizeChange = useCallback((newSize: number) => navigate({ search: (prev: any) => ({ ...prev, size: newSize, page: 1 }), replace: true }), [navigate]);

  const allSelected = !!reminders?.length && selectedIds.length === reminders.length;
  const someSelected = selectedIds.length > 0 && (!reminders || selectedIds.length < reminders.length);

  const columns = useMemo(
    () => reminderColumns({ selectedIds, allSelected, someSelected, handleSelectAll, checkReminders }),
    [selectedIds, allSelected, someSelected, handleSelectAll, checkReminders],
  );

  return {
    reminders,
    isLoading,
    showAll,
    page,
    size,
    dateRange,
    setDateRange,
    selectedIds,
    setSelectedIds,
    handleSelectAll,
    handleSelectOne,
    handleBulkCheck,
    handlePageChange,
    handlePageSizeChange,
    allSelected,
    someSelected,
    columns,
    checkReminders,
    navigate,
  };
}
