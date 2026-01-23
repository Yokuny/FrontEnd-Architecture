import React from "react";
import { useTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import { ContentChartWrapped } from "../../Utils";
import { normalizeSizeDecimals } from "../../OptionsBase/SensorValueUse";

const GroupChart = (props) => {
  const { sensorStates, title } = props;

  const theme = useTheme();

  const machines = props.data?.machines?.map(
    (x) => x.description || x.machine?.label
  );

  const valueToShow = props.data?.machines?.map((x) => {
    const valueSignalFinded = sensorStates?.length
      ? (
          sensorStates.find((y) => y.idMachine === x.machine?.value)?.value
        )
      : 0;

    return normalizeSizeDecimals(valueSignalFinded ? valueSignalFinded.value : 0, x.sizeDecimals);
  });

  const series = [
    {
      data: valueToShow,
    },
  ];

  const typeChart = props.data?.typeChart?.value || "bar";

  const options = {
    chart: {
      id: `group_${props.id}`,
      type: typeChart,
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000,
        },
      },
      toolbar: {
        show: !props.activeEdit && !props.isMobile,
      },
      zoom: {
        enabled: false,
      },
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
    colors: [...props.data?.machines?.map(x => x.color)],
    plotOptions: {
      bar: {
        columnWidth: `${props.data?.sizeColumn > 0 ? props.data?.sizeColumn : 45}%`,
        distributed: true,
      }
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: machines || [],
      labels: {
        style: {
          foreColor: theme.textBasicColor,
          fontFamily: theme.fontFamilyPrimary,
          fontWeight: "600",
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
          foreColor: theme.textBasicColor,
          fontFamily: theme.fontFamilyPrimary,
        },
      },
    },
    legend: {
      show: false,
    },
    title: {
      text: title,
      align: "center",
      style: {
        foreColor: theme.textBasicColor,
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: "600",
        fontSize: "13px",
      },
    },
  };

  return (
    <ContentChartWrapped>
      <ReactApexCharts
        key={`realtime_${props.id}`}
        options={options}
        series={series}
        type={typeChart}
        width="100%"
        height="100%"
      />
    </ContentChartWrapped>
  );
};

export default GroupChart;
