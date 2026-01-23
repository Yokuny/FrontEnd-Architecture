import { useEffect, useState } from "react";
import { Popup } from "react-leaflet";
import { connect } from "react-redux";
import { setVesselsInFence } from "../../../../actions/fleet.action";
import TrackSimple from "../../TrackSymbol/TrackSimple";
import CardDetailsVessel from "../../SearchThird/CardDetailsVessel";
import { getColorByTypeVessel } from "./Utils";


const VesselsInFence = ({ vesselsInFence }) => {
  const [machines, setMachines] = useState([]);
  useEffect(() => {
    const vessels = vesselsInFence.filter(({ vessel }) => vessel.ais);

    setMachines(vessels);
  }, [vesselsInFence])

  return (
    <>
      {machines.map((machine) => {
        return (
          <TrackSimple
            key={`${machine.imo}_tRak`}
            latitude={machine.vessel.ais.position.latitude}
            longitude={machine.vessel.ais.position.longitude}
            sog={machine.vessel.ais.sog}
            cog={machine.vessel.ais.cog}
            trueHeading={machine.vessel.ais.heading}
            color={getColorByTypeVessel(machine.vessel.segment?.label)}
            aisDimensions={{
              distanceToBow: machine.vessel.aisReport?.dimensions?.toBow || 20,
              distanceToStern: machine.vessel.aisReport?.dimensions?.toStern || 10,
              distanceToStarboard: machine.vessel.aisReport?.dimensions?.toStarboard || 5,
              distanceToPortSide: machine.vessel.aisReport?.dimensions?.toPort || 5,
            }}
          >
            <Popup>
              <CardDetailsVessel
                imo={machine.vessel.imo}
              />
            </Popup>
          </TrackSimple>
        );
      })
      }
    </>
  );
};

const mapStateToProps = (state) => ({
  vesselsInFence: state.fleet.vesselsInFence,
});

const mapDispatchToProps = (dispatch) => ({
  setVesselsInFence: (machines) => {
    dispatch(setVesselsInFence(machines));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VesselsInFence);
