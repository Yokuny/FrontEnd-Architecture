import { connect } from "react-redux";
import { TYPE_MACHINE } from "../../../../constants";
import RouterOptions from "./RouterOptions";
import ShipRoute from "./TypeRoute/ShipRoute";
import TruckRoute from "./TypeRoute/TruckRoute";
import React from "react";
import FilterOptions from "./FilterOptions";
import PredicateRoute from "./Predicate";
import RouteIntegration from "./Integration/RouteIntegration";

const ControlShowRoute = (props) => {

  const hasPermissionViewerPredicate = props.items?.some((x) => x === "/view-predicate-route");

  return (
    <>
      {props.machineDetailsSelected && (
        <>
          <FilterOptions />
          <RouterOptions />

          {props.machineDetailsSelected?.modelMachine?.typeMachine ===
          TYPE_MACHINE.TRUCK ? (
            <TruckRoute key={props.machineDetailsSelected?.machine?.id} />
          ) : (
            <ShipRoute key={props.machineDetailsSelected?.machine?.id} />
          )}
          {hasPermissionViewerPredicate && props.isShowPredicitonRoute && <PredicateRoute
            idMachine={props.machineDetailsSelected?.machine?.id}
          />}
        </>
      )}
      <RouteIntegration />
    </>
  );
};

const mapStateToProps = (state) => ({
  machineDetailsSelected: state.fleet.machineDetailsSelected,
  items: state.menu.items,
  isShowPredicitonRoute: state.map.isShowPredicitonRoute,
});

export default connect(mapStateToProps, undefined)(ControlShowRoute);
