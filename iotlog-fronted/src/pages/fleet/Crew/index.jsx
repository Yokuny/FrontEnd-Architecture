import { connect } from "react-redux";
import { setMachineCrew } from "../../../actions";
import CrewFooter from "./CrewFooter";

const CrewFleet = (props) => {
  return (
    <>
      {props.machineCrewSelected && (
        <>
          <CrewFooter
            key={props.machineCrewSelected?.machine?.id}
            machineDetails={props.machineCrewSelected}
            onClose={() => props.setMachineCrew(undefined)}
          />
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  machineCrewSelected: state.fleet.machineCrewSelected,
});

const mapDispatchToProps = (dispatch) => ({
  setMachineCrew: (machineCrew) => {
    dispatch(setMachineCrew(machineCrew));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CrewFleet);
