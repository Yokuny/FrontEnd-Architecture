import { nanoid } from "nanoid";
import React from "react";
import { connect } from "react-redux";
import ItemMarker from "./ItemMarker";

const ListPoints = (props) => {
  const { machines } = props;

  const filterPosition = () => {
    return props?.machineDetailsSelected
      ? props.positions?.filter(
          (itemPosition) =>
            itemPosition.idMachine ===
            props?.machineDetailsSelected?.machine?.id
        )
      : props.positions;
  };

  return (
    <>
      {!!machines?.length &&
        filterPosition()?.map((itemPosition) => {
          const courseData = props.courses?.find(
            (x) => x.idMachine === itemPosition.idMachine
          );

          const machinePropsDetails = machines?.find(
            (x) => x.machine?.id === itemPosition.idMachine
          );

          return (
            <ItemMarker
              key={nanoid(4)}
              positionData={itemPosition}
              courseData={courseData}
              machinePropsDetails={machinePropsDetails}
            />
          );
        })}
    </>
  );
};

const mapStateToProps = (state) => ({
  positions: state.fleet.positions,
  courses: state.fleet.courses,
  machineDetailsSelected: state.fleet.machineDetailsSelected,
});

export default connect(mapStateToProps, undefined)(ListPoints);
