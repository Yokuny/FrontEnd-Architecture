import { connect } from "react-redux";
import InfoContactFooter from "./InfoContactFooter";
import { setMachineContactSelected } from "../../../../actions";

const InfoContact = (props) => {
  return (
    <>
      {props.machineContactSelected && (
        <>
          <InfoContactFooter
            key={props.machineContactSelected?.machine?.id}
            machineDetails={props.machineContactSelected}
            onClose={() => props.setMachineContactSelected(undefined)}
          />
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  machineContactSelected: state.fleet.machineContactSelected,
});

const mapDispatchToProps = (dispatch) => ({
  setMachineContactSelected: (machineInfoSelected) => {
    dispatch(setMachineContactSelected(machineInfoSelected));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(InfoContact);
