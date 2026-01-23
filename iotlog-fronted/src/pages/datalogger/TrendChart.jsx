import styled, { useTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import moment from "moment";
import { useIntl } from "react-intl";
import { Button, EvaIcon, Tooltip } from "@paljs/ui";
import React from "react";
import { useThemeSelected } from "../../components/Hooks/Theme";
import DownloadCSV from "./DownloadCSV";


const DivView = styled.div`
  position: absolute;
  left: 26px;
  top: 0px;
  z-index: 999;
  display: flex;
  flex-direction: row;

  .rotate {
    transform: rotate(90deg);
  }
`;

const TrendChart = (props) => {
  const { series, title, data } = props;

  const [isNoShowDataLabel, setIsNoShowDataLabel] = React.useState(true);
  const [isMultiColumns, setIsMultiColumns] = React.useState(true);

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
        show: true,
        formatter: (value) => {
          return moment(value)
            .format(intl.formatMessage({ id: "format.datetime" }));
        },
      },
    },
    yaxis: isMultiColumns ? series.map((s, i) => {
      return ({
        opposite: true,
        tickAmount: 4,
        labels: {
          style: {
            colors: colors[i % 5],
            fontFamily: theme.fontFamilyPrimary,
          },
          formatter: function (val) {
            return val?.toFixed(1);
          }
        },
        axisTicks: {
          color: colors[i % 5],
          show: true,
        },
        axisBorder:
        {
          color: colors[i % 5],
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
        formatter: function (val) {
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

  const hasSeries = !!series?.length;
  const seriesShow = hasSeries ? series?.map(x => ({ name: x.name, data: x.data.map(y => [y.timestamp * 1000, y.value]) })) : []

  return (
    <>
      {hasSeries &&
        <DivView>
          <Tooltip
            trigger="hover"
            placement="top"
            content={intl.formatMessage({ id: isMultiColumns ? "all.y.axis" : "value.y.axis" })}
          >
            <Button
              style={{ padding: "2px" }}
              size="Tiny"
              status={isMultiColumns ? "Basic" : "Info"}
              onClick={() => setIsMultiColumns((prevState) => !prevState)}
            >
              <EvaIcon
                name={isMultiColumns ? "bar-chart-outline" : "menu-outline"}
                className={isMultiColumns ? "" : "rotate"}
              />
            </Button>
          </Tooltip>
          <Tooltip
            trigger="hover"
            placement="top"
            content={intl.formatMessage({ id: isNoShowDataLabel ? "view.value" : "view.off.value" })}
          >
            <Button
              style={{ padding: "2px" }}
              size="Tiny"
              className="ml-3"
              status={isNoShowDataLabel ? "Basic" : "Info"}
              onClick={() => setIsNoShowDataLabel((prevState) => !prevState)}
            >
              <EvaIcon
                name={!isNoShowDataLabel ? "eye-off-outline" : "eye-outline"}
              />
            </Button>
          </Tooltip>
          <DownloadCSV
            series={seriesShow}
          />
        </DivView>}
      <ReactApexCharts
        key={`hT_LiTby`}
        options={options}
        series={seriesShow}
        height="98%"
        width="98%"
        type={typeChart}
      />
    </>
  );
};

export default TrendChart;
