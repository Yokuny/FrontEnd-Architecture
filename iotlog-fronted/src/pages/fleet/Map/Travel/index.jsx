import React from "react";
import { connect } from "react-redux";
import { TYPE_MACHINE } from "../../../../constants";
import ShipTravelMarker from "./ShipTravelMarker";
import TruckTravelMarker from "./TruckTravelMarker";

const TravelMarker = (props) => {
  const { travelDetailsSelected, eventTimelineSelect } = props;
  return (
    <>
      {travelDetailsSelected ? (
        <>
          {travelDetailsSelected?.modelMachine?.typeMachine ===
          TYPE_MACHINE.TRUCK ? (
            <TruckTravelMarker travelDetailsSelected={travelDetailsSelected} />
          ) : (
            <ShipTravelMarker
              travelDetailsSelected={travelDetailsSelected}
              eventTimelineSelect={eventTimelineSelect}
            />
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};
const mapStateToProps = (state) => ({
  travelDetailsSelected: state.fleet.travelDetailsSelected,
  eventTimelineSelect: state.fleet.eventTimelineSelect,
});

export default connect(mapStateToProps, undefined)(TravelMarker);
