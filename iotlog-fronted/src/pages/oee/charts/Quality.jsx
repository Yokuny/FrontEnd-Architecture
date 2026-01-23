import { CardBody, CardHeader } from '@paljs/ui';
import { FormattedMessage, useIntl } from 'react-intl';
import ReactApexChart from 'react-apexcharts';
import { CardNoShadow, TextSpan } from '../../../components';
import { LoadingCard } from '../../../components';
import { useTheme } from 'styled-components';
import { useThemeSelected } from '../../../components/Hooks/Theme';
import { floatToStringExtendDot } from '../../../components/Utils';

export default function Quality({ data: rawData, isLoading }) {
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
      })
    },
    {
      name: intl.formatMessage({ id: "reduction.tax" }),
      data: monthsDistinct.map(monthData => {
        return rawData.filter(x => x.competence === monthData && x.status === 'downtime-parcial')
          .reduce((sum, s) => sum + (s.totalGrossHours || 0), 0);
      })
    },
    {
      name: intl.formatMessage({ id: "inoperability" }),
      data: monthsDistinct.map(monthData => {
        return rawData.filter(x => x.competence === monthData && x.status === 'downtime')
          .reduce((sum, s) => sum + (s.totalGrossHours || 0), 0);
      })
    }
  ];

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
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '80%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false,
      formatter: function (val) {
        return Math.round(val * 10) / 10 + 'h';
      },
      style: {
        fontSize: '12px'
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
      title: {
        text: intl.formatMessage({ id: 'hour.unity' }),
        style: {
          color: theme.textHintColor,
          fontFamily: theme.fontFamilyPrimary,
        },
      },
      tickAmount: 3,
      max: 800,
      min: 0,
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
    colors: [theme.colorBasic500, theme.colorWarning500, theme.colorDanger500], // Azul para total, vermelho para downtime, amarelo para downtime parcial
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
          return floatToStringExtendDot(Math.round(val * 100) / 100, 1) + ' ' + intl.formatMessage({ id: 'hour.unity' });
        }
      }
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
          <FormattedMessage id="oee.quality" />
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
