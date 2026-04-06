import { CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ScheduleListSkeleton() {
  return (
    <div className="space-y-4">
      <CardContent className="flex flex-col gap-3 p-4 md:p-6">
        <Skeleton className="mb-4 h-6 w-48" />
        <div className="rounded-lg border p-4 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-8 w-full" />
            <div className="flex flex-wrap gap-3 pt-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
      </CardContent>

      <CardContent className="flex flex-col gap-3 p-4 md:p-6">
        <Skeleton className="mb-4 h-6 w-56" />
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="rounded-lg border p-4 md:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-8 w-full" />
              <div className="flex flex-wrap gap-3 pt-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>

      <CardContent className="flex flex-col gap-3 p-4 md:p-6">
        <Skeleton className="mb-4 h-6 w-48" />
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-lg border p-4 md:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-8 w-full" />
              <div className="flex flex-wrap gap-3 pt-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </div>
  );
}
