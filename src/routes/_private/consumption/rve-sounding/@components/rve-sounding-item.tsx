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
        <div className="flex items-center gap-4 border-b bg-muted/30 p-4">
          <img src={asset.image?.url} alt={asset.name} className="h-14 w-14 rounded-full border-2 border-background object-cover" />
          <ItemTitle className="font-bold text-xl tracking-tight">{asset.name}</ItemTitle>
        </div>

        <div className="bg-background p-4">
          <ItemPeriodSounding data={data} />
        </div>
      </CardContent>
    </Card>
  );
}
