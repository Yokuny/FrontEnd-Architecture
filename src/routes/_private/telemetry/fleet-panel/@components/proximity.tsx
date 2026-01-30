import { memo } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetProximity } from '@/hooks/use-telemetry-api';

interface ProximityProps {
  latitude?: number;
  longitude?: number;
  showFlag?: boolean;
}

function ProximityComponent({ latitude, longitude, showFlag }: ProximityProps) {
  const { data, isLoading } = useGetProximity(latitude, longitude);

  if (isLoading) {
    return <Skeleton className="h-4 w-24" />;
  }

  if (!data?.length) {
    return <span>-</span>;
  }

  const city = data[0];

  return (
    <span className="inline-flex items-center gap-1">
      {`${city.name} - ${city.state?.code ?? ''}`}
      {showFlag && <ReactCountryFlag countryCode={city.country.code} svg style={{ fontSize: '1.2em', borderRadius: 2 }} />}
    </span>
  );
}

export const Proximity = memo(ProximityComponent, (prev, next) => {
  return prev.latitude === next.latitude && prev.longitude === next.longitude && prev.showFlag === next.showFlag;
});
