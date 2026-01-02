'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

const DefaultLoading = () => {
  return (
    <Skeleton className="h-48 w-full flex items-center justify-center">
      <Spinner />
    </Skeleton>
  );
};

export default DefaultLoading;
