import React from "react";
import ReactApexCharts from "react-apexcharts";
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import { useTheme } from "styled-components";
import { setUserFilterWhatsapp } from "../../actions";
import { Fetch } from "../../components/Fetch";
import { LoadingCard } from "../../components/Loading";
import MachinesMostActionsWhatsappDashboard from './MachinesMostActionsWhatsappDashboard'

const UsersWhatsappDashboard = (props) => {
  const intl = useIntl();
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
      `/tracking/userswhatsapp?${queryPaths.join(`&`)}`
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

  const onClickUser = (indexUser) => {
    const user = dataSorted[indexUser];
    props.setUserFilterWhatsapp({ id: user.idUser, name: user.user });
  }

  const options = {
    legend: {
      show: false,
    },
    chart: {
      id: "treemap_users_whatsapp",
      height: 350,
      type: "treemap",
      toolbar: {
        show: false,
      },
      fontFamily: theme.fontFamilyPrimary,
      foreColor: theme.textBasicColor,
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
    colors: [theme.colorSuccess500],
    title: {
      text: `${intl.formatMessage({ id: "users" })} WhatsApp`,
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
          key={`treemap_users_whatsapp`}
          options={options}
          series={[
            {
              data: dataSorted?.length
                ? dataSorted?.map((x) => ({
                    x: x.user ?? "Não indentificado",
                    y: x.total,
                  }))
                : [],
            },
          ]}
          height="350"
          width="100%"
          type="treemap"
        />
      </LoadingCard>
      {!!props.userFilterWhatsapp && (
        <MachinesMostActionsWhatsappDashboard
          periodFilter={props.periodFilter}
          idUsers={props.idUsers}
          idUsersNotIncluded={props.idUsersNotIncluded}
          idEnterprise={props.idEnterprise}
        />
      )}
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setUserFilterWhatsapp: (users) => {
    dispatch(setUserFilterWhatsapp(users));
  },
});

const mapStateToProps = (state) => ({
  userFilterWhatsapp: state.statistics.userFilterWhatsapp,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersWhatsappDashboard);
