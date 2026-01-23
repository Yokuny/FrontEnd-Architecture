import { nanoid } from "nanoid";
import React from "react";
import { connect } from "react-redux";
import { useTheme } from "styled-components";
import { isPositionValid } from "../../../../components/Utils";
import { getStatusIcon } from "../../Status/Base";
import { getIconStatusOperation } from "../../Status/Utils";
import TrackSymbolMarker from "../../TrackSymbol";
import { useSocket } from "../../../../components/Contexts/SocketContext";

const PointRealSize = (props) => {
  const { machinePropsDetails } = props;

  const [coordinate, setCoordinate] = React.useState({
    date: machinePropsDetails?.lastState?.date || null,
    value: machinePropsDetails?.lastState?.coordinate || [],
  });
  const [course, setCourse] = React.useState({
    date: machinePropsDetails?.lastState?.date || null,
    value: machinePropsDetails?.lastState?.course || null,
  });
  const [heading, setHeading] = React.useState({
    date: machinePropsDetails?.lastState?.date || null,
    value: machinePropsDetails?.lastState?.heading || null,
  });
  const [speed, setSpeed] = React.useState({
    date: machinePropsDetails?.lastState?.date || null,
    value: machinePropsDetails?.lastState?.speed || null,
  });

  const theme = useTheme();
  const socket = useSocket();

  React.useEffect(() => {
    if (!socket || !machinePropsDetails?.machine?.id) {
      return;
    }
    const idSensors = [
      machinePropsDetails?.config?.idSensorCoordinate,
      machinePropsDetails?.config?.idSensorCourse,
      machinePropsDetails?.config?.idSensorHeading,
      machinePropsDetails?.config?.idSensorSpeed,
    ]?.filter((id) => id);

    if (!idSensors.length) {
      return;
    }

    socket.emit("join", {
      topics: idSensors.map(
        (id) => `sensorstate_${id}_${machinePropsDetails?.machine?.id}`
      ),
    });

    if (machinePropsDetails?.config?.idSensorCoordinate) {
      socket.on(
        `sensorstate_${machinePropsDetails?.config?.idSensorCoordinate}_${machinePropsDetails?.machine?.id}`,
        takeDataCoordinate
      );
    }
    if (machinePropsDetails?.config?.idSensorCourse) {
      socket.on(
        `sensorstate_${machinePropsDetails?.config?.idSensorCourse}_${machinePropsDetails?.machine?.id}`,
        takeDataCourses
      );
    }
    if (machinePropsDetails?.config?.idSensorHeading) {
      socket.on(
        `sensorstate_${machinePropsDetails?.config?.idSensorHeading}_${machinePropsDetails?.machine?.id}`,
        takeDataHeading
      );
    }
    if (machinePropsDetails?.config?.idSensorSpeed) {
      socket.on(
        `sensorstate_${machinePropsDetails?.config?.idSensorSpeed}_${machinePropsDetails?.machine?.id}`,
        takeDataSpeed
      );
    }

    return () => {
      if (socket) {
        socket.emit("leave", {
          topics: idSensors.map(
            (id) => `sensorstate_${id}_${machinePropsDetails?.machine?.id}`
          ),
        });
        socket.off(
          `sensorstate_${machinePropsDetails?.config?.idSensorCoordinate}_${machinePropsDetails?.machine?.id}`,
          takeDataCoordinate
        );
        socket.off(
          `sensorstate_${machinePropsDetails?.config?.idSensorCourse}_${machinePropsDetails?.machine?.id}`,
          takeDataCourses
        );
        socket.off(
          `sensorstate_${machinePropsDetails?.config?.idSensorHeading}_${machinePropsDetails?.machine?.id}`,
          takeDataHeading
        );
        socket.off(
          `sensorstate_${machinePropsDetails?.config?.idSensorSpeed}_${machinePropsDetails?.machine?.id}`,
          takeDataSpeed
        );
      }
    };
  }, [socket, machinePropsDetails]);

  const takeDataCoordinate = (newCoordinates) => {
    if (newCoordinates?.length) {
      const positionToAdd = newCoordinates[0];
      if (
        !coordinate?.date ||
        new Date(positionToAdd.date).getTime() >
        new Date(coordinate.date).getTime()
      ) {
        setCoordinate({
          date: positionToAdd.date,
          value: positionToAdd.value,
        });
      }
    }
  };

  const takeDataCourses = (newCogs) => {
    if (newCogs?.length) {
      const cogToAdd = newCogs[0];
      if (
        !course?.date ||
        new Date(cogToAdd.date).getTime() > new Date(course.date).getTime()
      ) {
        setCourse({
          date: cogToAdd.date,
          value: cogToAdd.value,
        });
      }
    }
  };

  const takeDataSpeed = (newSpeeds) => {
    if (newSpeeds?.length) {
      const sogToAdd = newSpeeds[0];
      if (
        !speed?.date ||
        new Date(sogToAdd.date).getTime() > new Date(speed.date).getTime()
      ) {
        setSpeed({
          date: sogToAdd.date,
          value: sogToAdd.value,
        });
      }
    }
  };

  const takeDataHeading = (newHeadings) => {
    if (newHeadings?.length) {
      const headToAdd = newHeadings[0];
      if (
        !heading?.date ||
        new Date(headToAdd.date).getTime() > new Date(heading.date).getTime()
      ) {
        setHeading({
          date: headToAdd.date,
          value: headToAdd.value,
        });
      }
    }
  };

  if (!isPositionValid(coordinate?.value)) {
    return <></>;
  }

  const getStatus = (statusMachine) => {
    return getStatusIcon(statusMachine, theme)?.bgColor;
  };

  const getOperationStatus = (idMachine) => {
    const status = props.operationMachines?.find(
      (operation) => operation?.machine?.id === idMachine
    );

    return status ? theme[getIconStatusOperation(status.value)?.colorTheme] : theme['colorBasic600']
  };

  const color = props?.isNavigationIndicator
    ? getStatus(machinePropsDetails?.lastState?.statusNavigation)
    : props.isOperationIndicator
      ? getOperationStatus(machinePropsDetails.machine.id)
      : machinePropsDetails?.modelMachine?.color || "currentColor";

  return (
    <TrackSymbolMarker
      color={color}
      dataItem={{
        coordinate: coordinate.value,
        course: course.value,
        heading: heading.value,
        speed: speed.value,
        date: coordinate.date,
      }}
      machinePropsDetails={machinePropsDetails}
      showName={props.showName}
      showCode={props.showCode}
      key={nanoid(5)}
    />
  );
};

const mapStateToProps = (state) => ({
  showCode: state.map.showCode,
  showName: state.map.showName,
  isNavigationIndicator: state.map.isNavigationIndicator,
  operationMachines: state.map.operationMachines,
  isOperationIndicator: state.map.isOperationIndicator,
});

export default connect(mapStateToProps, undefined)(PointRealSize);
