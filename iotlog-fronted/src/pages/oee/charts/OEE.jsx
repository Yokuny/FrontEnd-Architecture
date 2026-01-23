import { Card, CardBody, CardHeader } from '@paljs/ui';
import { FormattedMessage, useIntl } from 'react-intl';
import ReactApexChart from 'react-apexcharts';
import { TextSpan } from '../../../components';
import { useTheme } from 'styled-components';
import { useThemeSelected } from '../../../components/Hooks/Theme';
import { nanoid } from 'nanoid';

export default function OEEChart({ rawData, rveData }) {
  const theme = useTheme();
  const themeSelected = useThemeSelected();
  const intl = useIntl();

  const monthsDistinct = [...new Set(rawData?.map(x => x.competence))];

  const getAvailable = (competence) => {
    const dataFromCompetence = rawData?.filter(x => x.competence === competence);
    const total = dataFromCompetence?.reduce((acc, curr) => acc + (curr.totalHours || 0), 0) || 0;
    const operating = dataFromCompetence
      ?.filter(y => y.status === 'operacao' || y.status === 'downtime-parcial')
      ?.reduce((acc, curr) => acc + (curr.totalHours || 0), 0) || 0;

    return operating || total ? 100 * (operating / total) : 0;
  }

  const getQuality = (competence) => {
    const dataFromCompetence = rawData?.filter(x => x.competence === competence);
    const total = dataFromCompetence?.reduce((acc, curr) => acc + (curr.totalHours || 0), 0) || 0;
    const downtime = dataFromCompetence
      ?.filter(y => y.status === 'downtime' || y.status === 'downtime-parcial')
      ?.reduce((acc, curr) => acc + (curr.totalHours || 0), 0) || 0;

    return downtime || total ? 100 - (100 * (downtime / total)) : 0;
  }

  const getPerformance = (competence) => {
    const codesGroups = rveData
      ?.monthlyData
      ?.find(x => x.month === competence)
      ?.codeGroups
    const dataINRveFromCompetence = codesGroups
      ?.find(cg => cg.code === 'IN')
      ?.totalHours || 0;
    const dataOMRveFromCompetence = codesGroups
      ?.find(cg => cg.code === 'OM')
      ?.totalHours || 0;

    const total = dataINRveFromCompetence + dataOMRveFromCompetence;

    return dataINRveFromCompetence || total ? 100 - (100 * (dataINRveFromCompetence / total)) : 0;
  }

  const series = [
    {
      name: "OEE",
      type: 'column',
      data: monthsDistinct.map(m => {
        const available = getAvailable(m);
        const quality = getQuality(m);
        const performance = getPerformance(m);

        return ((available / 100) * (quality / 100) * (performance / 100)) * 100;
      })
    },
    {
      name: intl.formatMessage({ id: "oee.availability" }),
      type: 'line',
      data: monthsDistinct.map(m => {
        return getAvailable(m);
      })
    },
    {
      name: intl.formatMessage({ id: "oee.quality" }),
      type: 'line',
      data: monthsDistinct.map(m => {
        return getQuality(m);
      })
    },
    {
      name: intl.formatMessage({ id: "oee.performance" }),
      type: 'line',
      data: monthsDistinct.map(m => {
        return getPerformance(m);
      })
    }
  ]

  const options = {
    chart: {
      type: 'bar',
      height: 350,
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
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0, 0, 0, 0],
      formatter: function (val) {
        return Math.round(val * 10) / 10 + '%'
      }
    },
    stroke: {
      show: true,
      dashArray: [0, 2, 2, 2],
      width: [0, 1, 1, 1],
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
      min: 0,
      tickAmount: 4,
      max: 100,
      labels: {
        style: {
          colors: [theme.textHintColor],
          fontFamily: theme.fontFamilyPrimary,
        },
        formatter: function (val) {
          return val.toFixed(0) + '%';
        }
      }
    },
    colors: [theme.colorPrimary500, theme.colorSuccess500, theme.colorWarning700, theme.colorDanger700],
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return Math.round(val * 100) / 100 + "%"
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
    <Card>
      <CardHeader>
        <TextSpan apparence="s1">
          <FormattedMessage id="oee" defaultMessage="OEE" />
        </TextSpan>
      </CardHeader>
      <CardBody>
        <ReactApexChart
          options={options}
          series={series}
          height={350}
          key={nanoid(5)}
        />
      </CardBody>
    </Card>
  );
}
