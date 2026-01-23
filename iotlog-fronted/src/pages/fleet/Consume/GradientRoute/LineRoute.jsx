import React from "react";
import { Polyline } from "react-leaflet";
import { connect } from 'react-redux';
import { POSITION_DATA_CONSUME } from "../Constants";
import MarkerConsume from "./MarkerConsume";
import { ChangeView } from "../../Map/Utils";

const LineRoute = (props) => {

  const { routeConsumption } = props;


  const routeFiltered = routeConsumption
    ?.filter(x => x[POSITION_DATA_CONSUME.LAT] && x[POSITION_DATA_CONSUME.LON]);

  if (!routeFiltered?.length) return <></>

  return (
    <>
      <Polyline
        positions={routeFiltered?.map(x =>
        ({
          lat: x[POSITION_DATA_CONSUME.LAT],
          lng: x[POSITION_DATA_CONSUME.LON]
        }))}
        color={"red"}
        dashArray={"10,10"}
        lineCap="square"
        weight={3}
      />
      {!!routeFiltered?.length &&
        <ChangeView
          zoom={12}
          center={routeFiltered[routeFiltered.length - 1]
            .slice(POSITION_DATA_CONSUME.LAT, POSITION_DATA_CONSUME.LON + 1)} />
      }
      <MarkerConsume />
    </>
  );
}

const mapStateToProps = (state) => ({
  routeConsumption: state.fleet.routeConsumption,
});

export default connect(
  mapStateToProps,
  undefined
)(LineRoute);
