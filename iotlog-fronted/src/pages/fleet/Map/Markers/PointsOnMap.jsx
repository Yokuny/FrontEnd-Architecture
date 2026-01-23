import React from "react";
import { connect } from "react-redux";
import { FeatureGroup, useMap, useMapEvents } from "react-leaflet";
import PointRealSize from "./PointRealSize";
import { ChangeView } from "../Utils";
import { useIntl } from "react-intl";
import { deinitialize, initialize, markerList, removeAllPolyline } from "./tooltiplayout";

const PointsOnMap = (props) => {
  const { machines,
    travelDetailsSelected,
    machineConsumptionSelected,
    machineDetailsSelected,
    isPlaybackRegion,
    routeBackSelected,
    lastMarker,
    isShowAIS } = props;

  const map = useMap();

  function onPolylineCreated(ply) {
    ply.setStyle({
      color: '#90A4AE'
    })
  }

  const mapEvents = useMapEvents({
    zoomend: () => {
      const boxes = Array.from(map.getPanes()["tooltipPane"].children);
      for (let i = 0; i < boxes.length; i++) {
        const el1 = boxes[i];
        el1.style.top = "0px";
        el1.style.left = "0px";
      }
    },
  });

  const filterMachines = () => {
    if (isPlaybackRegion)
      return []

    if (machineConsumptionSelected) {
      return machines?.filter(
        (itemMachine) =>
          itemMachine?.machine?.id ===
          machineConsumptionSelected?.machine?.id
      )
    }

    if (machineDetailsSelected) {
      return machines?.filter(
        (itemMachine) =>
          itemMachine?.machine?.id ===
          machineDetailsSelected?.machine?.id
      )
    }

    if (routeBackSelected) {
      return []
    }

    return machines;
  };

    // eslint-disable-next-line
  const filteredMachines = React.useMemo(() => filterMachines(), [
    machines,
    isPlaybackRegion,
    machineConsumptionSelected,
    machineDetailsSelected,
    routeBackSelected,
  ]);


  React.useEffect(() => {
    if (filteredMachines?.length && (props.showName)) {
      removeAllPolyline(map);
      deinitialize(map);
      setTimeout(() => initialize(map, markerList, onPolylineCreated), 1000);
    } else if (!props.showName) {
      removeAllPolyline(map);
      deinitialize(map);
      while (markerList.length > 0) {
        markerList.pop();
      }
    }
    // eslint-disable-next-line
  }, [filteredMachines, props.showName, props.showCode]);

  if (isShowAIS || !machines?.length || !!travelDetailsSelected) {
    return <></>;
  }

  return (
    <>
      <FeatureGroup>
        {filteredMachines?.map((itemMachine) =>
          <PointRealSize
            key={itemMachine?.machine?.id}
            machinePropsDetails={lastMarker?.idMachine &&
              itemMachine?.machine?.id === lastMarker?.idMachine
              ? {
                ...itemMachine, lastState: {
                  ...itemMachine?.lastState,
                  course: lastMarker?.course,
                  heading: lastMarker?.course,
                  date: lastMarker.date,
                  coordinate: lastMarker?.position
                }
              }
              : itemMachine}
          />)}
      </FeatureGroup>
      {!!lastMarker?.position?.length &&
        !!lastMarker.position.every(x => x !== null && x !== undefined) &&
        <ChangeView
          zoom={16}
          center={lastMarker.position} />}
    </>
  );
};

const mapStateToProps = (state) => ({
  machines: state.fleet.machines,
  isShowAIS: state.map.isShowAIS,
  lastMarker: state.fleet.lastMarker,
  machineDetailsSelected: state.fleet.machineDetailsSelected,
  travelDetailsSelected: state.fleet.travelDetailsSelected,
  machineConsumptionSelected: state.fleet.machineConsumptionSelected,
  routeBackSelected: state.fleet.routeBackSelected,
  isPlaybackRegion: state.map.isPlaybackRegion,
  showCode: state.map.showCode,
  showName: state.map.showName,
});

export default connect(mapStateToProps, undefined)(PointsOnMap);
