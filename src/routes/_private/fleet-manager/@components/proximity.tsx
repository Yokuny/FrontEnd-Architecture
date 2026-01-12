import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ProximityProps {
  latitude?: number;
  longitude?: number;
}

export function Proximity({ latitude, longitude }: ProximityProps) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (latitude === undefined || longitude === undefined) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://nearby-cities.vercel.app/api/search?latitude=${latitude}&longitude=${longitude}`);
        const result = await response.json();
        setData(result);
      } catch {
        // Silent error
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [latitude, longitude]);

  if (isLoading) {
    return <Skeleton className="h-4 w-24" />;
  }

  if (!data || !data.length) {
    return <span>-</span>;
  }

  const city = data[0];
  return (
    <span className="truncate">
      {city.name} - {city.state?.code ?? ''}
    </span>
  );
}
