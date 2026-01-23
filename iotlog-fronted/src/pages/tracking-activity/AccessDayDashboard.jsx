import { Button, EvaIcon } from "@paljs/ui";
import moment from "moment";
import React from "react";
import ReactApexCharts from "react-apexcharts";
import { useIntl } from "react-intl";
import { useTheme } from "styled-components";
import { Fetch, LoadingCard, TextSpan } from "../../components";
import { getArrayAVG } from "../../components/Utils";

const AccessDayDashboard = (props) => {
  const theme = useTheme();
  const intl = useIntl();

  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState();
  const [showMetrics, setShowMetrics] = React.useState(false);

  React.useLayoutEffect(() => {
    getData();
  }, [props.periodFilter, props.idUsers, props.idEnterprise]);

  const getData = () => {
    setIsLoading(true);
    const idUsers = props.idUsers?.map((x) => `idUsers[]=${x}`);
    const idUsersNotIncluded = props.idUsersNotIncluded?.map(
      (x) => `idUsersNotIncluded[]=${x}`
    );
    const idEnterprise = props.idEnterprise
      ? `&idEnterprise=${props.idEnterprise}`
      : "";
    Fetch.get(
      `/tracking/accessday?lastPeriodHours=${props.periodFilter
      }${idEnterprise}${idUsers?.length ? `&${idUsers.join("&")}` : ""}${idUsersNotIncluded?.length ? `&${idUsersNotIncluded.join("&")}` : ""
      }`
    )
      .then((res) => {
        setIsLoading(false);
        setData(res.data);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const YEAR_MONTH_DAY_SLICE = 10;
  const YEAR_MONTH_SLICE = 7;

  const filterDate = () => {
    if (data.acessDay.length > 60 || data.acessDayWhatsapp.length > 60) {
      return YEAR_MONTH_SLICE;
    }

    return YEAR_MONTH_DAY_SLICE;
  }
  
  const getDays = () => {
    return data?.acessDay?.length || data?.acessDayWhatsapp?.length
      ? [
        ...new Set([
          ...(data?.acessDay?.map((x) => x.date.slice(0, filterDate())) || []),
          ...(data?.acessDayWhatsapp?.map((x) => x.date.slice(0, filterDate())) || []),
        ]),
      ].sort((a, b) => new Date(a) - new Date(b))
      : [];
  };

  const days = getDays();

  const series = days?.length
    ? [
      {
        name: intl.formatMessage({ id: "system" }),
        data: days?.map((x) => data?.acessDay?.filter((y) => y.date.slice(0, filterDate()) === x) || 0),
      },
      {
        name: `WhatsApp`,
        data: days?.map((x) =>data?.acessDayWhatsapp?.filter((y) => y.date.slice(0, filterDate()) === x) || 0),
      },
    ]
    : [];

    const seriesMoth = days?.length
    ? [
      {
        name: intl.formatMessage({ id: "system" }),
        data: series[0].data.map((data) => data.reduce((a, b) => a + b.total, 0)),
      },
      {
        name: `WhatsApp`,
        data: series[1].data.map((data) => data.reduce((a, b) => a + b.total, 0)),
      },
    ]
    : []

  const avgWhatsapp = seriesMoth?.length ? getArrayAVG(seriesMoth[1].data) : 0;
  const avgSystem = seriesMoth?.length ? getArrayAVG(seriesMoth[0].data) : 0;

  const options = {
    chart: {
      id: `access_day`,
      type: "bar",
      stacked: true,
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
        show: false,
      },
      zoom: {
        enabled: true,
      },
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
    colors: [theme.colorPrimary500, theme.colorSuccess500],
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: days?.map((x) =>
        moment(x).format(intl.formatMessage({ id: filterDate() === YEAR_MONTH_DAY_SLICE ? "format.daymonth" : "format.monthyear" }))
      ),
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
      show: true,
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
      onItemClick: {
        toggleDataSeries: true,
      },
    },
    title: {
      text: intl.formatMessage({ id: "access.day" }),
      align: "center",
      style: {
        foreColor: theme.textBasicColor,
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: "600",
        fontSize: "13px",
      },
    },
    annotations: {
      position: "front",
      yaxis: showMetrics ? [
        {
          y: avgWhatsapp,
          borderColor: "#999",
          label: {
            show: true,
            text: `${intl.formatMessage({ id: "average" })} WhatsApp: ${avgWhatsapp}`,
            style: {
              color: "#fff",
              background: theme.colorSuccess700,
            },
          },
        },
        {
          y: avgSystem,
          borderColor: "#999",
          label: {
            show: true,
            text: `${intl.formatMessage({ id: "average" })} System: ${avgSystem}`,
            style: {
              color: "#fff",
              background: theme.colorPrimary700,
            },
          },
        },
      ] : [],
    },
  };

  return (
    <>
      <LoadingCard isLoading={isLoading}>
        <Button
          size="Tiny"
          style={{
            padding: 3,
            marginBottom: -10
          }}
          status={showMetrics ? "Info" : "Basic"}
          onClick={() => setShowMetrics((prevState) => !prevState)}
        >
          <EvaIcon name="trending-up-outline" />
        </Button>
        <ReactApexCharts
          key={`access_day`}
          options={options}
          series={seriesMoth}
          height="350"
          width="100%"
          type="bar"
        />
        <div style={{ marginTop: -15 }}>
          <TextSpan apparence="p3">
            Total {intl.formatMessage({ id: "system" })}:{" "}
            <TextSpan apparence="s3">
              {data?.acessDay?.reduce((a, b) => a + b.total, 0)}
            </TextSpan>
          </TextSpan>
          <br />
          <TextSpan apparence="p3">
            Total WhatsApp:{" "}
            <TextSpan apparence="s3">
              {data?.acessDayWhatsapp?.reduce((a, b) => a + b.total, 0)}
            </TextSpan>
          </TextSpan>
        </div>
      </LoadingCard>
    </>
  );
};

export default AccessDayDashboard;
