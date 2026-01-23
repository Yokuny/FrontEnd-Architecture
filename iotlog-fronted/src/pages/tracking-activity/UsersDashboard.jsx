import React from "react";
import ReactApexCharts from "react-apexcharts";
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import { useTheme } from "styled-components";
import { setUsersFilter } from "../../actions";
import { Fetch } from "../../components/Fetch";
import { LoadingCard } from "../../components/Loading";

const UsersDashboard = (props) => {
  const intl = useIntl();
  const theme = useTheme();

  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState();

  React.useLayoutEffect(() => {
    getData(
      props.periodFilter,
      props.idUsers,
      props.idUsersNotIncluded,
      props.idEnterprise
    );
  }, [
    props.periodFilter,
    props.idUsers,
    props.idUsersNotIncluded,
    props.idEnterprise,
  ]);

  const getData = (periodFilter, idUsers, idUsersNotIncluded, idEnterprise) => {
    setIsLoading(true);
    let queryPaths = [`lastPeriodHours=${periodFilter}`];
    if (idUsers?.length)
      queryPaths = [...queryPaths, ...idUsers?.map((x) => `idUsers[]=${x}`)];
    if (idUsersNotIncluded?.length)
      queryPaths = [
        ...queryPaths,
        ...idUsersNotIncluded?.map((x) => `idUsersNotIncluded[]=${x}`),
      ];
    if (idEnterprise) queryPaths.push(`idEnterprise=${idEnterprise}`);
    Fetch.get(`/tracking/users?${queryPaths.join(`&`)}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const dataSorted = data?.sort((a, b) => b.total - a.total);

  const onClickUser = (indexUser) => {
    const user = dataSorted[indexUser];
    if (user?.user !== 'Fleet intranet')
    props.setUsersFilter([{ id: user.idUser, name: user.user }]);
  };

  const series = [
    {
      data: dataSorted?.length
        ? dataSorted?.map((x) => ({
            x: x.user ?? "Fleet intranet",
            y: x.total,
          }))
        : [],
    },
  ];

  const options = {
    legend: {
      show: false,
    },
    chart: {
      id: "treemap_users",
      height: 350,
      type: "treemap",
      fontFamily: theme.fontFamilyPrimary,
      foreColor: theme.textBasicColor,
      toolbar: {
        show: false,
      },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          onClickUser(config.dataPointIndex);
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
    title: {
      text: intl.formatMessage({ id: "users" }),
      style: {
        foreColor: theme.textBasicColor,
        color: theme.textBasicColor,
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: "600",
        fontSize: "15px",
      },
    },
  };

  return (
    <>
      <LoadingCard isLoading={isLoading}>
        <ReactApexCharts
          key={`treemap_users`}
          options={options}
          series={series}
          height="350"
          width="100%"
          type="treemap"
        />
      </LoadingCard>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setUsersFilter: (users) => {
    dispatch(setUsersFilter(users));
  },
});

export default connect(undefined, mapDispatchToProps)(UsersDashboard);
