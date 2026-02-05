import { DollarSign, Receipt } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/formatDate';
import type { BmsData, BmsExpense } from '../@interface/os.schema';

interface OsExpensesProps {
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

export function OsExpenses({ bms }: OsExpensesProps) {
  const { t } = useTranslation();

  const hasMainExpenses = bms?.main_expenses && bms.main_expenses.length > 0;
  const hasOtherExpenses = bms?.other_expenses && bms.other_expenses.length > 0;

  if (!hasMainExpenses && !hasOtherExpenses) return null;

  return (
    <div className="space-y-6">
      {/* Main Expenses */}
      {hasMainExpenses && (
        <div className="overflow-hidden rounded-lg border bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-60">
                  <div className="flex items-center gap-1">
                    <ItemMedia variant="icon">
                      <Receipt className="size-4" />
                    </ItemMedia>
                    <ItemTitle>{t('fas.expenses')}</ItemTitle>
                  </div>
                </TableHead>
                <TableHead>
                  <ItemDescription className="font-medium uppercase">{t('date')}</ItemDescription>
                </TableHead>
                <TableHead>
                  <ItemDescription className="font-medium uppercase">{t('fas.expense.start.time')}</ItemDescription>
                </TableHead>
                <TableHead>
                  <ItemDescription className="font-medium uppercase">{t('fas.expense.end.time')}</ItemDescription>
                </TableHead>
                <TableHead>
                  <ItemDescription className="font-medium uppercase">{t('fas.expense')}</ItemDescription>
                </TableHead>
                <TableHead>
                  <ItemDescription className="font-medium uppercase">{t('fas.expense.collaborator.name')}</ItemDescription>
                </TableHead>
                <TableHead>
                  <ItemDescription className="font-medium uppercase">{t('role')}</ItemDescription>
                </TableHead>
                <TableHead>
                  <ItemDescription className="font-medium uppercase">{t('fas.expense.unit')}</ItemDescription>
                </TableHead>
                <TableHead>
                  <ItemDescription className="font-medium uppercase">{t('fas.expense.value')}</ItemDescription>
                </TableHead>
                <TableHead>
                  <ItemDescription className="font-medium uppercase">{t('fas.expense.amount')}</ItemDescription>
                </TableHead>
                <TableHead className="text-right">
                  <ItemDescription className="font-medium uppercase">{t('total')}</ItemDescription>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bms?.main_expenses?.map((expense, i) => (
                <TableRow key={expense._id || i}>
                  {i === 0 && <TableCell className="bg-muted/50" rowSpan={Array.isArray(bms?.main_expenses) ? bms?.main_expenses.length + 1 : 1} />}
                  <TableCell>
                    <ItemTitle>{expense.date ? formatDate(expense.date, 'dd MMM yyyy') : '-'}</ItemTitle>
                  </TableCell>
                  <TableCell>
                    <ItemTitle>{expense.startTime ? formatDate(expense.startTime, 'HH:mm') : '-'}</ItemTitle>
                  </TableCell>
                  <TableCell>
                    <ItemTitle>{expense.endTime ? formatDate(expense.endTime, 'HH:mm') : '-'}</ItemTitle>
                  </TableCell>
                  <TableCell>
                    <ItemTitle>{expense.expense || '-'}</ItemTitle>
                  </TableCell>
                  <TableCell>
                    <ItemTitle>{expense.collaborator_name || '-'}</ItemTitle>
                  </TableCell>
                  <TableCell>
                    <ItemTitle>{expense.role || '-'}</ItemTitle>
                  </TableCell>
                  <TableCell>
                    <ItemTitle>{expense.unit || '-'}</ItemTitle>
                  </TableCell>
                  <TableCell>
                    <ItemTitle>{formatCurrency(expense.value)}</ItemTitle>
                  </TableCell>
                  <TableCell>
                    <ItemTitle>{expense.amount || '-'}</ItemTitle>
                  </TableCell>
                  <TableCell className="text-right">
                    <ItemTitle className="font-bold">{expense.value && expense.amount ? formatCurrency(expense.value * expense.amount) : '-'}</ItemTitle>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/30">
                <TableCell colSpan={9} className="text-right">
                  <ItemDescription className="font-bold uppercase">{t('fas.expenses.total')}</ItemDescription>
                </TableCell>
                <TableCell className="text-right">
                  <ItemTitle className="font-bold text-lg text-primary">{formatCurrency(getExpensesTotal(bms?.main_expenses))}</ItemTitle>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {/* Other Expenses */}
      {hasOtherExpenses && (
        <div className="overflow-hidden rounded-lg border bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-60">
                  <div className="flex items-center gap-1">
                    <ItemMedia variant="icon">
                      <DollarSign className="size-4" />
                    </ItemMedia>
                    <ItemTitle>{t('fas.other.expenses')}</ItemTitle>
                  </div>
                </TableHead>
                <TableHead>
                  <ItemDescription className="font-medium uppercase">{t('date')}</ItemDescription>
                </TableHead>
                <TableHead>
                  <ItemDescription className="font-medium uppercase">{t('fas.expense.start.time')}</ItemDescription>
                </TableHead>
                <TableHead>
                  <ItemDescription className="font-medium uppercase">{t('fas.expense.end.time')}</ItemDescription>
                </TableHead>
                <TableHead>
                  <ItemDescription className="font-medium uppercase">{t('fas.expense')}</ItemDescription>
                </TableHead>
                <TableHead>
                  <ItemDescription className="font-medium uppercase">{t('fas.expense.collaborator.name')}</ItemDescription>
                </TableHead>
                <TableHead>
                  <ItemDescription className="font-medium uppercase">{t('additional.info')}</ItemDescription>
                </TableHead>
                <TableHead>
                  <ItemDescription className="font-medium uppercase">{t('fas.expense.unit')}</ItemDescription>
                </TableHead>
                <TableHead>
                  <ItemDescription className="font-medium uppercase">{t('fas.expense.value')}</ItemDescription>
                </TableHead>
                <TableHead>
                  <ItemDescription className="font-medium uppercase">{t('fas.expense.amount')}</ItemDescription>
                </TableHead>
                <TableHead className="text-right">
                  <ItemDescription className="font-medium uppercase">{t('total')}</ItemDescription>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bms?.other_expenses?.map((expense, i) => (
                <TableRow key={expense._id || i}>
                  {i === 0 && <TableCell className="bg-muted/50" rowSpan={Array.isArray(bms?.other_expenses) ? bms?.other_expenses.length + 1 : 1} />}
                  <TableCell>
                    <ItemTitle>{expense.date ? formatDate(expense.date, 'dd MMM yyyy') : '-'}</ItemTitle>
                  </TableCell>
                  <TableCell>
                    <ItemTitle>{expense.startTime ? formatDate(expense.startTime, 'HH:mm') : '-'}</ItemTitle>
                  </TableCell>
                  <TableCell>
                    <ItemTitle>{expense.endTime ? formatDate(expense.endTime, 'HH:mm') : '-'}</ItemTitle>
                  </TableCell>
                  <TableCell>
                    <ItemTitle>{expense.expense || '-'}</ItemTitle>
                  </TableCell>
                  <TableCell>
                    <ItemTitle>{expense.collaborator_name || '-'}</ItemTitle>
                  </TableCell>
                  <TableCell>
                    <ItemTitle>{expense.additional_info || '-'}</ItemTitle>
                  </TableCell>
                  <TableCell>
                    <ItemTitle>{expense.unit || '-'}</ItemTitle>
                  </TableCell>
                  <TableCell>
                    <ItemTitle>{formatCurrency(expense.value)}</ItemTitle>
                  </TableCell>
                  <TableCell>
                    <ItemTitle>{expense.amount || '-'}</ItemTitle>
                  </TableCell>
                  <TableCell className="text-right">
                    <ItemTitle className="font-bold">{formatCurrency(expense.total)}</ItemTitle>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/30">
                <TableCell colSpan={9} className="text-right">
                  <ItemDescription className="font-bold uppercase">{t('fas.other.expenses.total')}</ItemDescription>
                </TableCell>
                <TableCell className="text-right">
                  <ItemTitle className="font-bold text-lg text-primary">{formatCurrency(getExpensesTotal(bms?.other_expenses))}</ItemTitle>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {/* Grand Total */}
      {hasMainExpenses && hasOtherExpenses && (
        <div className="mt-4 flex justify-end">
          <div className="overflow-hidden rounded-lg border bg-card px-8 py-4 text-right">
            <ItemDescription className="font-bold text-xs uppercase tracking-wider">{t('total.expenses')}</ItemDescription>
            <ItemTitle className="font-bold text-3xl text-primary">{formatCurrency(getExpensesTotal(bms?.main_expenses) + getExpensesTotal(bms?.other_expenses))}</ItemTitle>
          </div>
        </div>
      )}
    </div>
  );
}
