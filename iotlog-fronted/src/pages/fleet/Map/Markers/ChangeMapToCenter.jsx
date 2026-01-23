import React from "react";
import { useMap } from "react-leaflet";
import { connect } from "react-redux";
import { getLatLonNormalize } from "../../../../components/Utils";

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const CenterSelected = (props) => {
  const [selectedCenter, setSelectedCenter] = React.useState([]);

  React.useEffect(() => {
    let time;
    if (props.machineDetailsSelected) {
      time = getCenter(props.machineDetailsSelected);
    }
    if (props.machineConsumptionSelected) {
      time = getCenter(props.machineConsumptionSelected);
    }

    return () => {
      if (time) clearTimeout(time);
    };
  }, [props.machineDetailsSelected, props.machineConsumptionSelected]);

  const getCenter = (detailsSelected) => {
    const data = props.positions?.find(
      (x) => x.idMachine === detailsSelected?.machine?.id
    )?.position;

    if (!data) return;

    const center = getLatLonNormalize(data);
    setSelectedCenter(center);
    return setTimeout(() => {
      setSelectedCenter([]);
    }, 1000);
  };

  return (
    <>
      {!!selectedCenter?.length && (
        <ChangeView center={selectedCenter} zoom={14} />
      )}
      {!!props?.listSelectedPoints?.position?.value?.length && (
        <ChangeView
          center={props?.listSelectedPoints?.position?.value}
          zoom={15}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  positions: state.fleet.positions,
  machineDetailsSelected: state.fleet.machineDetailsSelected,
  machineConsumptionSelected: state.fleet.machineConsumptionSelected,
  listSelectedPoints: state.fleet.listSelectedPoints,
});

export default connect(mapStateToProps, undefined)(CenterSelected);
