import { useTranslation } from 'react-i18next';
import { ItemDescription } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/formatDate';
import type { BmsData, BmsExpense } from '../@interface/os.schema';

interface OsExpensesTableProps {
  bms?: BmsData;
}

// Helper to format currency
const formatCurrency = (value?: number): string => {
  if (value === undefined || value === null) return '-';
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
};

// Helper to calculate total
const getExpensesTotal = (expenses?: BmsExpense[]): number => {
  if (!expenses) return 0;
  return expenses.reduce((acc, expense) => {
    const total = expense.total || (expense.value && expense.amount ? expense.value * expense.amount : 0);
    return acc + total;
  }, 0);
};

export function OsExpensesTable({ bms }: OsExpensesTableProps) {
  const { t } = useTranslation();

  const hasMainExpenses = bms?.main_expenses && bms.main_expenses.length > 0;
  const hasOtherExpenses = bms?.other_expenses && bms.other_expenses.length > 0;

  if (!hasMainExpenses && !hasOtherExpenses) return null;

  return (
    <div className="space-y-6">
      {/* Main Expenses */}
      {hasMainExpenses && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ItemDescription className="text-muted-foreground">BMS</ItemDescription>
            <ItemDescription className="font-semibold">{t('fas.expenses')}</ItemDescription>
          </div>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">{t('date')}</TableHead>
                  <TableHead className="text-center">{t('fas.expense.start.time')}</TableHead>
                  <TableHead className="text-center">{t('fas.expense.end.time')}</TableHead>
                  <TableHead className="text-center">{t('fas.expense')}</TableHead>
                  <TableHead className="text-center">{t('fas.expense.collaborator.name')}</TableHead>
                  <TableHead className="text-center">{t('role')}</TableHead>
                  <TableHead className="text-center">{t('fas.expense.unit')}</TableHead>
                  <TableHead className="text-center">{t('fas.expense.value')}</TableHead>
                  <TableHead className="text-center">{t('fas.expense.amount')}</TableHead>
                  <TableHead className="text-center">{t('total')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bms?.main_expenses?.map((expense, i) => (
                  <TableRow key={expense._id || i}>
                    <TableCell className="text-center">{expense.date ? formatDate(expense.date, 'dd MMM yyyy') : '-'}</TableCell>
                    <TableCell className="text-center">{expense.startTime ? formatDate(expense.startTime, 'HH:mm') : '-'}</TableCell>
                    <TableCell className="text-center">{expense.endTime ? formatDate(expense.endTime, 'HH:mm') : '-'}</TableCell>
                    <TableCell className="text-center">{expense.expense || '-'}</TableCell>
                    <TableCell className="text-center">{expense.collaborator_name || '-'}</TableCell>
                    <TableCell className="text-center">{expense.role || '-'}</TableCell>
                    <TableCell className="text-center">{expense.unit || '-'}</TableCell>
                    <TableCell className="text-center">{formatCurrency(expense.value)}</TableCell>
                    <TableCell className="text-center">{expense.amount || '-'}</TableCell>
                    <TableCell className="text-center font-medium">{expense.value && expense.amount ? formatCurrency(expense.value * expense.amount) : '-'}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={9} className="text-right font-semibold">
                    {t('fas.expenses.total')}
                  </TableCell>
                  <TableCell className="text-center font-bold">{formatCurrency(getExpensesTotal(bms?.main_expenses))}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Other Expenses */}
      {hasOtherExpenses && (
        <div className="space-y-2">
          <ItemDescription className="font-semibold">{t('fas.other.expenses')}</ItemDescription>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">{t('date')}</TableHead>
                  <TableHead className="text-center">{t('fas.expense.start.time')}</TableHead>
                  <TableHead className="text-center">{t('fas.expense.end.time')}</TableHead>
                  <TableHead className="text-center">{t('fas.expense')}</TableHead>
                  <TableHead className="text-center">{t('fas.expense.collaborator.name')}</TableHead>
                  <TableHead className="text-center">{t('additional.info')}</TableHead>
                  <TableHead className="text-center">{t('fas.expense.unit')}</TableHead>
                  <TableHead className="text-center">{t('fas.expense.value')}</TableHead>
                  <TableHead className="text-center">{t('fas.expense.amount')}</TableHead>
                  <TableHead className="text-center">{t('total')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bms?.other_expenses?.map((expense, i) => (
                  <TableRow key={expense._id || i}>
                    <TableCell className="text-center">{expense.date ? formatDate(expense.date, 'dd MMM yyyy') : '-'}</TableCell>
                    <TableCell className="text-center">{expense.startTime ? formatDate(expense.startTime, 'HH:mm') : '-'}</TableCell>
                    <TableCell className="text-center">{expense.endTime ? formatDate(expense.endTime, 'HH:mm') : '-'}</TableCell>
                    <TableCell className="text-center">{expense.expense || '-'}</TableCell>
                    <TableCell className="text-center">{expense.collaborator_name || '-'}</TableCell>
                    <TableCell className="text-center">{expense.additional_info || '-'}</TableCell>
                    <TableCell className="text-center">{expense.unit || '-'}</TableCell>
                    <TableCell className="text-center">{formatCurrency(expense.value)}</TableCell>
                    <TableCell className="text-center">{expense.amount || '-'}</TableCell>
                    <TableCell className="text-center font-medium">{formatCurrency(expense.total)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={9} className="text-right font-semibold">
                    {t('fas.other.expenses.total')}
                  </TableCell>
                  <TableCell className="text-center font-bold">{formatCurrency(getExpensesTotal(bms?.other_expenses))}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Grand Total */}
      {hasMainExpenses && hasOtherExpenses && (
        <div className="flex justify-end">
          <div className="rounded-lg bg-muted px-4 py-2">
            <span className="font-semibold">{t('total.expenses')}: </span>
            <span className="font-bold">{formatCurrency(getExpensesTotal(bms?.main_expenses) + getExpensesTotal(bms?.other_expenses))}</span>
          </div>
        </div>
      )}
    </div>
  );
}
