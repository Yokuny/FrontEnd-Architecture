import React from "react";
import { connect } from "react-redux";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { SpinnerFull, Fetch } from "../../../components";
import {
  setListGroup,
} from "../../../actions";
import HeaderGroupDashboard from "./HeaderGroupDashboard";
import Editor from "./../editor";
import ListGroupItens from "./ListGroupItens";
import { Card } from "@paljs/ui";
import styled from "styled-components";

const CardStyled = styled(Card)`
  margin-bottom: 0px;
  height: 100%;

  .expanded {
    max-height: none;
  }
`

const MyGroupDashboard = (props) => {

  const handle = useFullScreenHandle();
  const [isLoading, setIsLoading] = React.useState(false);
  const [dashboardConfig, setDashboardConfig] = React.useState([]);

  const idDashboard = new URL(window.location.href).searchParams.get("id");

  React.useLayoutEffect(() => {
    getLoadingCharts();
    return () => {
      props.setListGroup([]);
    }
  }, []);


  const getLoadingCharts = () => {
    if (idDashboard) {
      setIsLoading(true);
      Fetch.get(`/dashboard/group/list?idDashboard=${idDashboard}`)
        .then((response) => {
          setDashboardConfig(response.data);
          props.setListGroup(response.data?.groupList?.length ? response.data?.groupList : [])
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
        });
    }
  };

  const onPressFullScreen = () => {
    if (handle.active) handle.exit();
    else {
      handle.enter();
    }
  };

  return (
    <>
      <FullScreen handle={handle}>
        <CardStyled>
          <div className="pl-4 pr-4 pt-4">
            <HeaderGroupDashboard
              data={dashboardConfig}
              onPressFullScreen={onPressFullScreen}
              handle={handle}
              status="Basic"
            />
          </div>
          {!isLoading && !!dashboardConfig && !!idDashboard && (
            <ListGroupItens
              idDashboard={idDashboard}
            />
          )}

          <SpinnerFull isLoading={isLoading} />
          <Editor idEnterprise={dashboardConfig?.idEnterprise} />
        </CardStyled>
      </FullScreen>
    </>
  );
};

const mapStateToProps = (state) => ({
  dragEnabled: state.dashboard.dragEnabled
});

const mapDispatchToProps = (dispatch) => ({
  setListGroup: (list) => {
    dispatch(setListGroup(list));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MyGroupDashboard);
