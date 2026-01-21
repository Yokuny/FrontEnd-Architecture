import { Bug, Check, CloudOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import type { AIAsset } from '../@interface/anomaly-detector.types';

interface BenchmarkProps {
  data: AIAsset[];
}

export function Benchmark({ data }: BenchmarkProps) {
  const { t } = useTranslation();

  const counts = {
    ok: data.filter((x) => x.status === 'ok').length,
    anomaly: data.filter((x) => x.status === 'anomaly').length,
    off: data.filter((x) => x.status === 'off').length,
  };

  return (
    <div className="mx-auto grid gap-px rounded-xl bg-border grid-cols-3 overflow-hidden border mb-6">
      <Item className="rounded-none border-0 bg-background flex-col">
        <ItemContent className="flex flex-row items-center gap-2">
          <Check className="size-5 text-lime-700" />
          <ItemDescription className="text-sm font-medium">Ok</ItemDescription>
        </ItemContent>
        <ItemTitle className="text-2xl font-medium tracking-tight ml-6">{counts.ok}</ItemTitle>
      </Item>

      <Item className="rounded-none border-0 bg-background flex-col">
        <ItemContent className="flex flex-row items-center gap-2">
          <Bug className="size-5 text-red-800" />
          <ItemDescription className="uppercase text-xs font-bold">{t('anamoly.detected')}</ItemDescription>
        </ItemContent>
        <ItemTitle className="text-2xl font-medium tracking-tight ml-6">{counts.anomaly}</ItemTitle>
      </Item>

      <Item className="rounded-none border-0 bg-background flex-col">
        <ItemContent className="flex flex-row items-center gap-2">
          <CloudOff className="size-5 text-muted-foreground" />
          <ItemDescription className="text-sm font-medium">Off-line</ItemDescription>
        </ItemContent>
        <ItemTitle className="text-2xl font-medium tracking-tight ml-6">{counts.off}</ItemTitle>
      </Item>
    </div>
  );
}
