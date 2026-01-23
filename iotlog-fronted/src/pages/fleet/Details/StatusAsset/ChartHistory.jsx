import React from "react";
import { useTheme } from "styled-components";
import ReactApexCharts from "react-apexcharts";
import moment from "moment";
import { useIntl } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { EvaIcon } from "@paljs/ui/Icon";
import {
  convertUTCDateToLocalDate,
  getArrayAVG,
  getArrayMax,
  getArrayMin,
  normalizeFixedValidInt,
} from "../../../../components/Utils";
import { Fetch } from "../../../../components";
import { FilterData } from "../../../../components/FilterData";
import { connect } from "react-redux";

function ChartHistory(props) {
  const { machine, interval, hourPosition, filterRouter } = props;

  const theme = useTheme();
  const intl = useIntl();

  const [showMetrics, setShowMetrics] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState([]);

  React.useEffect(() => {
    const dateTimeStart = filterRouter?.min
      ? {
        dateInit: moment(filterRouter?.min).format("YYYY-MM-DD"),
        timeInit: moment(filterRouter?.min).format("HH:mm")
      }
      : {
        dateInit: moment().subtract(hourPosition, 'hours').format("YYYY-MM-DD"),
        timeInit: moment().subtract(hourPosition, 'hours').format("HH:mm")
      }

    const dateTimeEnd = filterRouter?.max
      ? {
        dateEnd: moment(filterRouter?.max).format("YYYY-MM-DD"),
        timeEnd: moment(filterRouter?.max).format("HH:mm")
      }
      : {
        dateEnd: moment().format("YYYY-MM-DD"),
        timeEnd: moment().format("HH:mm")
      }

    getData({
      ...dateTimeStart,
      ...dateTimeEnd,
      interval: undefined,
    });
  }, [interval, hourPosition, filterRouter]);

  const getData = ({ interval, dateInit, dateEnd, timeInit, timeEnd }) => {
    setIsLoading(true);
    const intervalQuery =
      interval === "noInterval"
        ? `&noInterval=true`
        : `&interval=${interval || 30}`;

    Fetch.get(
      `/travel/machine/speedhistory?idMachine=${machine?.id}&min=${moment(
        dateInit
      ).format("YYYY-MM-DD")}T${timeInit || "00:00"}:00${moment(
        dateInit
      ).format("Z")}&max=${moment(dateEnd).format(
        "YYYY-MM-DD"
      )}T${timeEnd}:59${moment(dateEnd).format("Z")}${intervalQuery}`
    )
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setData([]);
        setIsLoading(false);
      });
  };

  let series = [
    {
      name: intl.formatMessage({ id: "speed" }),
      data:
        data?.map((z) => {
          return [
            convertUTCDateToLocalDate(new Date(z[0] * 1000)),
            z[1],
          ];
        }) || [],
    },
  ];

  const metrics = showMetrics &&
    series[0]?.data?.length && {
    min: normalizeFixedValidInt(
      getArrayMin(series[0]?.data?.map((x) => x[1]))
    ),
    max: normalizeFixedValidInt(
      getArrayMax(series[0]?.data?.map((x) => x[1]))
    ),
    avg: normalizeFixedValidInt(
      getArrayAVG(series[0]?.data?.map((x) => x[1]))
    ),
  };

  const options = {
    chart: {
      id: `history_speed_${machine?.id}`,
      type: "line",
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
        autoSelected: "zoom",
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: true,
        },
        export: {
          csv: {
            filename: `${machine.code ?? machine.name
              }_history_speed_${moment().format("YYYYMMDDHHmmss")}`,
          },
          svg: {
            filename: `${machine.code ?? machine.name
              }_history_speed_${moment().format("YYYYMMDDHHmmss")}`,
          },
          png: {
            filename: `${machine.code ?? machine.name
              }_history_speed_${moment().format("YYYYMMDDHHmmss")}`,
          },
        },
      },
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true,
      },
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
    colors: [theme.colorPrimary500],
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "datetime",
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
      x: {
        formatter: (value) => {
          return moment(value).utc().format("DD MMM HH:mm");
        },
      },
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
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
    title: {
      text: intl.formatMessage({ id: "speed" }),
      align: "center",
      style: {
        foreColor: theme.textBasicColor,
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: "600",
        fontSize: "13px",
      },
    },
    stroke: {
      width: 3
    },
    annotations: {
      position: "front",
      yaxis: metrics
        ? [
          {
            y: metrics.max,
            borderColor: "#999",
            label: {
              show: true,
              text: `${intl.formatMessage({ id: "max.value" })}: ${metrics.max
                }`,
              style: {
                color: "#fff",
                background: theme.colorDanger500,
              },
            },
          },
          {
            y: metrics.avg,
            borderColor: "#999",
            label: {
              show: true,
              text: `${intl.formatMessage({ id: "average" })}: ${metrics.avg
                }`,
              style: {
                color: "#fff",
                background: theme.colorSuccess500,
              },
            },
          },
          {
            y: metrics.min,
            borderColor: "#999",
            label: {
              show: true,
              text: `${intl.formatMessage({ id: "min.value" })}: ${metrics.min
                }`,
              style: {
                color: "#fff",
                background: theme.colorWarning500,
              },
            },
          },
        ]
        : [],
    },
  };

  return (
    <>
      <FilterData
        styleSpinner={{ left: 90, top: -5 }}
        isLoading={isLoading}
        onApply={getData}
        key={`speed_chart_${machine?.id}`}
      >
        <Button
          size="Tiny"
          style={{
            padding: 3,
            position: "absolute",
            left: 18,
            top: 0,
            zIndex: 1299,
          }}
          status="Basic"
        >
          <EvaIcon name="funnel-outline" />
        </Button>
      </FilterData>
      <Button
        size="Tiny"
        style={{
          padding: 3,
          position: "absolute",
          left: 55,
          top: 0,
          zIndex: 1299,
        }}
        status={showMetrics ? "Primary" : "Basic"}
        onClick={() => setShowMetrics((prevState) => !prevState)}
      >
        <EvaIcon name="trending-up-outline" />
      </Button>
      <ReactApexCharts
        key={`history_speed_${machine?.id}`}
        options={options}
        series={series}
        width="97%"
        height="250"
        type="line"
      />
    </>
  );
}

const mapStateToProps = (state) => ({
  interval: state.map.router?.interval,
  hourPosition: state.map.router?.hourPosition,
  filterRouter: state.map.filterRouter,
});

export default connect(mapStateToProps, undefined)(ChartHistory);
