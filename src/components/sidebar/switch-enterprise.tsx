'use client';

import { useNavigate } from '@tanstack/react-router';
import { LogOutIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

export function EnterpriseSwitcher() {
  const { t } = useTranslation();
  const { clearAuth } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    clearAuth();
    navigate({ to: '/auth' });
  };

  return (
    <Button size="icon" variant="ghost" aria-label={t('logout')} onClick={onLogout}>
      <LogOutIcon className="size-4" />
      <span className="sr-only">{t('logout')}</span>
    </Button>
  );
}
