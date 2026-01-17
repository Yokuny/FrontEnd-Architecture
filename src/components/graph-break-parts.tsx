'use client';

// extraido de https://rosencharts.com/

import { useMemo } from 'react';
import { getChartColor } from '@/components/ui/chart';
import { Item, ItemContent, ItemDescription, ItemFooter, ItemHeader, ItemTitle } from '@/components/ui/item';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const data = [
  {
    key: 'Utils',
    value: 17.1,
  },
  {
    key: 'Tech',
    value: 14.3,
  },
  {
    key: 'Energy',
    value: 27.1,
  },
  {
    key: 'Cyclicals',
    value: 42.5,
  },
  {
    key: 'Fuel',
    value: 12.7,
  },
];

const chartData = data.map((item, index) => ({
  ...item,
  color: getChartColor(index),
}));

export function GraphBreakParts() {
  const barHeight = 60;
  const cornerRadius = 8;

  const { processedData } = useMemo(() => {
    const total = chartData.reduce((acc, d) => acc + d.value, 0);
    let cumulativeWidth = 0;

    const data = chartData.map((d, index) => {
      const barWidth = (d.value / total) * 100;
      const xPosition = cumulativeWidth;
      cumulativeWidth += barWidth;

      // Lógica de arredondamento de bordas
      let borderRadius = '0';
      if (index === 0) {
        borderRadius = `${cornerRadius}px 0 0 ${cornerRadius}px`;
      } else if (index === chartData.length - 1) {
        borderRadius = `0 ${cornerRadius}px ${cornerRadius}px 0`;
      }

      return {
        ...d,
        width: barWidth,
        left: xPosition,
        borderRadius,
      };
    });

    return { processedData: data };
  }, []);

  return (
    <Item variant="outline" className="flex-col items-stretch">
      <ItemHeader className="items-center flex-col">
        <ItemTitle>Breakdown Chart - Parts</ItemTitle>
        <ItemDescription>Description</ItemDescription>
      </ItemHeader>
      <ItemContent>
        <div className="relative w-full" style={{ height: `${barHeight}px` }}>
          <TooltipProvider>
            {processedData.map((d, index) => (
              <Tooltip key={`${d.key}-${index}`}>
                <TooltipTrigger asChild>
                  <div
                    className="absolute transition-all duration-300 hover:brightness-110 hover:z-10 group cursor-help"
                    style={{
                      width: `${d.width}%`,
                      height: `${barHeight}px`,
                      left: `${d.left}%`,
                    }}
                  >
                    <div
                      className="w-full h-full shadow-sm border-y border-white/5 first:border-l last:border-r"
                      style={{
                        backgroundColor: d.color,
                        borderRadius: d.borderRadius,
                      }}
                    />

                    {d.width > 10 && (
                      <>
                        <div
                          className="absolute pointer-events-none text-white font-semibold text-center w-full"
                          style={{
                            top: `${barHeight / 5}px`,
                            left: '50%',
                            transform: 'translateX(-50%)',
                          }}
                        >
                          <ItemDescription className="text-white font-semibold">{d.key}</ItemDescription>
                        </div>
                        <div
                          className="absolute pointer-events-none text-white text-center w-full"
                          style={{
                            top: `${barHeight * 0.45}px`,
                            left: '50%',
                            transform: 'translateX(-50%)',
                          }}
                        >
                          <p className="text-white text-lg font-bold font-mono tabular-nums">{d.value}</p>
                        </div>
                      </>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="flex flex-col gap-1 min-w-32">
                  <div className="flex items-center gap-2">
                    <div className="size-3" style={{ backgroundColor: d.color }} />
                    <ItemTitle className="font-bold text-xs uppercase tracking-tight">{d.key}</ItemTitle>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <ItemTitle className="text-lg font-black tabular-nums">{d.value.toLocaleString()}</ItemTitle>
                    <ItemDescription className="text-xs font-normal uppercase">unidades</ItemDescription>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>

        {/* Legend Pattern consistent with Pizza Chart */}
        <ItemFooter className="flex-wrap items-center justify-center gap-6">
          {processedData.map((item) => (
            <div key={item.key} className="flex flex-col items-center">
              <div className="flex items-baseline gap-2">
                <div className="size-2" style={{ backgroundColor: item.color }} />
                <ItemTitle className="text-xs font-semibold text-muted-foreground uppercase">{item.key}</ItemTitle>
              </div>
              <ItemTitle className="tabular-nums font-semibold text-lg">{item.value}</ItemTitle>
            </div>
          ))}
        </ItemFooter>
      </ItemContent>
    </Item>
  );
}
