import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import ReactECharts from 'echarts-for-react';
import { Eye } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { ConsumptionDailyData } from '../@interface/consumption-daily.types';

export function ConsumptionChart({ data, showReal, showEstimated, onToggleReal, onToggleEstimated }: ConsumptionChartProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const categories = data?.map((item) => format(new Date(item.date), 'dd/MMM', { locale: pt })) || [];

  const realData =
    data?.map((item) => {
      const val = Number(item?.consumptionReal?.value);
      return !Number.isNaN(val) ? Number(val.toFixed(3)) : 0;
    }) || [];

  const estimatedData =
    data?.map((item) => {
      const val = Number(item?.consumption?.value);
      return !Number.isNaN(val) ? Number(val.toFixed(3)) : 0;
    }) || [];

  const hoursData = data?.map((item) => item?.hours) || [];

  const series = [];
  const yAxis = [];
  let yAxisIndex = 0;

  // Colors
  const primaryColor = 'hsl(221.2 83.2% 53.3%)'; // blue-500
  const warningColor = 'hsl(38 92% 50%)'; // amber-500
  const grayColor = 'hsl(215 16.3% 46.9%)'; // slate-600
  const textColor = isDark ? 'hsl(210 40% 98%)' : 'hsl(222.2 47.4% 11.2%)';

  if (showReal) {
    const unit = data?.[0]?.consumptionReal?.unit || '';
    series.push({
      name: `${t('polling')} (${unit})`,
      type: 'line',
      smooth: true,
      data: realData,
      yAxisIndex: yAxisIndex,
      lineStyle: {
        width: 3,
        color: primaryColor,
      },
      itemStyle: {
        color: primaryColor,
      },
      label: {
        show: true,
        position: 'top',
        fontSize: 10,
        color: primaryColor,
      },
    });
    yAxis.push({
      type: 'value',
      name: `${t('real.consumption')} (${unit})`,
      nameLocation: 'middle',
      nameGap: showEstimated ? 45 : 50,
      nameRotate: -90,
      position: 'right',
      offset: showEstimated ? 60 : 0,
      min: 0,
      axisLine: {
        show: true,
        lineStyle: {
          color: primaryColor,
        },
      },
      axisLabel: {
        color: primaryColor,
      },
      nameTextStyle: {
        color: primaryColor,
      },
      splitLine: {
        show: false,
      },
    });
    yAxisIndex++;
  }

  if (showEstimated) {
    const unit = data?.[0]?.consumption?.unit || '';
    series.push({
      name: `${t('flowmeter')} (${unit})`,
      type: 'line',
      smooth: true,
      data: estimatedData,
      yAxisIndex: yAxisIndex,
      lineStyle: {
        width: 3,
        color: warningColor,
      },
      itemStyle: {
        color: warningColor,
      },
      label: {
        show: true,
        position: 'right',
        fontSize: 10,
        color: warningColor,
      },
    });
    yAxis.push({
      type: 'value',
      name: `${t('estimated.consumption')} (${unit})`,
      nameLocation: 'middle',
      nameGap: 43,
      nameRotate: -90,
      position: 'right',
      min: 0,
      axisLine: {
        show: true,
        lineStyle: {
          color: warningColor,
        },
      },
      axisLabel: {
        color: warningColor,
      },
      nameTextStyle: {
        color: warningColor,
      },
      splitLine: {
        show: false,
      },
    });
    yAxisIndex++;
  }

  // Hours bar chart (always shown)
  series.push({
    name: t('hours').charAt(0).toUpperCase() + t('hours').slice(1),
    type: 'bar',
    data: hoursData,
    yAxisIndex: yAxisIndex,
    barWidth: '30%',
    itemStyle: {
      color: grayColor,
    },
  });

  yAxis.push({
    type: 'value',
    name: t('hours').charAt(0).toUpperCase() + t('hours').slice(1),
    position: 'left',
    min: 0,
    max: 24,
    axisLine: {
      show: true,
      lineStyle: {
        color: grayColor,
      },
    },
    axisLabel: {
      color: grayColor,
      formatter: (val: number) => (val ? Math.floor(val) : 0),
    },
    nameTextStyle: {
      color: grayColor,
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
        color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
      },
    },
  });

  const options = {
    backgroundColor: 'transparent',
    title: {
      text: `${t('consumption.daily')} 24hrs`,
      left: 'center',
      textStyle: {
        fontSize: 12,
        color: textColor,
        fontWeight: 600,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      show: true,
      bottom: 0,
      textStyle: {
        color: textColor,
      },
    },
    // To Allow Download
    // toolbox: {
    //   show: true,
    //   feature: {
    //     saveAsImage: {
    //       title: 'Download',
    //       name: 'dailyconsumption',
    //     },
    //   },
    // },
    grid: {
      left: '1%',
      right: showReal && showEstimated ? '4%' : '3%',
      bottom: '15%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: textColor,
      },
    },
    yAxis: yAxis,
    series: series,
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Eye className="size-4 text-muted-foreground" />
          <span className="font-medium text-muted-foreground text-sm">{t('show')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="real" checked={showReal} onCheckedChange={onToggleReal} />
          <Label htmlFor="real" className="cursor-pointer">
            {t('real.consumption')}
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="estimated" checked={showEstimated} onCheckedChange={onToggleEstimated} />
          <Label htmlFor="estimated" className="cursor-pointer">
            {t('estimated.consumption')}
          </Label>
        </div>
      </div>

      <ReactECharts option={options} style={{ height: 350 }} notMerge={true} />
    </div>
  );
}

interface ConsumptionChartProps {
  data: ConsumptionDailyData[];
  showReal: boolean;
  showEstimated: boolean;
  onToggleReal: (checked: boolean) => void;
  onToggleEstimated: (checked: boolean) => void;
}
