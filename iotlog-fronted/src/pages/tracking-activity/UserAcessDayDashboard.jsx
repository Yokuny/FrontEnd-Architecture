import moment from "moment";
import React from "react";
import ReactApexCharts from "react-apexcharts";
import { useIntl } from "react-intl";
import { useTheme } from "styled-components";
import { Fetch, LoadingCard, TextSpan } from "../../components";
import { Button, EvaIcon } from "@paljs/ui";
import { getArrayAVG } from "../../components/Utils";

const UserusersDayDashboard = (props) => {
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
      `/tracking/useraccessday?lastPeriodHours=${props.periodFilter
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
    if (data.usersDay.length > 60 || data.usersDayWhatsapp.length > 60) {
      return YEAR_MONTH_SLICE;
    }

    return YEAR_MONTH_DAY_SLICE;
  }
  
  const getDays = () => {
    return data?.usersDay?.length || data?.usersDayWhatsapp?.length
      ? [
        ...new Set([
          ...(data?.usersDay?.map((x) => x.date.slice(0, filterDate())) || []),
          ...(data?.usersDayWhatsapp?.map((x) => x.date.slice(0, filterDate())) || []),
        ]),
      ].sort((a, b) => new Date(a) - new Date(b))
      : [];
  };

  const days = getDays();

  const seriesShow = days?.length
    ? [
      {
        name: intl.formatMessage({ id: "system" }),
        data: days?.map(
          (x) =>
            data?.usersDay?.find((y) => y.date.slice(0, filterDate()) === x)?.total || 0
        ),
      },
      {
        name: `WhatsApp`,
        data: days?.map(
          (x) =>
            data?.usersDayWhatsapp?.find((y) => y.date.slice(0, filterDate()) === x)?.total || 0
        ),
      },
    ]
    : []

  const avgWhatsapp = seriesShow?.length ? getArrayAVG(seriesShow[1].data) : 0;
  const avgSystem = seriesShow?.length ? getArrayAVG(seriesShow[0].data) : 0;

  const options = {
    chart: {
      id: `user_access_day`,
      type: "bar",
      fontFamily: theme.fontFamilyPrimary,
      foreColor: theme.textBasicColor,
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
      }
    },
    colors: [theme.colorWarning500, theme.colorSuccess500],
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
    },
    title: {
      text: `${intl.formatMessage({ id: "users" })}`,
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
          y: avgSystem,
          borderColor: "#999",
          label: {
            show: true,
            text: `${intl.formatMessage({ id: "average" })} System: ${avgSystem}`,
            style: {
              color: "#fff",
              background: theme.colorWarning700,
            },
          },
        },
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
          key={`user_access_day`}
          options={options}
          series={seriesShow}
          height="350"
          width="100%"
          type="bar"
        />
        <div style={{ marginTop: -15 }}>
          <TextSpan apparence="p3">
            Total {intl.formatMessage({ id: "system" })}:{" "}
            <TextSpan apparence="s3">
              {data?.usersDay?.reduce((a, b) => a + b.total, 0)}
            </TextSpan>
          </TextSpan>
          <br />
          <TextSpan apparence="p3">
            Total WhatsApp:{" "}
            <TextSpan apparence="s3">
              {data?.usersDayWhatsapp?.reduce((a, b) => a + b.total, 0)}
            </TextSpan>
          </TextSpan>
        </div>
      </LoadingCard>
    </>
  );
};

export default UserusersDayDashboard;
