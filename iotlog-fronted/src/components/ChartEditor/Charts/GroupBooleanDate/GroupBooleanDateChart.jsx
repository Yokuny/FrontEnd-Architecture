import React from "react";
import { useTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import {
  ContentChartWrapped,
  urlRedirect,
} from "../../Utils";
import { useIntl } from "react-intl";
import moment from "moment";

const GroupBooleanDateChart = (props) => {
  const { countSignalsTrue, title } = props;

  const theme = useTheme();
  const intl = useIntl();

  const typeChart = props.data?.typeChart?.value || "bar";

  const series = [
    {
      data: countSignalsTrue?.map((x) => x.total),
    },
  ];

  const getTitle = (typeDate) => {
    switch (typeDate) {
      case "day":
        return intl.formatMessage({ id: "daily" });
      case "week":
        return intl.formatMessage({ id: "weekly" });
      case "month":
        return intl.formatMessage({ id: "monthly" });
      default:
        return "";
    }
  };

  const getCategories = (typeDate, itens) => {
    switch (typeDate) {
      case "day":
        return itens.map((x) =>
          moment(x.date).format(intl.formatMessage({ id: "format.daymonth" }))
        );
      case "week":
        return itens.map((x) => {
          let week = moment().year(x.year).isoWeek(x.week);
          return `${week
            .startOf("week")
            .format(intl.formatMessage({ id: "format.daymonth" }))}
          -
          ${week
            .endOf("week")
            .format(intl.formatMessage({ id: "format.daymonth" }))}`;
        });
      case "month":
        return itens.map((x) =>
          moment(`${x.year}-${x.month}-01`).format(
            intl.formatMessage({ id: "format.monthyear" })
          )
        );
      default:
        return [];
    }
  };

  const options = {
    chart: {
      id: `boolean_group_date${props.id}`,
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
      events: {
        dataPointSelection: (event, chartContext, { dataPointIndex }) => {
          if (props.data.link) {
            const item = countSignalsTrue[dataPointIndex];
            const query = Object.keys(item).map((x) => `${x}=${item[x]}`);
            urlRedirect(
              `${props.data.link}&type=${
                props.data.typeDate?.value
              }&${query.join("&")}`
            );
          }
        },
      },
    },
    colors: [props.data.color || theme.colorPrimary500],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: getCategories(props.data?.typeDate?.value, countSignalsTrue),
      labels: {
        style: {
          foreColor: theme.textBasicColor,
          fontFamily: theme.fontFamilyPrimary,
          fontWeight: "600",
        },
      },
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      style: {
        fontSize: "12px",
        fontFamily: theme.fontFamilyPrimary,
      },
      y: {
        title: {
          formatter: (seriesName) => "",
        },
      },
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
      text: `${title ? `${title} - ` : ""}${getTitle(
        props.data?.typeDate?.value
      )}`,
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
    <ContentChartWrapped noShadow>
      <ReactApexCharts
        key={`boolean_group_date${props.id}`}
        options={options}
        series={series}
        height="100%"
        width="100%"
        type={typeChart}
      />
    </ContentChartWrapped>
  );
};

export default GroupBooleanDateChart;
