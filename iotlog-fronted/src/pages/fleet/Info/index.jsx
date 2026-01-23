import { connect } from "react-redux";
import { setMachineInfoSelected } from "../../../actions";
import InfoFooter from "./InfoFooter";

const InfoAsset = (props) => {
  return (
    <>
      {props.machineInfoSelected && (
        <>
          <InfoFooter
            key={props.machineInfoSelected?.machine?.id}
            machineDetails={props.machineInfoSelected}
            onClose={() => props.setMachineInfoSelected(undefined)}
          />
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  machineInfoSelected: state.fleet.machineInfoSelected,
});

const mapDispatchToProps = (dispatch) => ({
  setMachineInfoSelected: (machineInfoSelected) => {
    dispatch(setMachineInfoSelected(machineInfoSelected));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(InfoAsset);
