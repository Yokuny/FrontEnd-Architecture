import { CardBody, CardHeader } from '@paljs/ui';
import { FormattedMessage, useIntl } from 'react-intl';
import ReactApexChart from 'react-apexcharts';
import { CardNoShadow, TextSpan } from '../../../components';
import { LoadingCard } from '../../../components';
import { useTheme } from 'styled-components';
import { useThemeSelected } from '../../../components/Hooks/Theme';
import { floatToStringExtendDot } from '../../../components/Utils';

export default function Availability({ data, isLoading }) {
  const theme = useTheme();
  const themeSelected = useThemeSelected();
  const intl = useIntl();
  const typeView = 'competence';


  const monthsDistinct = [...new Set(data?.map(x => x[typeView]))];

  const series = [
    {
      name: intl.formatMessage({ id: "operational" }),
      s: 'operacao',
      data: monthsDistinct.map(m => {
        const dataFiltered = data?.filter(y =>
          (y.status === 'operacao' || y.status === 'downtime-parcial') && y[typeView] === m);
        return dataFiltered?.reduce((acc, curr) => acc + curr.totalHours, 0);
      })
    },
    {
      name: intl.formatMessage({ id: "inoperability" }),
      s: 'downtime',
      data: monthsDistinct.map(m => {
        const dataFiltered = data?.filter(y =>
          y.status === 'downtime' && y[typeView] === m);
        return dataFiltered?.reduce((acc, curr) => acc + curr.totalHours, 0);
      })
    }
  ]

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: false,
      toolbar: {
        show: false
      },
      background: theme.backgroundBasicColor1,
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
      stackType: '100%',
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return `${floatToStringExtendDot(val, 1)}%`
      },
      style: {
        fontSize: '10px'
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: monthsDistinct,
      labels: {
        style: {
          fontSize: '12px',
          colors: new Array(series?.length ? series[0].data?.length : 0).fill().map(() => theme.textHintColor) || [],
          fontFamily: theme.fontFamilyPrimary,
        }
      }
    },
    yaxis: {
      min: 0,
      tickAmount: 4,
      max: 100,
      labels: {
        style: {
          colors: [theme.textHintColor],
          fontFamily: theme.fontFamilyPrimary,
        },
        formatter: function (val) {
          return val?.toFixed(0) + '%';
        }
      }
    },
    colors: [theme.colorSuccess500, theme.colorDanger500], // Azul para disponibilidade, vermelho para downtime
    fill: {
      opacity: 1
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center'
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return floatToStringExtendDot(Math.round(val * 100) / 100, 2) + ` ${intl.formatMessage({ id: 'hour.unity' })}`;
        }
      }
    },
    grid: {
      show: true,
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
          <FormattedMessage id="oee.availability" />
        </TextSpan>
      </CardHeader>
      <CardBody>
        <LoadingCard isLoading={isLoading}>
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
          />
        </LoadingCard>
      </CardBody>
    </CardNoShadow>
  );
}
