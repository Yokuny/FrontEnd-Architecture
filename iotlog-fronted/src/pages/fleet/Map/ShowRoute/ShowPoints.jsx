import React from "react";
import { connect } from "react-redux";
import RoutePoints from "./RoutePoints";

const ShowPoints = (props) => {
  const {
    isShowPoints,
    listSelectedPoints,
    routeHistory,
    machineDetailsSelected,
    isShowSequencePoints
  } = props;
  return (
    <>
      {(isShowPoints || !!listSelectedPoints?.length) && (
        <RoutePoints
          routeHistory={routeHistory}
          machineDetailsSelected={machineDetailsSelected}
          listSelectedPoints={listSelectedPoints}
          isShowPoints={isShowPoints}
          isShowSequencePoints={isShowSequencePoints}
          item={props.machineDetailsSelected}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  isShowPoints: state.map.isShowPoints,
  listSelectedPoints: state.fleet.listSelectedPoints,
  machineDetailsSelected: state.fleet.machineDetailsSelected,
  isShowSequencePoints: state.map.isShowSequencePoints,
});

export default connect(mapStateToProps, undefined)(ShowPoints);
