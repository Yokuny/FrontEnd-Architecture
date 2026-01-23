import React from "react";
import { useTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import moment from "moment";
import { useIntl } from "react-intl";
import { ContentChartWrapped } from "../../Utils";
import { useThemeSelected } from "../../../Hooks/Theme";
import DownloadCSV from "./DownloadCSV";

const HistoryListChart = (props) => {
  const { series, title, isNoShowDataLabel, data } = props;

  const intl = useIntl();
  const theme = useTheme();
  const themeSelected = useThemeSelected();

  const typeChart = data?.typeChart?.value || "line";
  const colors = ['#008ffb', '#00e396', '#feb019', '#ff4560', '#775dd0'];

  const options = {
    chart: {
      background: theme.backgroundBasicColor1,
      id: `hT_LiTby_${props.id}`,
      type: typeChart,
      animations: {
        enabled: true,
        easing: "linear",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
      toolbar: {
        show: !props.activeEdit && !props.isMobile,
        offsetX: -10,
        offsetY: -3,
        export: {
          svg: {
            filename: `sensors_${new Date().toISOString().slice(0, 10)?.replace(/-/g, '')}`,
          },
          png: {
            filename: `sensors_${new Date().toISOString().slice(0, 10)?.replace(/-/g, '')}`,
          }
        }
      },
      zoom: {
        enabled: true,
      },
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
    // colors: props.data?.machines?.map((x) => x.color || theme.colorPrimary500),
    dataLabels: {
      enabled: !isNoShowDataLabel,
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          foreColor: theme.textBasicColor,
          fontFamily: theme.fontFamilyPrimary,
          fontWeight: "600",
        },
        datetimeUTC: false
      },
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      shared: true,
      style: {
        fontSize: "12px",
        fontFamily: theme.fontFamilyPrimary,
      },
      x: {
        show: false,
        formatter: (value) => {
          return moment(value)
            .format(intl.formatMessage({ id: "format.datetime" }));
        },
      },
    },
    yaxis: data?.multiY ? series.map((s, i) => {
      return ({
        opposite: true,
        tickAmount: 3,
        labels: {
          style: {
            colors: colors[i%5],
            fontFamily: theme.fontFamilyPrimary,
          },
          formatter: function(val) {
            return val?.toFixed(1);
          }
        },
        axisTicks: {
          color: colors[i%5],
          show: true,
        },
        axisBorder:
        {
          color: colors[i%5],
          show: true,
        },
      })
    }) : {
      tickAmount: 3,
      labels: {
        style: {
          foreColor: theme.textBasicColor,
          fontFamily: theme.fontFamilyPrimary,
        },
        formatter: function(val) {
          return val !== null && val !== undefined ? val.toFixed(1) : val;
        }
      },
    },
    legend: {
      show: true,
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
    title: {
      text: title,
      align: "center",
      style: {
        fontSize: "12px",
        color: theme.colorBasic600,
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: "400",
      },
    },
    theme: {
      palette: 'palette1',
      mode: themeSelected?.isDark ? 'dark' : 'light'
    },
    grid: {
      show: true,
      strokeDashArray: 2
    },
    stroke: {
      width: 1
    }
  };

  return (
    <ContentChartWrapped noBorder>
      <ReactApexCharts
        key={`hT_LiTby_${props.id}`}
        options={options}
        series={series?.length ? series?.map(x => ({ name: x.name, data: x.data })) : []}
        height="100%"
        width="100%"
        type={typeChart}
      />
      {series?.length >= 1 && <DownloadCSV series={series} />}
    </ContentChartWrapped>
  );
};

export default HistoryListChart;
