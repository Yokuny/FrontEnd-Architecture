'use client';

import { useNavigate } from '@tanstack/react-router';
import { LogOutIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/hooks/auth';

export function EnterpriseSwitcher() {
  const navigate = useNavigate();
  const { logout } = useAuthStore.getState();

  const onLogout = () => {
    logout();
    navigate({ to: '/auth' });
  };

  return (
    <Button size="icon" variant="ghost" aria-label={'logout'} onClick={onLogout}>
      <LogOutIcon className="size-4" />
      <span className="sr-only">{'logout'}</span>
    </Button>
  );
}
