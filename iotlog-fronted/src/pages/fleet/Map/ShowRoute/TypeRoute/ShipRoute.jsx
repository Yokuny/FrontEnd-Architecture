import { nanoid } from "nanoid";
import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
import {
  setLastMarker,
  setRouteHistory,
  setRouterIsLoading,
  setTimelineSelected,
} from "../../../../../actions";
import { Fetch } from "../../../../../components/Fetch";
import { angle360 } from "../../../../../components/Utils";
import ShowPoints from "../ShowPoints";
import GradientRoute from "./../GradientRoute";
import EventsShipRoute from "./EventsShipRoute";
import { setIsShowRoute } from "../../../../../actions/map.actions";
import { useSocket } from "../../../../../components/Contexts/SocketContext";
import WeatherRoute from "../../Weather/WeatherRoute";

const ShipRoute = (props) => {
  const { machineDetailsSelected } = props;

  const [newItemPosition, setNewItemPosition] = React.useState();
  const [newItemSpeed, setNewItemSpeed] = React.useState();

  const intl = useIntl();

  const socket = useSocket();

  React.useEffect(() => {
    if (!socket || !machineDetailsSelected?.machine?.id) {
      return;
    }
    const idSensors = [
      machineDetailsSelected?.config?.idSensorCoordinate,
      machineDetailsSelected?.config?.idSensorSpeed,
    ]?.filter((id) => id);

    if (!idSensors.length) {
      return;
    }

    socket.emit("join", {
      topics: idSensors.map(
        (id) => `sensorstate_${id}_${machineDetailsSelected?.machine?.id}`
      ),
    });

    if (machineDetailsSelected?.config?.idSensorCoordinate) {
      socket.on(
        `sensorstate_${machineDetailsSelected?.config?.idSensorCoordinate}_${machineDetailsSelected?.machine?.id}`,
        takeData
      );
    }
    if (machineDetailsSelected?.config?.idSensorSpeed) {
      socket.on(
        `sensorstate_${machineDetailsSelected?.config?.idSensorSpeed}_${machineDetailsSelected?.machine?.id}`,
        takeDataSpeed
      );
    }

    props.setIsShowRoute();

    return () => {
      if (socket) {
        socket.emit("leave", {
          topics: idSensors.map(
            (id) => `sensorstate_${id}_${machineDetailsSelected?.machine?.id}`
          ),
        });
        socket.off(
          `sensorstate_${machineDetailsSelected?.config?.idSensorCoordinate}_${machineDetailsSelected?.machine?.id}`,
          takeData
        );
        socket.off(
          `sensorstate_${machineDetailsSelected?.config?.idSensorSpeed}_${machineDetailsSelected?.machine?.id}`,
          takeDataSpeed
        );
      }

      props.setLastMarker(undefined);
    };
  }, [socket, machineDetailsSelected]);

  React.useEffect(() => {
    getData();
    return () => {
      props.setLastMarker(undefined);
      props.setTimelineSelected(undefined);
      props.setRouteHistory([]);
    };
  }, [
    props.hourPosition,
    props.interval,
    props.machineDetailsSelected,
    props.filterRouter,
  ]);

  React.useEffect(() => {
    if (newItemPosition && !props.filterRouter) {
      const timeUnix =
        new Date(
          `${newItemPosition.date.slice(0, 16)}:00${newItemPosition.date.slice(
            19
          )}`
        ).getTime() / 1000;

      let timeAlreadyIndex = (props.routeHistory || [])?.findIndex(
        (x) => x?.length && x[0] === timeUnix
      );

      if (timeAlreadyIndex >= 0) {
        try {
          const currentItem = props.routeHistory[timeAlreadyIndex];
          if (
            currentItem?.length >= 3 &&
            newItemPosition?.value?.length === 2
          ) {
            props.setRouteHistory([
              ...(props.routeHistory?.slice(0, timeAlreadyIndex) || []),
              [
                ...currentItem[0],
                ...newItemPosition.value,
                ...currentItem.slice(3),
              ],
              ...(props.routeHistory?.slice(timeAlreadyIndex + 1) || []),
            ]);
          }
        } catch { }
        return;
      }

      if (newItemPosition?.value?.length === 2) {
        try {
          props.setRouteHistory([
            [
              timeUnix,
              newItemPosition.value[0],
              newItemPosition.value[1],
              props.routeHistory?.length ? props.routeHistory[0][3] : null,
              props.routeHistory?.length
                ? getAngleCourse(
                  newItemPosition.value,
                  props.routeHistory[0].slice(1, 3)
                )
                : null,
            ],
            ...(props.routeHistory || []),
          ]);
        } catch { }
      }
    }
  }, [newItemPosition]);

  React.useEffect(() => {
    if (newItemSpeed && !props.filterRouter) {
      const timeUnix =
        new Date(
          `${newItemSpeed.date.slice(0, 16)}:00${newItemSpeed.date.slice(19)}`
        ).getTime() / 1000;
      let timeAlreadyIndex = (props.routeHistory || [])?.findIndex(
        (x) => x?.length && x[0] === timeUnix
      );

      if (timeAlreadyIndex >= 0) {
        try {
          const currentItem = props.routeHistory[timeAlreadyIndex];
          if (currentItem?.length >= 4) {
            props.setRouteHistory([
              ...(props.routeHistory?.slice(0, timeAlreadyIndex) || []),
              [
                ...currentItem.slice(0, 3),
                newItemSpeed.value,
                ...currentItem.slice(4),
              ],
              ...(props.routeHistory?.slice(timeAlreadyIndex + 1) || []),
            ]);
          }
        } catch { }
        return;
      }

      try {
        props.setRouteHistory([
          [timeUnix, null, null, newItemSpeed.value],
          ...(props.routeHistory || []),
        ]);
      } catch { }
    }
  }, [newItemSpeed]);

  const takeData = (newPositionList) => {
    if (newPositionList?.length) {
      setNewItemPosition(newPositionList[0]);
    }
  };

  const takeDataSpeed = (newSpeedList) => {
    if (newSpeedList?.length) {
      setNewItemSpeed(newSpeedList[0]);
    }
  };

  const getAngleCourse = (position1, position2) => {
    return angle360(position2[0], position2[1], position1[0], position1[1]);
  };

  const getData = () => {
    if (!props.machineDetailsSelected?.machine?.id) {
      return;
    }
    props.setRouterIsLoading(true);
    Fetch.get(
      `/sensorstate/fleet/historyposition/details?idMachine=${props.machineDetailsSelected?.machine?.id
      }${props.filterRouter?.min && props.filterRouter?.max
        ? `&min=${props.filterRouter?.min}&max=${props.filterRouter?.max}`
        : `&hours=${props.hourPosition}`
      }&interval=${props.filterRouter?.interval || props.interval}`
    )
      .then((response) => {
        if (response.data?.length) {
          props.setRouteHistory(response.data);

          const totalCoordinates = response.data?.length;

          const lastCoordinate = response.data[0];

          if (lastCoordinate?.length) {
            const initialPosition = lastCoordinate.slice(1, 3);
            const nextPosition = response.data[1]?.slice(1, 3);

            if (!initialPosition.length) {
              props.setRouterIsLoading(false);
              return;
            }

            props.setLastMarker({
              idMachine: props.machineDetailsSelected?.machine?.id,
              position: initialPosition,
              date: new Date(lastCoordinate[0] * 1000),
              course:
                totalCoordinates > 1
                  ? getAngleCourse(
                    initialPosition,
                    nextPosition
                  )
                  : 0,
            });
          }
        } else {
          if (props.machineDetailsSelected?.lastState?.coordinate?.length) {
            props.setLastMarker({
              idMachine: props.machineDetailsSelected?.machine?.id,
              position: props.machineDetailsSelected?.lastState?.coordinate,
              date: new Date(props.machineDetailsSelected?.lastState?.date),
              course: props.machineDetailsSelected?.lastState?.course,
            });
          }
          toast.warn(intl.formatMessage({ id: "empty.vessel.router" }));
        }
        props.setRouterIsLoading(false);
      })
      .catch((e) => {
        props.setRouterIsLoading(false);
      });
  };

  const id = nanoid(4);

  return (
    <>
      {!!props.machineDetailsSelected &&
        !!props?.routeHistory?.length &&
        (
          <>
            <>
              <GradientRoute
                key={`route_for_${id}`}
                data={props?.routeHistory}
                lastPosition={
                  props?.filterRouter
                    ? props?.lastMarker?.position
                    : props?.routeHistory[0].slice(1, 3)
                }
              />
              <ShowPoints key={`r_${id}`} routeHistory={props?.routeHistory} />
              <WeatherRoute data={props?.routeHistory} />

            </>
          </>
        )}
      {props.eventTimelineSelect && (
        <EventsShipRoute
          key={`e_e_${id}`}
          eventTimelineSelect={props.eventTimelineSelect}
          routeHistory={props?.routeHistory}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  machineDetailsSelected: state.fleet.machineDetailsSelected,
  positions: state.fleet.positions,
  interval: state.map.router?.interval,
  hourPosition: state.map.router?.hourPosition,
  filterRouter: state.map.filterRouter,
  lastMarker: state.fleet.lastMarker,
  routeHistory: state.fleet.routeHistory,
  eventTimelineSelect: state.fleet.eventTimelineSelect,
  isShowRoute: state.map.isShowRoute,
});

const mapDispatchToProps = (dispatch) => ({
  setRouterIsLoading: (isLoading) => {
    dispatch(setRouterIsLoading(isLoading));
  },
  setLastMarker: (lastMarker) => {
    dispatch(setLastMarker(lastMarker));
  },
  setRouteHistory: (routeHistory) => {
    dispatch(setRouteHistory(routeHistory));
  },
  setTimelineSelected: (eventTimelineSelect) => {
    dispatch(setTimelineSelected(eventTimelineSelect));
  },
  setIsShowRoute: () => {
    dispatch(setIsShowRoute(true));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ShipRoute);
