import { useNavigate } from '@tanstack/react-router';
import Exit from '@/components/icons/Exit.Icon';
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
    <Button size="icon" variant="secondary" aria-label={'logout'} onClick={onLogout}>
      <Exit className="size-4" />
      <span className="sr-only">{'logout'}</span>
    </Button>
  );
}
