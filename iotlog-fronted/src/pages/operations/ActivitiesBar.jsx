import moment from "moment";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useTheme } from "styled-components";

export function ActivitiesBar({ data }) {
  const theme = useTheme();

  const [state] = useState({
    series: [
      {
        data: data.activities.map((activity) => ({
          x: activity.name,
          y: [new Date(activity.startDate).getTime(), new Date(activity.endDate).getTime()],
        })),
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "rangeBar",
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
          dataLabels: {
            hideOverflowingLabels: false,
          },
          barHeight: "80%",
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val, opts) => opts.w.globals.labels[opts.dataPointIndex],
        style: {
          colors: [theme.textBasicColor],
        },
      },
      tooltip: { enabled: false },
      xaxis: {
        labels: {
          formatter: (val) => moment(val).format("DD/MM HH:mm"),
          style: {
            colors: [theme.textHintColor],
          },
        },
        axisBorder: { show: false },
      },
      yaxis: { labels: { show: false } },
      grid: {
        show: false,
      },
    },
  });

  return (
    <div style={{ height: "12rem", overflow: "hidden" }}>
      <ReactApexChart options={state.options} series={state.series} type="rangeBar" height={"100%"} />
    </div>
  );
}
