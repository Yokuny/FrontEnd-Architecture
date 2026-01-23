import React from "react";
import { connect } from "react-redux";
import { Buffer } from 'buffer';
import {
  setMachineDetailsSelected
} from "../../actions";
import ItemStatusMachine from "./Status/ItemStatusMachine";

const ListAsset = (props) => {

  React.useLayoutEffect(() => {
    verifyQueryInput()
  }, []);

  const verifyQueryInput = () => {
    try {
    const request = new URL(window.location.href).searchParams.get("request");
    const hasRequest = Buffer.from(request, "hex").toString()?.split("|")[0];
    if (hasRequest && props.machines?.length)
      openMachine(props.machines[0]);
    }
    catch {

    }
  }

  const openMachine = (item) => {
    props.setMachineDetailsSelected(item);
  };

  return (
    <>
      {props.machines?.map((item, index) => (
        <ItemStatusMachine
          key={`machine-${index}-row`}
          onClick={() => openMachine(item)}
          item={item}
        />
      ))}
    </>
  );
};

const mapStateToProps = (state) => ({
  machines: state.fleet.machines,
});

const mapDispatchToProps = (dispatch) => ({
  setMachineDetailsSelected: (machineDetails) => {
    dispatch(setMachineDetailsSelected(machineDetails));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ListAsset);
