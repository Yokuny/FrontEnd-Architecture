import { DivIcon } from "leaflet";
import React from "react";
import { Marker } from "react-leaflet";
import moment from "moment";
import CircleRadius from "../CircleRadius";
import TooltipPopUp from "../TooltipPopUp";
import { useTheme } from "styled-components";
import PopUp from "../PopUp";
import { isPositionValid } from "../../../../../components/Utils";
import { handleMachineOnPlataform } from "./Utils";
import { nanoid } from "nanoid";
import TrackSimple from "../../../TrackSymbol/TrackSimple";
import { useSocket } from "../../../../../components/Contexts/SocketContext";

const MovePlatform = ({ data, zoom, machines }) => {
  const theme = useTheme();

  const [position, setPosition] = React.useState({
    date: data.lastDatePosition,
    position: data.position,
  });

  const [course, setCourse] = React.useState({
    date: data.lastDateCourse,
    course: data.course,
  });

  const socket = useSocket();

  React.useEffect(() => {
    if (!socket || !data?.code) {
      return;
    }
    socket.emit("join", {
      topics: [
        `sensorstate_gps_${data.code}`,
        `sensorstate_course_${data.code}`,
      ],
    });

    socket.on(`sensorstate_gps_${data.code}`, takeDataPosition);
    socket.on(`sensorstate_course_${data.code}`, takeDataCourses);

    return () => {
      if (socket) {
        socket.emit("leave", {
          topics: [
            `sensorstate_gps_${data.code}`,
            `sensorstate_course_${data.code}`,
          ],
        });
        socket.off(`sensorstate_gps_${data.code}`, takeDataPosition);
        socket.off(`sensorstate_course_${data.code}`, takeDataCourses);
      }
    };
  }, [socket, data]);

  const takeDataPosition = (newCoodinates) => {
    if (newCoodinates?.length) {
      const newPositionNormalized = newCoodinates[0];
      if (
        !position?.date ||
        moment(newPositionNormalized.date).isAfter(moment(position.date))
      ) {
        setPosition({
          date: newPositionNormalized.date,
          position: newPositionNormalized.value,
        });
      }
    }
  };

  const takeDataCourses = (newCourse) => {
    if (newCourse?.length) {
      const newCourseNormalized = newCourse[0];
      if (
        !course?.date ||
        moment(newCourseNormalized.date).isAfter(moment(course.date))
      ) {
        setCourse({
          date: newCourseNormalized.date,
          course: newCourseNormalized.value,
        });
      }
    }
  };

  const getSize = (zoom) => {
    if (zoom > 14) return 60;
    if (zoom > 10) return 50;
    if (zoom > 8) return 40;
    if (zoom > 5) return 30;
    return 25;
  };

  const size = getSize(zoom);

  const color = machines?.some(
    (machine) =>
      machine.lastState?.coordinate?.length &&
      handleMachineOnPlataform(
        data.position,
        machine.lastState.coordinate,
        data.radius
      )
  )
    ? "#c22dff"
    : theme.colorSuccess500;

  return (
    <>
      {isPositionValid(position.position) && (
        <>
          {zoom !== undefined && zoom > 13
            ? (
              <TrackSimple
                color={color}
                fullColor={true}
                latitude={data.position[0]}
                longitude={data.position[1]}
                sog={0}
                cog={0}
                trueHeading={course?.course || 0}
                aisDimensions={{
                  distanceToBow: data?.ais?.dimensions?.toBow || 150,
                  distanceToStern: data?.ais?.dimensions?.toStern || 200,
                  distanceToStarboard: data?.ais?.dimensions?.toStarboard || 50,
                  distanceToPortSide: data?.ais?.dimensions?.toPort || 30,
                }}
                size={20}
                key={nanoid(5)}
              >
                <TooltipPopUp
                  data={data}
                  course={course?.course}
                  lastDate={course?.date}
                />
                <PopUp data={data} course={course?.course} lastDate={course.date} />
                <CircleRadius key={nanoid(5)} data={data} color={color} />
              </TrackSimple>
            )
            : <Marker
              position={data.position}
              icon={
                new DivIcon({
                  className: "leaflet-div-icon-img-move",
                  iconSize: zoom <= 13 ? [size, size] : [0, 0],
                  html: `<svg style="transform:rotate(${(course?.course - 90) ?? 0
                    }deg)" fill="${color}" x="0px" y="0px" viewBox="0 0 59 10"><path d="M4.61669 9.5V0.5L44.0916 0.5C46.5334 0.5 49.4099 1.30699 51.6835 2.33003C52.8181 2.84055 53.7799 3.39477 54.4488 3.91055C54.7842 4.1691 55.0309 4.40654 55.1893 4.61156C55.3546 4.82554 55.3838 4.95237 55.3838 5C55.3838 5.05518 55.3521 5.18664 55.1878 5.40161C55.0296 5.60858 54.7832 5.84721 54.4482 6.10633C53.7799 6.62333 52.8188 7.17611 51.6843 7.68417C49.4113 8.70215 46.5344 9.5 44.0916 9.5L4.61669 9.5Z" fill="${color}"></path></svg>`,
                })
              }
            >
              <TooltipPopUp
                data={data}
                course={course?.course}
                lastDate={course?.date}
              />
              <PopUp data={data} course={course?.course} lastDate={course.date} />
              <CircleRadius key={nanoid(5)} data={data} color={color} />
            </Marker>}
        </>
      )}
    </>
  );
};

export default MovePlatform;
