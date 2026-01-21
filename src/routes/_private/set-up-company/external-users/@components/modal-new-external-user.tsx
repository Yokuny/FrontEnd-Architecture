import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useExternalUsersApi } from '../@hooks/use-external-users-api';

interface ModalNewExternalUserProps {
  idEnterprise: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModalNewExternalUser({ idEnterprise, open, onOpenChange }: ModalNewExternalUserProps) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const { createUser } = useExternalUsersApi();

  const handleSave = async () => {
    if (!username) return;
    await createUser.mutateAsync({ idEnterprise, username });
    setUsername('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('new')}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Field className="gap-2">
            <FieldLabel>{t('user')}</FieldLabel>
            <Input value={username} onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))} placeholder={t('username.name')} />
          </Field>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSave} disabled={!username || createUser.isPending}>
            {createUser.isPending && <Spinner className="mr-2 size-4" />}
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
