import React from "react";
import { connect } from "react-redux";
import ItemMarkerShow from "./ItemMarkerShow";
import ChangeMapToCenter from "./ChangeMapToCenter";
import LastPositionItemMarker from "./LastPositionItemMarker";
import { nanoid } from "nanoid";

const PointPosition = (props) => {
  const { machines, machineConsumptionSelected, machineDetailsSelected, routeBackSelected, isPlaybackRegion } = props;

  if (!machines?.length || !!props.travelDetailsSelected) {
    return <></>;
  }

  const filterPosition = () => {
    if (isPlaybackRegion)
      return []

    if (machineConsumptionSelected) {
      return props.positions?.filter(
        (itemPosition) =>
          itemPosition.idMachine !==
          machineConsumptionSelected?.machine?.id
      )
    }

    if (machineDetailsSelected) {
      return props.positions?.filter(
        (itemPosition) =>
          itemPosition.idMachine ===
          machineDetailsSelected?.machine?.id
      )
    }

    if (routeBackSelected) {
      return []
    }

    return props.positions;
  };

  const dataFiltered = filterPosition();

  return (
    <>
      <ChangeMapToCenter />

      {!!machines?.length &&
        !!dataFiltered?.length &&
        dataFiltered.map((itemPosition) => {

          const machinePropsDetails = machines?.find(
            (x) => x?.machine?.id === itemPosition?.idMachine
          );

          if (props.filterRouter || !!props.machineDetailsSelected) {
            return (
              <LastPositionItemMarker
                key={`lastidM${itemPosition.idMachine}-${nanoid(5)}`}
                machinePropsDetails={machinePropsDetails}
              />
            );
          }

          const courseData = props.courses?.find(
            (x) => x.idMachine === itemPosition.idMachine
          );

          return (
            <ItemMarkerShow
              key={`iPiM-${itemPosition.idMachine}-${nanoid(5)}`}
              positionData={itemPosition}
              courseData={courseData}
              machinePropsDetails={machinePropsDetails}
            />
          );
        })}
    </>
  );
};

const mapStateToProps = (state) => ({
  positions: state.fleet.positions,
  courses: state.fleet.courses,
  machineDetailsSelected: state.fleet.machineDetailsSelected,
  travelDetailsSelected: state.fleet.travelDetailsSelected,
  machineConsumptionSelected: state.fleet.machineConsumptionSelected,
  filterRouter: state.map.filterRouter,
  machines: state.fleet.machines,
  routeBackSelected: state.fleet.routeBackSelected,
  isPlaybackRegion: state.map.isPlaybackRegion,
});

export default connect(mapStateToProps, undefined)(PointPosition);
