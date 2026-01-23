import React from "react";
import { nanoid } from "nanoid";
import {
  normalizeDataCourse,
  normalizeDataPosition
} from "../../../../components/Utils";
import MarkerComponent from "./MarkerComponent";
import { useSocket } from "../../../../components/Contexts/SocketContext";

const ItemMarkerShow = (props) => {
  const { machinePropsDetails, positionData, courseData } = props;

  const [positionItem, setPosition] = React.useState(positionData);
  const [courseItem, setCourse] = React.useState(courseData);

  const socket = useSocket();

  React.useEffect(() => {
    if (!socket || !machinePropsDetails?.machine?.id) {
      return;
    }
    const idSensors = [
      machinePropsDetails?.config?.idSensorCoordinate,
      machinePropsDetails?.config?.idSensorSpeed,
    ]?.filter((id) => id);

    if (!idSensors.length) {
      return;
    }

    socket.emit("join", {
      topics: idSensors.map((id) => `sensorstate_${id}_${machinePropsDetails?.machine?.id}`)
    });

    if (machinePropsDetails?.config?.idSensorCoordinate) {
      socket.on(
        `sensorstate_${machinePropsDetails?.config?.idSensorCoordinate}_${machinePropsDetails?.machine?.id}`,
        takeDataPosition
      );
    }
    if (machinePropsDetails?.config?.idSensorCourse) {
      socket.on(
        `sensorstate_${machinePropsDetails?.config?.idSensorCourse}_${machinePropsDetails?.machine?.id}`,
        takeDataCourses
      );
    }

    return () => {
      if (socket) {
        socket.emit("leave", {
          topics: idSensors.map((id) => `sensorstate_${id}_${machinePropsDetails?.machine?.id}`)
        });
        socket.off(
          `sensorstate_${machinePropsDetails?.config?.idSensorCoordinate}_${machinePropsDetails?.machine?.id}`,
          takeDataPosition
        );
        socket.off(
          `sensorstate_${machinePropsDetails?.config?.idSensorCourse}_${machinePropsDetails?.machine?.id}`,
          takeDataCourses
        );
      }
    };
  }, [socket, machinePropsDetails]);

  const takeDataPosition = (newCoodinates) => {
    if (newCoodinates?.length) {
      const normalizedPoints = normalizeDataPosition(newCoodinates);
      if (normalizedPoints?.length) {
        const newPositionNormalized = normalizedPoints[0];
        if (
          !positionItem?.date ||
          new Date(newPositionNormalized.date).getTime() > new Date(positionItem.date).getTime()
        ) {
          setPosition(newPositionNormalized);
        }
      }
    }
  };

  const takeDataCourses = (newCourse) => {
    if (newCourse?.length) {
      const normalizedPointsCourses = normalizeDataCourse(newCourse);
      if (normalizedPointsCourses?.length) {
        const newCourseNormalized = normalizedPointsCourses[0];
        if (
          !courseItem?.date ||
          new Date(newCourseNormalized.date).getTime() > new Date(courseItem.date).getTime()
        ) {
          setCourse(newCourseNormalized);
        }
      }
    }
  };

  const headingValue = !courseItem?.course ? -45 : courseItem?.course - 45;

  return (<>
    <MarkerComponent
      key={nanoid(4)}
      positionData={positionItem}
      heading={headingValue}
      machinePropsDetails={machinePropsDetails}
    />
  </>
  );
};


export default ItemMarkerShow;
