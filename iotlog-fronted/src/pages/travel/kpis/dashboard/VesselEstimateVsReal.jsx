
import { useTheme } from "styled-components";
import ReactApexChart from "react-apexcharts";
import { useIntl } from "react-intl";
import { CardBody } from "@paljs/ui/Card";
import { useThemeSelected } from "../../../../components/Hooks/Theme";
import { CardNoShadow } from "../../../../components";
import { floatToStringExtendDot } from "../../../../components/Utils";
import { nanoid } from "nanoid";


export default function VesselEstimateVsReal(props) {

  const theme = useTheme();
  const intl = useIntl();
  const themeSelected = useThemeSelected();

  const { data } = props;

  const vessels = [...new Set(data?.map(x => x.machine?.name) || [])];

  const options = {
    chart: {
      type: "line",
      // stacked: true,
      background: theme.backgroundBasicColor1,
      zoom: {
        enabled: false,
      },
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
    stroke: {
      width: [0.5, 0.5, 2],
      dashArray: [0, 0, 5]
    },
    plotOptions: {
      bar: {
        columnWidth: '35%',
      },
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [2]
    },
    xaxis: {
      categories: vessels || [],
    },
    grid: {
      show: false,
    },
    yaxis: [
      {
        seriesName: intl.formatMessage({ id: "estimated" }),
        title: {
          text: intl.formatMessage({ id: "day.unity" }),
          style: {
            color: theme.textHintColor,
            fontFamily: theme.fontFamilyPrimary,
          }
        },
        labels: {
          formatter: function (value) {
            return value?.toFixed(0);
          },
          style: {
            colors: [theme.textHintColor],
            fontFamily: theme.fontFamilyPrimary,
          }
        }
      },
      {
        seriesName: intl.formatMessage({ id: "real" }),
        show: false,
        title: {
          text: intl.formatMessage({ id: "day.unity" }),
          style: {
            color: theme.textHintColor,
            fontFamily: theme.fontFamilyPrimary,
          }
        },
        labels: {
          formatter: function (value) {
            return value?.toFixed(0);
          },
          style: {
            colors: [theme.textHintColor],
            fontFamily: theme.fontFamilyPrimary,
          }
        }
      },
      {
        seriesName: intl.formatMessage({ id: "list.travel" }),
        opposite: true,
        decimalsInFloat: 0,
        title: {
          text: intl.formatMessage({ id: "list.travel" }),
          style: {
            color: theme.textSuccessColor,
            fontFamily: theme.fontFamilyPrimary,
          }
        },
        labels: {
          formatter: function (value) {
            return value?.toFixed(0);
          },
          style: {
            colors: [theme.textSuccessColor],
            fontFamily: theme.fontFamilyPrimary,
          }
        }
      }
    ],
    colors: [theme.colorBasic400, theme.colorInfo700, theme.colorSuccess500],
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val) {
          return floatToStringExtendDot(val, 2);
        }
      }
    },
    legend: {
      show: true,
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
      position: 'bottom',
      labels: {
        colors: [theme.textHintColor, theme.textHintColor, theme.textHintColor],
      }
    },
    theme: {
      palette: 'palette1',
      mode: themeSelected?.isDark ? 'dark' : 'light',
    },
    title: {
      text: `${intl.formatMessage({ id: "vessel" })} (${intl.formatMessage({ id: "estimated" })} x ${intl.formatMessage({ id: "real" })})`,
      align: "center",
      style: {
        fontSize: "12px",
        color: theme.colorBasic600,
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: "600",
      },
    }
  }

  const series = [{
    name: intl.formatMessage({ id: "estimated" }),
    type: 'column',
    data: vessels
      .map(vessel => data?.filter(x => x.machine?.name === vessel)
        .reduce((acc, curr) => acc + curr.calculated?.estimatedTotal, 0)) || []
  }, {
    name: intl.formatMessage({ id: "real" }),
    type: 'column',
    data: vessels
      .map(vessel => data?.filter(x => x.machine?.name === vessel)
        .reduce((acc, curr) => acc + curr.calculated?.realTotal, 0)) || []
  }, {
    name: intl.formatMessage({ id: "list.travel" }),
    type: 'line',
    data: vessels
      ?.map(vessel => data?.filter(x => x.machine?.name === vessel)?.length || 0) || []
  }]

  return (
    <>
      <CardNoShadow>
        <CardBody>
          <ReactApexChart
            key={nanoid(4)}
            options={options}
            series={series}
            type="line"
            height={350} />
        </CardBody>
      </CardNoShadow>
    </>
  )
}
