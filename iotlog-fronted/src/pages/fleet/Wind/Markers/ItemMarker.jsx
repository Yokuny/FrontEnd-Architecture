import { DivIcon, Icon } from "leaflet";
import moment from "moment";
import React from "react";
import { connect } from "react-redux";
import { useIntl } from "react-intl";
import {
  getLatLonNormalize,
  normalizeDataCourse,
  normalizeDataPosition,
} from "../../../../components/Utils";
import { setMachineDetailsSelected } from "../../../../actions";
import { useSocket } from "../../../../components/Contexts/SocketContext";

var mapMarkers = [];

const ItemMarker = (props) => {
  const { machinePropsDetails, positionData, courseData } = props;

  const intl = useIntl()

  const [positionItem, setPosition] = React.useState(positionData);
  const [courseItem, setCourse] = React.useState(courseData);

  const [isReady, setIsReady] = React.useState(false);

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

    window[`onSet${machinePropsDetails.machine.id}Wind`] = () => {
      props.setMachineDetailsSelected(machinePropsDetails);
    }

    clearMarkers();
    setIsReady(true);

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
      window[`onSet${machinePropsDetails.machine.id}Wind`] = () => { }
    };
  }, [socket]);

  React.useEffect(() => {
    if (isReady) {
      mountMarkers();
    }
  }, [isReady]);

  React.useEffect(() => {
    let time;
    if (isReady) {
      time = refreshMarkers();
    }
    return () => {
      if (time) clearTimeout(time);
    }
  }, [props.showCode, props.showName]);

  const takeDataPosition = (newCoodinates) => {
    if (newCoodinates?.length) {
      const newPositionNormalized = normalizeDataPosition(newCoodinates)[0];
      if (
        !positionItem?.date ||
        moment(newPositionNormalized.date).isAfter(moment(positionItem.date))
      ) {
        setPosition(newPositionNormalized);
      }
    }
  };

  const takeDataCourses = (newCourse) => {
    if (newCourse?.length) {
      const newCourseNormalized = normalizeDataCourse(newCourse)[0];
      if (
        !courseItem?.date ||
        moment(newCourseNormalized.date).isAfter(moment(courseItem.date))
      ) {
        setCourse(newCourseNormalized);
      }
    }
  };

  const refreshMarkers = () => {
    clearMarkers();
    return setTimeout(() => {
      mountMarkers();
    }, 500);
  };

  const clearMarkers = () => {
    if (window._lmap && mapMarkers?.length) {
      for (let i = 0; i < mapMarkers.length; i++) {
        window._lmap.removeLayer(mapMarkers[i]);
      }
      mapMarkers = [];
    }
  };

  const mountMarkers = () => {
    if (!window._lmap || !machinePropsDetails) return;
    const headingValue = !courseItem?.course ? -45 : courseItem?.course - 45;

    const position = getLatLonNormalize(positionItem.position);

    const marker = window.L.marker(position, {
      id: machinePropsDetails.machine.id,
      icon: !!machinePropsDetails?.modelMachine?.icon?.url
        ? new Icon({
          iconUrl: machinePropsDetails?.modelMachine?.icon?.url,
          iconSize: [40, 40],
          className: "pin2",
        })
        : new DivIcon({
          className: "leaflet-div-icon-img",
          iconSize: [25, 25],
          html: `<svg aria-hidden="true" style="transform:rotate(${headingValue}deg)" focusable="false" data-prefix="fad" data-icon="location-arrow" role="img" viewBox="0 0 512 512"><g class="fa-group"><path fill="${machinePropsDetails?.modelMachine?.color || "currentColor"
            }" d="M461.91 0a45 45 0 0 0-17.4 3.52L28.73 195.42c-48 22.39-32 92.75 19.19 92.75h175.91v175.91c0 30 24.21 47.94 48.74 47.94 17.3 0 34.76-8.91 44-28.75L508.48 67.49C522.06 34.89 494.14 0 461.91 0zM303.83 320V208.17H192l207.67-95.85z" class="fa-secondary"></path><path fill="#ffffff" d="M399.68 112.32L303.83 320V208.17H192l207.67-95.85" class="fa-primary"></path></g></svg>`,
        }),
    }).addTo(window._lmap);

    if (
      (props.showCode && machinePropsDetails?.machine?.code) ||
      (props.showName && machinePropsDetails?.machine?.name)
    )
      marker.bindTooltip(
        `<span style="font-weight: 600;font-size: 0.8rem;">
        ${!!props.showCode && machinePropsDetails?.machine?.code
          ? machinePropsDetails?.machine?.code
          : ""
        }
        ${!!props.showName && machinePropsDetails?.machine?.name
          ? `${!!props.showCode ? " - " : " "}${machinePropsDetails?.machine?.name
          }`
          : ""
        }
      </span>`,
        {
          permanent: true,
          direction: "top",
          opacity: 1,
        }
      );

    marker.bindPopup(
      `<span style="font-weight: 600;font-size: 0.8rem;">
      ${machinePropsDetails?.machine?.code
        ? machinePropsDetails?.machine?.code
        : ""
      }
      ${machinePropsDetails?.machine?.name
        ? `${!!machinePropsDetails?.machine?.code ? " - " : " "}${machinePropsDetails?.machine?.name
        }`
        : ""
      }
      <div style="margin-top: 15px;margin-bottom: 5px;display: flex; flex-direction: row; justify-content: center;">
      <button class="button-styled" onclick="window.onSet${machinePropsDetails.machine.id}Wind()">${intl.formatMessage({ id: 'route' })}</button>
      </div>
    </span>`,
      {}
    );

    mapMarkers.push(marker);
  };

  return <></>;
};

const mapStateToProps = (state) => ({
  isLoadingPositions: state.fleet.isLoadingPositions,
  machineDetailsSelected: state.fleet.machineDetailsSelected,
  showCode: state.map.showCode,
  showName: state.map.showName,
});

const mapDispatchToProps = (dispatch) => ({
  setMachineDetailsSelected: (machineDetails) => {
    dispatch(setMachineDetailsSelected(machineDetails));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ItemMarker);
