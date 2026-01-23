import { Popup } from "react-leaflet";
import { connect } from "react-redux";
import PopUpDetails from "./PopUpDetails";
import { setMachineConsume, setMachineDetailsSelected } from "../../../../actions";

const ContentPopUp = (props) => {
  const { machinePropsDetails, positionData } = props;

  const onOpenDetails = () => {
    props.setMachineDetailsSelected(machinePropsDetails)
  }

  const onOpenDetailsConsume = () => {
    props.setMachineConsume(machinePropsDetails)
  }

  const hasPermissionViewConsumeDetails = props.items?.some(
    (x) => x === "/details-consume-fleet"
  );

  const hasPermissionViewCII = props.items?.some(
    (x) => x === "/view-cii-fleet"
  );

  return (<>
    <Popup minWidth={300} className="popup-adjust">
      <PopUpDetails
        positionItem={positionData}
        machineDetails={machinePropsDetails}
        onOpenDetails={onOpenDetails}
        onOpenDetailsConsume={onOpenDetailsConsume}
        hasPermissionViewConsumeDetails={hasPermissionViewConsumeDetails}
        hasPermissionViewCII={hasPermissionViewCII}
      />
    </Popup>
  </>
  )
}

const mapStateToProps = (state) => ({
  machineDetailsSelected: state.fleet.machineDetailsSelected,
  items: state.menu.items,
});

const mapDispatchToProps = (dispatch) => ({
  setMachineDetailsSelected: (machineDetails) => {
    dispatch(setMachineDetailsSelected(machineDetails));
  },
  setMachineConsume: (machineConsumptionSelected) => {
    dispatch(setMachineConsume(machineConsumptionSelected))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ContentPopUp);
