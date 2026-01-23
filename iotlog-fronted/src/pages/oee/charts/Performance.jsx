import React from 'react';
import { Card, CardBody, CardHeader } from '@paljs/ui';
import { FormattedMessage, useIntl } from 'react-intl';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import { CardNoShadow, TextSpan } from '../../../components';
import { useTheme } from 'styled-components';
import { useThemeSelected } from '../../../components/Hooks/Theme';
import { floatToStringExtendDot } from '../../../components/Utils';
import { nanoid } from 'nanoid';

export default function Performance({ rveData, rawData, isLoading }) {
  const theme = useTheme();
  const themeSelected = useThemeSelected();
  const intl = useIntl();

  const monthsDistinct = [...new Set(rawData?.map(x => x.competence))]

  const series = [
    {
      name: intl.formatMessage({ id: "contracted" }),
      data: monthsDistinct.map(monthData => {
        return rawData.filter(x => x.competence === monthData)
          .reduce((sum, s) => sum + (s.totalGrossHours || 0), 0);
      }),
      group: 'individual-2'
    },
    {
      name: intl.formatMessage({ id: "operating" }),
      data: monthsDistinct.map(monthData => {
        return rveData
          ?.monthlyData
          ?.find(x => x.month === monthData)
          ?.codeGroups
          ?.find(cg => cg.code === 'OM')
          ?.totalHours || 0;
      }),
      group: 'individual-1'
    },
    {
      name: intl.formatMessage({ id: "oee.chartdata.in.hours" }),
      data: monthsDistinct.map(monthData => {
        return rveData
          ?.monthlyData
          ?.find(x => x.month === monthData)
          ?.codeGroups
          ?.find(cg => cg.code === 'IN')
          ?.totalHours || 0;
      }),
      //stack: 'tempo-parado',
      group: 'stacked'
    },
    {
      name: intl.formatMessage({ id: "oee.chartdata.am.hours" }),
      data: monthsDistinct.map(monthData => {
        return rveData
          ?.monthlyData
          ?.find(x => x.month === monthData)
          ?.codeGroups
          ?.find(cg => cg.code === 'AM')
          ?.totalHours || 0;
      }),
      //stack: 'tempo-parado',
      group: 'stacked'
    },
  ];

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      stackType: 'normal',
      toolbar: {
        show: false
      },
      animations: {
        enabled: !isLoading
      },
      background: theme.backgroundBasicColor1,
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '80%',
        endingShape: 'rounded',
        dataLabels: {
          position: 'center',
        }
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: monthsDistinct,
      labels: {
        rotate: -45,
        rotateAlways: false,
        maxHeight: 120,
        style: {
          fontSize: '12px',
          colors: new Array(series?.length ? series[0].data?.length : 0).fill().map(() => theme.textHintColor) || [],
          fontFamily: theme.fontFamilyPrimary,
        }
      }
    },
    yaxis: {
      tickAmount: 3,
      max: 800,
      min: 0,
      title: {
        text: intl.formatMessage({ id: 'hour.unity' }),
        style: {
          color: theme.textHintColor,
          fontFamily: theme.fontFamilyPrimary,
        },
      },
      labels: {
        style: {
          colors: [theme.textHintColor],
          fontFamily: theme.fontFamilyPrimary,
        },
        formatter: function (val) {
          return Math.round(val);
        }
      }
    },
    colors: [theme.colorBasic500, theme.colorSuccess500, theme.colorDanger500, theme.colorWarning500],
    fill: {
      opacity: 1
    },
    tooltip: {
      shared: false,
      intersect: true,
      y: {
        formatter: function (val) {
          return floatToStringExtendDot(Math.round(val * 100) / 100, 1) + ' ' + intl.formatMessage({ id: 'hour.unity' });
        }
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center'
    },
    grid: {
      strokeDashArray: 2,
      row: {
        colors: ['transparent'],
        opacity: 0.5
      }
    },
    theme: {
      mode: themeSelected?.isDark ? 'dark' : 'light'
    }
  };


  return (
    <CardNoShadow>
      <CardHeader>
        <TextSpan apparence="s1">
          <FormattedMessage id="oee.performance" />
        </TextSpan>
      </CardHeader>
      <CardBody>
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
          key={nanoid(5)}
        />
      </CardBody>
    </CardNoShadow>
  );
}
