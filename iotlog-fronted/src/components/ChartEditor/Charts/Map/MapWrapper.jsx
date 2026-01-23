import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Fetch } from "../../../Fetch";
import { LoadingCard } from "../../../Loading";
import { urlRedirect } from "../../Utils";
import moment from "moment";
import { getLatLonNormalize } from "../../../Utils";
import { useSocket } from "../../../Contexts/SocketContext";

const MapWrapper = React.memo((props) => {
  const { data, height, width, filterDashboard } = props;

  const [dataValuesMap, setDataValuesMap] = useState({
    coordinates: [],
    routers: [],
    lastDate: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterData, setIsFilterData] = useState(false);
  const [heading, setHeading] = useState([]);
  const [newValues, setNewValues] = useState([]);
  const [isLoadingFilter, setIsLoadingFilter] = useState(false);

  const socket = useSocket();

  // Memoize socket topics to avoid recalculation
  const socketTopics = useMemo(() => {
    if (!data?.machines?.length) return [];

    return data.machines.flatMap((machine) => {
      const topics = [`sensorstate_${machine?.sensor?.value}_${machine?.machine?.value}`];
      if (machine?.sensorHeading?.value) {
        topics.push(`sensorstate_${machine?.sensorHeading?.value}_${machine?.machine?.value}`);
      }
      return topics;
    }).filter(Boolean);
  }, [data?.machines]);

  // Memoize takeData and takeDataHeading to prevent recreating on every render
  const takeData = useCallback((values) => {
    setNewValues(values);
  }, []);

  const takeDataHeading = useCallback((newHeading) => {
    if (!newHeading?.length) return;

    const headingToUpdate = newHeading[0];
    const headingNormalized = {
      idMachine: headingToUpdate.idMachine,
      idSensor: headingToUpdate.idSensor,
      head: headingToUpdate.value,
      date: headingToUpdate.date,
    };

    setHeading((prevState) => {
      const lastHeading = prevState.find(
        (x) =>
          x.idMachine === headingNormalized.idMachine &&
          x.idSensor === headingNormalized.idSensor
      );

      if (!lastHeading || moment(headingNormalized.date).isAfter(lastHeading.date)) {
        return [
          ...prevState.filter(
            (x) =>
              x.idMachine !== headingNormalized.idMachine ||
              x.idSensor !== headingNormalized.idSensor
          ),
          headingNormalized,
        ];
      }
      return prevState;
    });
  }, []);

  // Socket effect with optimized cleanup
  useEffect(() => {
    if (!socket || !socketTopics.length) return;

    // Join topics
    socket.emit("join", { topics: socketTopics });

    // Subscribe to events
    data?.machines?.forEach((machine) => {
      const mainTopic = `sensorstate_${machine?.sensor?.value}_${machine?.machine?.value}`;
      socket.on(mainTopic, takeData);

      if (machine?.sensorHeading?.value) {
        const headingTopic = `sensorstate_${machine?.sensorHeading?.value}_${machine?.machine?.value}`;
        socket.on(headingTopic, takeDataHeading);
      }
    });

    return () => {
      // Leave topics
      socket.emit("leave", { topics: socketTopics });

      // Unsubscribe from events
      data?.machines?.forEach((machine) => {
        const mainTopic = `sensorstate_${machine?.sensor?.value}_${machine?.machine?.value}`;
        socket.off(mainTopic, takeData);

        if (machine?.sensorHeading?.value) {
          const headingTopic = `sensorstate_${machine?.sensorHeading?.value}_${machine?.machine?.value}`;
          socket.off(headingTopic, takeDataHeading);
        }
      });
    };
  }, [socket, socketTopics, takeData, takeDataHeading, data?.machines]);

  // Memoize getRoutersAsync to prevent recreating
  const getRoutersAsync = useCallback(async ({ hours }) => {
    try {
      const query = [
        `idChart=${props.id}`,
        `hours=${hours}`,
        `interval=1`
      ];

      if (props.filterByMachine && data?.machines?.length) {
        const machineIds = data.machines
          .filter((x) => x.machine?.value)
          .map((x) => x.machine?.value)
          .join(",");
        query.push(`idMachines=${machineIds}`);
      }

      const historyResponse = await Fetch.get(
        `/sensorstate/chart/maphistory?${query.join("&")}`
      );

      return historyResponse.data || [];
    } catch (e) {
      return [];
    }
  }, [props.id, props.filterByMachine, data?.machines]);

  // Optimized getData function
  const getData = useCallback(async (hours) => {
    if (!data?.machines?.length) return;

    const machineIds = data.machines
      .filter((x) => x.machine?.value)
      .map((x) => x.machine?.value);

    if (!machineIds.length) return;

    const sensors = data.machines.reduce((acc, machine) => {
      if (machine.sensor?.value) acc.push(machine.sensor.value);
      if (machine.sensorHeading?.value) acc.push(machine.sensorHeading.value);
      return acc;
    }, []);

    if (!sensors.length) return;

    const machinesQuery = machineIds.map(id => `idMachines[]=${id}`).join("&");
    const sensorsQuery = sensors.map(id => `sensors[]=${id}`).join("&");

    setIsLoading(true);

    try {
      const [lastStateResponse, routers] = await Promise.all([
        Fetch.get(`/sensorstate/last/machines/sensors?${machinesQuery}&${sensorsQuery}`),
        getRoutersAsync({ hours })
      ]);

      if (!lastStateResponse.data) return;

      const sensorsCoordinates = new Set(data.machines.map((x) => x?.sensor?.value));
      const sensorsHeading = new Set(data.machines.map((x) => x?.sensorHeading?.value).filter(Boolean));

      const coordinates = lastStateResponse.data
        .filter((x) => sensorsCoordinates.has(x.idSensor))
        .map((x) => ({
          idMachine: x.idMachine,
          idSensor: x.idSensor,
          coordinate: getLatLonNormalize(x.value),
          date: x.date,
        }));

      const headings = lastStateResponse.data
        .filter((x) => sensorsHeading.has(x.idSensor))
        .map((x) => ({
          idMachine: x.idMachine,
          idSensor: x.idSensor,
          head: x.value,
          date: x.date,
        }));

      setDataValuesMap({
        coordinates,
        routers,
        lastDate: lastStateResponse.data[0]?.date,
      });
      setHeading(headings);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  }, [data?.machines, getRoutersAsync]);

  // Initial data fetch
  useEffect(() => {
    getData(12);
  }, [getData]);

  // Handle new values with debouncing
  useEffect(() => {
    if (!newValues?.length || isFilterData) return;

    const coordinate = newValues[0];
    const coordinateNormalized = {
      idMachine: coordinate.idMachine,
      idSensor: coordinate.idSensor,
      coordinate: getLatLonNormalize(coordinate.value),
      date: coordinate.date,
    };

    setDataValuesMap((prevState) => {
      const existingIndex = prevState.coordinates.findIndex(
        (x) =>
          x.idMachine === coordinateNormalized.idMachine &&
          x.idSensor === coordinateNormalized.idSensor
      );

      const lastCoordinate = existingIndex >= 0 ? prevState.coordinates[existingIndex] : null;

      if (!lastCoordinate || moment(coordinateNormalized.date).isAfter(lastCoordinate.date)) {
        const updatedCoordinates = [...prevState.coordinates];
        if (existingIndex >= 0) {
          updatedCoordinates[existingIndex] = coordinateNormalized;
        } else {
          updatedCoordinates.push(coordinateNormalized);
        }

        const newRouter = [
          coordinateNormalized.idMachine,
          new Date(coordinateNormalized.date).getTime() / 1000,
          coordinateNormalized.coordinate[0],
          coordinateNormalized.coordinate[1],
        ];

        const updatedRouters = [...prevState.routers.slice(0, 999), newRouter];

        return {
          ...prevState,
          coordinates: updatedCoordinates,
          routers: updatedRouters,
          lastDate: coordinate.date,
        };
      }

      return prevState;
    });

    setNewValues([]);
  }, [newValues, isFilterData]);

  // Handle filter dashboard
  useEffect(() => {
    if (filterDashboard) {
      onApply(filterDashboard);
    }
  }, [filterDashboard]);

  const onClick = useCallback(() => {
    if (props.activeEdit) return;
    urlRedirect(props.data?.link);
  }, [props.activeEdit, props.data?.link]);

  const restartSearch = useCallback(() => {
    setIsLoadingFilter(true);
    getRoutersAsync({ hours: 12 })
      .then((routers) => {
        setDataValuesMap((prevState) => ({
          ...prevState,
          routers,
        }));
        setIsFilterData(false);
      })
      .finally(() => {
        setIsLoadingFilter(false);
      });
  }, [getRoutersAsync]);

  const onApply = useCallback(({
    interval,
    dateInit,
    dateEnd,
    timeInit,
    timeEnd,
    isClean = false,
  }) => {
    if (isClean) {
      restartSearch();
      return;
    }

    setIsLoadingFilter(true);
    setIsFilterData(true);

    const intervalQuery = interval === "noInterval"
      ? "&noInterval=true"
      : `&interval=${interval || 30}`;

    const startDateTime = `${moment(dateInit).format("YYYY-MM-DD")}T${timeInit || "00:00"}:00${moment(dateInit).format("Z")}`;
    const endDateTime = `${moment(dateEnd).format("YYYY-MM-DD")}T${timeEnd || "23:59"}:59${moment(dateEnd).format("Z")}`;

    Fetch.get(
      `/sensorstate/chart/maphistory?idChart=${props.id}&min=${startDateTime}&max=${endDateTime}${intervalQuery}`
    )
      .then((res) => {
        if (res.data?.length) {
          setDataValuesMap((prevState) => ({
            ...prevState,
            routers: res.data,
          }));
        }
      })
      .catch((e) => {

      })
      .finally(() => {
        setIsLoadingFilter(false);
      });
  }, [props.id, restartSearch]);

  const componentProps = useMemo(() => ({
    title: data?.title,
    height,
    width,
    data,
    id: props.id,
    onClick: props.data?.link ? onClick : undefined,
    activeEdit: props.activeEdit,
    dataValuesMap,
    headings: heading,
    isLoadingFilter: isLoadingFilter || isLoading,
    onApply,
    isFiltered: isFilterData,
  }), [
    data?.title, height, width, data, props.id, props.data?.link,
    onClick, props.activeEdit, dataValuesMap, heading,
    isLoadingFilter, isLoading, onApply, isFilterData
  ]);

  return (
    <LoadingCard key={props.id}>
      <props.component {...componentProps} />
    </LoadingCard>
  );
});

MapWrapper.displayName = 'MapWrapper';

export default MapWrapper;
