
import { useTheme } from "styled-components";
import { nanoid } from "nanoid";
import ReactApexChart from "react-apexcharts";
import { useIntl } from "react-intl";
import { CardBody } from "@paljs/ui/Card";
import { useThemeSelected } from "../../../../components/Hooks/Theme";
import { CardNoShadow } from "../../../../components";
import { floatToStringExtendDot } from "../../../../components/Utils";


export default function VoyageEstimateVsReal(props) {

  const theme = useTheme();
  const intl = useIntl();
  const themeSelected = useThemeSelected();

  const { data } = props;

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
      width: [0.5, 0.5, 1],
      dashArray: [0, 0, 2]
    },
    plotOptions: {
      bar: {
        columnWidth: '40%',
        dataLabels: {
          position: 'top', // top, center, bottom
          hideOverflowingLabels: true,
          total: {
            enabled: true,
            offsetY: 50,
            style: {
              border: 0
            }
          }
        },
      },
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0, 1, 2],
      formatter: function (val) {
        return val ? floatToStringExtendDot(val, 2) : "";
      },
      // offsetY: -20,
      // style: {
      //   colors: [theme.textBasicColor],
      //   fontFamily: theme.fontFamilyPrimary
      // }
    },
    xaxis: {
      categories: data?.map(x => x.code) || [],
    },
    grid: {
      show: false,
    },
    yaxis: {
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
    colors: [theme.colorWarning500, theme.colorPrimary500, theme.colorDanger600],
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
        colors: [theme.textHintColor, theme.textHintColor, theme.textHintColor, theme.textHintColor],
      }
    },
    theme: {
      palette: 'palette1',
      mode: themeSelected?.isDark ? 'dark' : 'light',
    },
    title: {
      text: `${intl.formatMessage({ id: "travel" })} (${intl.formatMessage({ id: "estimated" })} x ${intl.formatMessage({ id: "real" })})`,
      align: "center",
      style: {
        fontSize: "12px",
        color: theme.colorBasic600,
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: "600",
      },
    },
    // annotations: {
    //   position: "front",
    //   yaxis: [{
    //     y: 13.3,
    //     strokeDashArray: 3,
    //     borderColor: theme.colorBasic500,
    //     label: {
    //       borderColor: theme.colorBasic400,
    //       show: true,
    //       text: `Meta: 13,3 dias`,
    //       style: {
    //         color: theme.colorTextBasic,
    //         fontFamily: theme.fontFamilyPrimary,
    //         background: theme.colorBasic400,
    //       },
    //     },
    //   }],
    //}
  }

  const series = [{
    name: intl.formatMessage({ id: "estimated" }),
    type: 'column',
    data: data?.map(x => x.calculated?.estimatedTotal) || []
  }, {
    name: intl.formatMessage({ id: "real" }),
    type: 'column',
    data: data?.map(x => x.calculated?.realTotal) || []
  }, {
    name: `${intl.formatMessage({ id: "goal" })}`,
    type: 'line',
    data: data?.map(x => x.goal) || []
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
