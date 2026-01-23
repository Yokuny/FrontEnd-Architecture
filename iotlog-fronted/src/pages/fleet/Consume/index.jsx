import { connect } from "react-redux";
import { setMachineConsume } from "../../../actions";
import FilterOptions from "../Map/ShowRoute/FilterOptions";
import FooterContentConsume from "./FooterContent";

const ConsumeFleet = (props) => {
  return (
    <>
      {props.machineConsumptionSelected && (
        <>
        <FooterContentConsume
          key={props.machineConsumptionSelected?.machine?.id}
          machineDetails={props.machineConsumptionSelected}
          onClose={() => props.setMachineConsume(undefined)}
        />
        <FilterOptions />
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  machineConsumptionSelected: state.fleet.machineConsumptionSelected,
});

const mapDispatchToProps = (dispatch) => ({
  setMachineConsume: (machineConsumptionSelected) => {
    dispatch(setMachineConsume(machineConsumptionSelected));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ConsumeFleet);
