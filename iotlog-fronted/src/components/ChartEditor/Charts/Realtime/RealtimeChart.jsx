import ApexCharts from "apexcharts";
import moment from "moment";
import React, { useEffect } from "react";
import ReactApexCharts from "react-apexcharts";
import { withTheme } from "styled-components";
import {
  convertValue,
  normalizeSizeDecimals,
} from "../../OptionsBase/SensorValueUse";
import { ContentChartWrapped } from "../../Utils";
import { floatToStringExtendDot } from "../../../Utils";

function RealtimeChart({ title, data, value, id, description, theme }) {
  const series = React.useRef([]);;

  useEffect(() => {
    const interval = setInterval(() => {
      if (value === undefined) return;
      series.current =
        [
          ...series.current,
          [
            new Date().getTime(),
            normalizeSizeDecimals(
              parseFloat(convertValue(value, data)),
              data?.sizeDecimals
            ),
          ],
        ]
          .reverse()
          .slice(0, 10)
          .reverse();


      ApexCharts.exec(`realtime_${id}`, "updateSeries", [
        {
          data: series.current,
        },
      ]);
    }, 1000);

    return () => {
      if (interval) clearInterval(interval);
    };
  });

  const typeChart = data?.typeChart?.value || "line";

  const options = {
    chart: {
      id: `realtime_${id}`,
      type: typeChart,
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000,
        },
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
    colors: [data.color || theme.colorPrimary500],
    dataLabels: {
      enabled: !!data?.showDataLabel,
      style: {
      fontSize: '0.775rem',
      fontFamily: theme.fontFamilyPrimary,
      fontWeight: 'bold',
      background: {
        enabled: true,
        borderRadius: 8,
      }
  }
    },
    stroke: {
      curve: !!data?.stepline ? "stepline" : "smooth",
      width: 2,
    },
    xaxis: {
      type: "datetime",
      tickAmount: 6,
      labels: {
        formatter: (value) => {
          return moment(value).format("HH:mm:ss");
        },
        style: {
          colors: [theme.textHintColor,theme.textHintColor,theme.textHintColor,theme.textHintColor,theme.textHintColor,theme.textHintColor],
          fontFamily: theme.fontFamilyPrimary,
        },
      },
    },
    tooltip: {
      enabled: false,
      intersect: true,
      shared: false,
    },
    yaxis: {
      tickAmount: 3,
      labels: {
        style: {
          colors: [theme.textHintColor],
          fontFamily: theme.fontFamilyPrimary,
        },
        formatter: (value) => { return value ? floatToStringExtendDot(value, 0) : 0 },
      },
      title: {
        text: description,
        style: {
          color: theme.textHintColor,
          fontFamily: theme.fontFamilyPrimary,
          fontWeight: "500",
          fontSize: 11,
        },
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
        color: theme.textHintColor,
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: "400",
        fontSize: "12px",
      },
    },
    grid: {
      show: true,
      strokeDashArray: 2
    },

  };

  return (
    <ContentChartWrapped>
      <React.StrictMode>
        <ReactApexCharts
          key={`realtime_${id}`}
          options={options}
          series={series.current}
          height="100%"
          width="100%"
          type={typeChart}
        />
      </React.StrictMode>
    </ContentChartWrapped>
  );
}

export default withTheme(RealtimeChart);
