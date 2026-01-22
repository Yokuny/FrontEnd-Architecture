import { Card, CardContent } from '@/components/ui/card';
import { ItemTitle } from '@/components/ui/item';
import type { Asset, Operation, RDO, Sounding } from '../@interface/rve-sounding.types';
import { ItemPeriodSounding } from './item-period-sounding';

interface RVESoundingItemProps {
  asset: Asset;
  data: {
    operations: Operation[];
    sounding: Sounding[];
    rdo: RDO[];
  };
}

export function RVESoundingItem({ asset, data }: RVESoundingItemProps) {
  return (
    <Card className="mb-6 overflow-hidden border-2 border-muted/50">
      <CardContent className="p-0">
        <div className="bg-muted/30 p-4 border-b flex items-center gap-4">
          <img src={asset.image?.url} alt={asset.name} className="w-14 h-14 rounded-full object-cover border-2 border-background shadow-sm" />
          <ItemTitle className="text-xl font-bold tracking-tight">{asset.name}</ItemTitle>
        </div>

        <div className="p-4 bg-background">
          <ItemPeriodSounding data={data} />
        </div>
      </CardContent>
    </Card>
  );
}
