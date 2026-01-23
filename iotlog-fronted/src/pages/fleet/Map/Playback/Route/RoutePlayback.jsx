import React from "react";
import { connect } from "react-redux";
import { isPositionValid } from "../../../../../components/Utils";
import { Polyline } from "react-leaflet";
import "leaflet.marker-motion/src/MarkerMotion";
import MovingMarker from "./MovingMarker";

const RoutePlayback = (props) => {
  const { routeBackSelected, routeHistory } = props;

  if (routeBackSelected && routeHistory?.length) {
    const findFirst = routeHistory?.find(x => x[0] >= (props.playback.time / 1000))
    if (!findFirst) {
      return <></>
    }

    const routeHistoryPositions = routeHistory.map(item => [item[1], item[2], item[0]]);

    return <>
      <MovingMarker
        route={routeHistoryPositions}
        color={props.routeBackSelected?.modelMachine?.color}
      />
      <Polyline
        positions={routeHistory?.filter(x => isPositionValid(x.slice(1, 3)))?.map(x =>
        ({
          lat: x[1],
          lng: x[2]
        }))}
        color={"black"}
        dashArray={"10,10"}
        lineCap="round"
        weight={2}
      />
    </>
  }

  return (
    <>

    </>
  );
};

const mapStateToProps = (state) => ({
  routeBackSelected: state.fleet.routeBackSelected,
  playback: state.map.playback,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(RoutePlayback);
