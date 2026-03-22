import Delete from '@/components/icons/Delete.Icon';
import Dot from '@/components/icons/Dot.Icon';
import Edit from '@/components/icons/Edit.Icon';
import Eye from '@/components/icons/Eye.Icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { t } from '@/lib/helpers/translate';

type Status = 'completed' | 'pending' | 'processing' | 'cancelled';

interface Item {
  id: string;
  name: string;
  date: string;
  status: Status;
  amount: string;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  completed: {
    label: t('completed'),
    className: 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  },
  pending: {
    label: t('pending'),
    className: 'bg-amber-500/15 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  },
  processing: {
    label: t('processing'),
    className: 'bg-blue-500/15 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  },
  cancelled: {
    label: t('cancelled'),
    className: 'bg-rose-500/15 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
  },
};

function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

const data: Item[] = [
  { id: '1', name: 'Project Alpha', date: 'Jan 15, 2024', status: 'completed', amount: '$2,500' },
  { id: '2', name: 'Website Redesign', date: 'Feb 3, 2024', status: 'processing', amount: '$4,200' },
  { id: '3', name: 'Mobile App MVP', date: 'Feb 18, 2024', status: 'pending', amount: '$8,750' },
  { id: '4', name: 'Brand Identity', date: 'Mar 5, 2024', status: 'completed', amount: '$1,800' },
  { id: '5', name: 'Marketing Campaign', date: 'Mar 22, 2024', status: 'cancelled', amount: '$3,400' },
  { id: '6', name: 'Analytics Dashboard', date: 'Apr 8, 2024', status: 'processing', amount: '$5,600' },
  { id: '7', name: 'E-commerce Platform', date: 'Apr 25, 2024', status: 'pending', amount: '$12,000' },
  { id: '8', name: 'API Integration', date: 'May 10, 2024', status: 'completed', amount: '$3,200' },
];

const columns: DataTableColumn<Item>[] = [
  {
    key: 'id' as const, // Placeholder key for checkbox
    header: <Checkbox aria-label="Select all" />,
    sortable: false,
    render: () => <Checkbox aria-label="Select row" />,
  },
  {
    key: 'name',
    header: t('name'),
    sortable: true,
    render: (value) => <span className="font-medium">{value}</span>,
  },
  {
    key: 'date',
    header: t('date'),
    sortable: true,
  },
  {
    key: 'status',
    header: t('status'),
    sortable: true,
    render: (value) => <StatusBadge status={value} />,
  },
  {
    key: 'amount',
    header: <div className="text-right">{t('amount')}</div>,
    sortable: true,
    render: (value) => <div className="text-right font-medium">{value}</div>,
  },
  {
    key: 'id', // Reusing ID key for actions
    header: '',
    sortable: false,
    render: () => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="h-8 w-8">
              <Dot className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 size-4" />
              {t('view.details')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 size-4" />
              {t('edit')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Delete className="mr-2 size-4" />
              {t('delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];

export default function DefaultTable() {
  return (
    <div className="w-full max-w-4xl space-y-4">
      <DataTable data={data} columns={columns} itemsPerPage={5} searchable searchPlaceholder={t('search')} />
    </div>
  );
}
