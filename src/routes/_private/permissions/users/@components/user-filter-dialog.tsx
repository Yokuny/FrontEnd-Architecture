import { Filter } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RoleSelect, UserTypeSelect } from '@/components/selects';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useEnterpriseFilter } from '@/hooks/use-enterprise-filter';

interface UserFilterDialogProps {
  initialFilters: {
    idRole?: string[];
    idTypeUser?: string[];
  };
  onFilter: (filters: { idRole?: string[]; idTypeUser?: string[] }) => void;
  onClear: () => void;
}

export function UserFilterDialog({ initialFilters, onFilter, onClear }: UserFilterDialogProps) {
  const { t } = useTranslation();
  const idEnterprise = useEnterpriseFilter((state) => state.idEnterprise);
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState(initialFilters);

  const handleApply = () => {
    onFilter(filters);
    setOpen(false);
  };

  const handleClear = () => {
    onClear();
    setFilters({ idRole: [], idTypeUser: [] });
    setOpen(false);
  };

  const isFiltered = (filters.idRole?.length ?? 0) > 0 || (filters.idTypeUser?.length ?? 0) > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={isFiltered ? 'default' : 'outline'}>
          <Filter className="size-4" />
          {t('filter')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('filter')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RoleSelect isAll mode="multi" label={t('filter.by.role')} value={filters.idRole} onChange={(vals) => setFilters((prev) => ({ ...prev, idRole: vals as string[] }))} />
          <UserTypeSelect
            mode="multi"
            idEnterprise={idEnterprise}
            label={t('filter.by.type')}
            value={filters.idTypeUser}
            onChange={(vals) => setFilters((prev) => ({ ...prev, idTypeUser: vals as string[] }))}
          />
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="ghost" onClick={handleClear} className="text-destructive hover:text-destructive">
            {t('clear.filter')}
          </Button>
          <Button onClick={handleApply}>{t('filter')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
