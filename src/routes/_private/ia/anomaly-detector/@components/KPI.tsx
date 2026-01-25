import { Bug, Check, CloudOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import type { AIAsset } from '../@interface/anomaly-detector.types';

export function KPI({ data }: BenchmarkProps) {
  const { t } = useTranslation();

  const counts = {
    ok: data.filter((x) => x.status === 'ok').length,
    anomaly: data.filter((x) => x.status === 'anomaly').length,
    off: data.filter((x) => x.status === 'off').length,
  };

  return (
    <div className="mx-auto mb-6 grid grid-cols-3 gap-px overflow-hidden rounded-xl border bg-border">
      <Item className="flex-col rounded-none border-0 bg-background">
        <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
          <Check className="size-5 text-lime-700" />
          <ItemDescription className="font-medium">Ok</ItemDescription>
        </ItemContent>
        <ItemTitle className="ml-6 font-bold text-2xl tracking-tight">{counts.ok}</ItemTitle>
      </Item>

      <Item className="flex-col rounded-none border-0 bg-background">
        <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
          <Bug className="size-5 text-red-800" />
          <ItemDescription className="font-medium">{t('anamoly.detected')}</ItemDescription>
        </ItemContent>
        <ItemTitle className="ml-6 font-bold text-2xl tracking-tight">{counts.anomaly}</ItemTitle>
      </Item>

      <Item className="flex-col rounded-none border-0 bg-background">
        <ItemContent className="flex w-full flex-row items-center justify-between gap-2">
          <CloudOff className="size-5 text-muted-foreground" />
          <ItemDescription className="font-medium">Off-line</ItemDescription>
        </ItemContent>
        <ItemTitle className="ml-6 font-bold text-2xl tracking-tight">{counts.off}</ItemTitle>
      </Item>
    </div>
  );
}

interface BenchmarkProps {
  data: AIAsset[];
}
