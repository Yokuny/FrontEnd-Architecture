import { User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import type { FasSupplier } from '@/hooks/use-fas-api';
import { useCreateSupplierConfig, useUpdateSupplierConfig, useUpdateSupplierRole } from '@/hooks/use-fas-api';

interface SupplierContactsDialogProps {
  supplier: FasSupplier | null;
  open: boolean;
  onClose: () => void;
}

export function SupplierContactsDialog({ supplier, open, onClose }: SupplierContactsDialogProps) {
  const { t } = useTranslation();
  const [validateContract, setValidateContract] = useState(false);

  const updateRoleMutation = useUpdateSupplierRole();
  const updateConfigMutation = useUpdateSupplierConfig();
  const createConfigMutation = useCreateSupplierConfig();

  const isLoading = updateRoleMutation.isPending || updateConfigMutation.isPending || createConfigMutation.isPending;

  useEffect(() => {
    if (supplier?.supplierConfig?.validateContract !== undefined) {
      setValidateContract(supplier.supplierConfig.validateContract);
    } else {
      setValidateContract(false);
    }
  }, [supplier]);

  const handleRoleToggle = (contactId: string, currentRole: 'admin' | 'default') => {
    const newRole = currentRole === 'admin' ? 'default' : 'admin';
    updateRoleMutation.mutate({ id: contactId, role: newRole });
  };

  const handleValidateContractToggle = () => {
    if (!supplier) return;

    const newValue = !validateContract;

    if (supplier.supplierConfig?.id) {
      updateConfigMutation.mutate({
        id: supplier.supplierConfig.id,
        validateContract: newValue,
      });
    } else {
      createConfigMutation.mutate({
        razao: supplier.razao,
        codigoFornecedor: supplier.codigoFornecedor,
        validateContract: newValue,
      });
    }
  };

  if (!supplier) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('fas.contacts')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="validate-contract" className="cursor-pointer">
              {t('validate.contract')}
            </Label>
            <Switch id="validate-contract" checked={validateContract} onCheckedChange={handleValidateContractToggle} disabled={isLoading} />
          </div>

          <div className="rounded-lg border">
            <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 px-4 py-3 font-medium text-muted-foreground text-sm">
              <div className="col-span-1" />
              <div className="col-span-4">{t('name')}</div>
              <div className="col-span-5">{t('email')}</div>
              <div className="col-span-2 text-center">{t('role.admin')}</div>
            </div>

            {isLoading ? (
              <div className="flex justify-center p-8">
                <Spinner />
              </div>
            ) : (
              <ItemGroup>
                {supplier.contacts?.map((contact) => (
                  <Item key={contact.id} className="grid grid-cols-12 gap-4 border-none">
                    <User className="size-5 text-blue-600" />
                    <div className="col-span-4 flex items-center">
                      <ItemContent>
                        <ItemTitle className="text-sm">{contact.name || '-'}</ItemTitle>
                      </ItemContent>
                    </div>
                    <div className="col-span-5 flex items-center">
                      <ItemDescription className="text-sm">{contact.email}</ItemDescription>
                    </div>
                    <div className="col-span-2 flex items-center justify-center">
                      <Switch checked={contact.role === 'admin'} onCheckedChange={() => handleRoleToggle(contact.id, contact.role)} disabled={isLoading} />
                    </div>
                  </Item>
                ))}
              </ItemGroup>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              {t('close')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
