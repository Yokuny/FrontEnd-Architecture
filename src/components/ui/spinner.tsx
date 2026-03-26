import Loader from '@/components/icons/Loader.Icon';
import { cn } from '@/lib/utils/cn.util';

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return <Loader role="status" aria-label="Loading" className={cn('size-4 animate-spin', className)} {...props} />;
}

export { Spinner };
