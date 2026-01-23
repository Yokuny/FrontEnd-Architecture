import React from "react";
import ReactApexCharts from "react-apexcharts";
import { connect } from "react-redux";
import { useTheme } from "styled-components";
import { Fetch } from "../../components/Fetch";
import { LoadingCard } from "../../components/Loading";

const PathsDashboard = (props) => {
  const theme = useTheme();

  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState();

  React.useLayoutEffect(() => {
    getData(
      props.periodFilter,
      props.idUsers,
      props.idUsersNotIncluded,
      props.idEnterprise,
      props.usersFilter
    );
  }, [
    props.periodFilter,
    props.idUsers,
    props.idUsersNotIncluded,
    props.idEnterprise,
    props.usersFilter,
  ]);

  const getData = (
    periodFilter,
    idUsers,
    idUsersNotIncluded,
    idEnterprise,
    usersFilter = []
  ) => {
    setIsLoading(true);

    let queryPaths = [`lastPeriodHours=${periodFilter}`];
    if (idUsers?.length || usersFilter?.length)
      queryPaths = [
        ...queryPaths,
        ...idUsers?.filter(x => !usersFilter.includes(x))?.map((x) => `idUsers[]=${x}`),
        ...usersFilter?.map((x) => `idUsers[]=${x}`)
      ]
    if (idUsersNotIncluded?.length)
      queryPaths = [
        ...queryPaths,
        ...idUsersNotIncluded?.map((x) => `idUsersNotIncluded[]=${x}`),
      ];
    if (idEnterprise) queryPaths.push(`idEnterprise=${idEnterprise}`);

    Fetch.get(
      `/tracking/paths?${queryPaths.join(`&`)}`
    )
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const dataSorted = data?.sort((a, b) => b.total - a.total);
  const series = dataSorted?.length ? dataSorted?.map((x) => x.total) : []
  const options = {
    chart: {
      height: 350,
      type: "pie",
      fontFamily: theme.fontFamilyPrimary,
      foreColor: theme.textBasicColor,
    },
    labels: dataSorted?.length ? dataSorted?.map((x) => x.pathname) : [],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 350,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    title: {
      text: `Paths${props.name && ` - ${props.name}`}`,
      style: {
        color: theme.textBasicColor,
        foreColor: theme.textBasicColor,
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
          key={`boolean_pier_user`}
          options={options}
          series={series}
          height="350"
          width="100%"
          type="pie"
        />
      </LoadingCard>
    </>
  );
};

const mapStateToProps = (state) => ({
  usersFilter: state.statistics.usersFilter,
  name: state.statistics.name,
});

export default connect(mapStateToProps, undefined)(PathsDashboard);
