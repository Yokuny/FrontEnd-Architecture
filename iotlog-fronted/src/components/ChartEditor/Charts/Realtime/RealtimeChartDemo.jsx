import React from "react";
import { withTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import ApexCharts from "apexcharts";
import moment from "moment";
import { ContainerChart } from "../../Utils";
import { injectIntl } from "react-intl";

let dataOther = [];

const RealtimeChartDemo = (props) => {
  const { title,  height = 200, width = 200 } = props;

  const series = [
    {
      data: [],
    },
  ];

  const options = {
    chart: {
      id: "realtimeDemo",
      type: "line",
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
      foreColor: props.theme.textBasicColor,
      fontFamily: props.theme.fontFamilyPrimary,
    },
    colors: [props.theme.colorPrimary500],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      tickAmount: 6,
      labels: {
        formatter: (value) => {
          return moment(value).format("HH:mm:ss");
        },
        style: {
          foreColor: props.theme.textBasicColor,
          fontFamily: props.theme.fontFamilyPrimary,
        },
      },
    },
    tooltip: {
      enabled: false,
      intersect: true,
      shared: false
    },
    yaxis: {
      labels: {
        style: {
          foreColor: props.theme.textBasicColor,
          fontFamily: props.theme.fontFamilyPrimary,
        },
      },
      title: {
        text: props.intl.formatMessage({ id: 'unit' }),
        style: {
          foreColor: props.theme.textBasicColor,
          fontFamily: props.theme.fontFamilyPrimary,
        },
      }
    },
    legend: {
      show: true,
      foreColor: props.theme.textBasicColor,
      fontFamily: props.theme.fontFamilyPrimary,
    },
    title: {
      text: props.intl.formatMessage({ id: 'realtime' }),
      align: 'center',
      style: {
        foreColor: props.theme.textBasicColor,
        fontFamily: props.theme.fontFamilyPrimary,
        fontWeight: '600'
      },
    }
  };

  React.useLayoutEffect(() => {
    let interval = setInterval(() => {
      dataOther = [...dataOther, [new Date().getTime(), Math.floor(Math.random() * 20)]]
        .reverse()
        .slice(0, 10)
        .reverse();

      ApexCharts.exec("realtimeDemo", "updateSeries", [
        {
          data: dataOther,
        },
      ]);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <ContainerChart height={height} width={width} className="card-shadow pt-4">
        <ReactApexCharts
          options={options}
          series={series}
          height={height - 10}
          width={width - 15}
        />
      </ContainerChart>
    </>
  );
};
const RealtimeChartDemoIntl = injectIntl(RealtimeChartDemo);

export default withTheme(RealtimeChartDemoIntl);
