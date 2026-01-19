import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useGoalsApi } from '@/hooks/use-goals-api';
import { type GoalFormData, type GoalMonth, type GoalRow, goalSchema } from '../@interface/goals.schema';

export function useGoalForm(initialData?: any) {
  const navigate = useNavigate();
  const { createGoal, updateGoal } = useGoalsApi();

  const transformFromApi = (data: any): Partial<GoalFormData> => {
    if (!data) return {};

    const rowsMap = new Map<string, GoalRow>();

    data.goals?.forEach((goal: any) => {
      const key = goal.isFleet ? 'fleet' : goal.idMachine || 'unknown';
      if (!rowsMap.has(key)) {
        rowsMap.set(key, {
          idMachine: goal.idMachine,
          machineName: goal.machine?.name,
          isFleet: goal.isFleet,
          months: Array(13)
            .fill(null)
            .map((_, i) => ({
              date: i === 12 ? null : new Date(new Date().getUTCFullYear(), i, 1).toISOString(),
              value: 0,
            })),
        });
      }

      const row = rowsMap.get(key);
      if (row) {
        if (goal.date === null) {
          row.months[12].value = goal.value;
          row.months[12].date = null;
        } else {
          const monthIndex = new Date(goal.date).getUTCMonth();
          if (monthIndex >= 0 && monthIndex < 12) {
            row.months[monthIndex].value = goal.value;
            row.months[monthIndex].date = goal.date;
          }
        }
      }
    });

    return {
      id: data.id,
      idEnterprise: data.idEnterprise,
      name: data.name,
      type: data.type,
      year: data.year,
      rows: Array.from(rowsMap.values()),
    };
  };

  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: initialData?.id
      ? transformFromApi(initialData)
      : {
          idEnterprise: initialData?.idEnterprise || '',
          name: '',
          type: 'DOWNTIME',
          year: new Date().getFullYear(),
          rows: [],
        },
  });

  const onSubmit = form.handleSubmit(async (values: GoalFormData) => {
    try {
      const flatGoals = (values.rows || []).flatMap((row: GoalRow) =>
        (row.months || [])
          .filter((m: GoalMonth) => m.value > 0)
          .map((m: GoalMonth) => ({
            idMachine: row.idMachine,
            isFleet: row.isFleet,
            date: m.date,
            value: m.value,
          })),
      );

      const payload = {
        id: values.id,
        idEnterprise: values.idEnterprise,
        name: values.name,
        type: values.type,
        year: values.year,
        goals: flatGoals,
      };

      if (values.id) {
        await updateGoal.mutateAsync({ id: values.id, data: payload as any });
      } else {
        await createGoal.mutateAsync(payload as any);
      }
      toast.success('Salvo com sucesso');
      navigate({ to: '/operation/goals' });
    } catch (error) {
      toast.error('Erro ao salvar');
    }
  });

  return {
    form,
    onSubmit,
    isPending: createGoal.isPending || updateGoal.isPending,
  };
}
