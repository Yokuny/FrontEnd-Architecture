import { Button, Checkbox, Col, EvaIcon } from "@paljs/ui";
import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { useTheme } from "styled-components";
import { setFilterMapRouter, setIsShowPoints, setIsShowPreditionRoute, setMapRouter } from "../../../../actions";
import { Divide, LabelIcon, TextSpan } from "../../../../components";
import { FilterData } from "../../../../components/FilterData";
import { getFormatMinMaxDate } from "../../../../components/Utils";

const FilterOptions = (props) => {
  const theme = useTheme();
  const { setFilterMapRouter, machineDetailsSelected, travelDetailsSelected, routeBackSelected } = props;

  React.useLayoutEffect(() => {
    setFilterMapRouter(undefined);
    return () => {
      setFilterMapRouter(undefined);
    };
  }, [machineDetailsSelected, travelDetailsSelected, routeBackSelected, setFilterMapRouter]);

  const getButtonStyle = (isActive = false) => ({
    padding: 0,
    boxShadow: `0px 2px 8px ${theme.shadowColor || "rgba(0, 0, 0, 0.05)"}`,
    border: `1px solid ${theme.borderBasicColor3 || theme.backgroundBasicColor3}`,
    borderRadius: "0.4rem",
    height: "35px",
    width: "35px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease-in-out",
    background: isActive ? theme.colorPrimary500 : theme.backgroundBasicColor1,
    color: isActive ? theme.textControlColor : theme.colorInfo500,
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: `0 6px 12px ${theme.shadowColor || "rgba(0, 0, 0, 0.15)"}`,
    },
  });

  const applyFilter = (filterData) => {
    if (filterData?.isClean) {
      setFilterMapRouter(undefined);
      return;
    }
    setFilterMapRouter(getFormatMinMaxDate(filterData));
  };

  const renderFooter = () => {
    const hasPermissionViewerPredicate = props.items?.some((x) => x === "/view-predicate-route");
    return (
      <>
        <Divide mh="0px" style={{ width: "100%" }} />
        <div className="pl-3 mt-1 mb-2">
          <LabelIcon iconName="eye-outline" title={<FormattedMessage id="display" />} />
          <Col breakPoint={{ md: 12 }}>
            <Checkbox
              className="mt-1"
              checked={props.isShowPoints}
              onChange={() => props.setIsShowPoints(!props.isShowPoints)}>
              <TextSpan apparence="s2">
                <FormattedMessage id="show.points.transmission" />
              </TextSpan>
            </Checkbox>
          </Col>
          {hasPermissionViewerPredicate && (
            <Col breakPoint={{ md: 12 }} className="mb-1">
              <Checkbox
                className="mt-1"
                checked={props.isShowPredicitonRoute}
                onChange={() => props.setIsShowPreditionRoute(!props.isShowPredicitonRoute)}>
                <TextSpan apparence="s2">
                  <FormattedMessage id="view.predicate.route" />
                </TextSpan>
              </Checkbox>
            </Col>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <div>
        <FilterData
          isClassFilter={true}
          key={`fleetFilterT`}
          onApply={applyFilter}
          renderFooter={renderFooter}
          noShowNoInterval={true}
          isShowAllOptions={props.machineDetailsSelected?.modelMachine?.description === "Barge"}>
          <Button
            size="Medium"
            style={getButtonStyle(props.filterRouter)}
            status={props.filterRouter ? "Primary" : "Control"}>
            <EvaIcon
              name={props.filterRouter ? "funnel" : "funnel-outline"}
              options={{
                height: 20,
                width: 20,
                fill: props.filterRouter ? theme.textControlColor : theme.colorInfo500,
              }}
            />
          </Button>
        </FilterData>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  filterRouter: state.map.filterRouter,
  machineDetailsSelected: state.fleet.machineDetailsSelected,
  travelDetailsSelected: state.fleet.travelDetailsSelected,
  isShowPoints: state.map?.isShowPoints,
  isShowPredicitonRoute: state.map.isShowPredicitonRoute,
  items: state.menu.items,
  routeBackSelected: state.fleet.routeBackSelected,
});

const mapDispatchToProps = (dispatch) => ({
  setMapRouter: (router) => {
    dispatch(setMapRouter(router));
  },
  setFilterMapRouter: (filterRouter) => {
    dispatch(setFilterMapRouter(filterRouter));
  },
  setIsShowPoints: (isShowPoints) => {
    dispatch(setIsShowPoints(isShowPoints));
  },
  setIsShowPreditionRoute: (isShow) => {
    dispatch(setIsShowPreditionRoute(isShow));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterOptions);
