import React from "react";
import { LoadingCard } from "../../../../Loading";
import { Fetch } from "../../../../Fetch";
import { useSocket } from "../../../../Contexts/SocketContext";

const GroupedFailuresCountWrapper = (props) => {
  const { data, height, width } = props;

  const [countSensorStates, setCountSensorStates] = React.useState([]);
  const [newValue, setNewValue] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  const socket = useSocket();

  React.useEffect(() => {
    if (!socket) return;

    if (data?.machines?.length) {
      socket.emit("join", {
        topics: data.machines.map(
          (x) => `sensorstate_${x?.sensor?.value}_${x?.machine?.value}`
        )
      });
      data.machines.forEach((x) => {
        if (x.sensors && x.sensors.length)
          x.sensors.forEach((y) => {
            socket.on(
              `sensorstate_${y?.sensor?.value}_${x?.machine?.value}`,
              takeData
            );
          });
      });
    }

    return () => {
      socket.emit("leave", {
        topics: data.machines?.map(
          (x) =>
            `sensorstate_${x?.sensor?.value}_${x?.machine?.value}`
        )
      });
      data.machines.forEach((x) => {
        if (x.sensors && x.sensors.length)
          x.sensors.forEach((y) => {
            socket.off(
              `sensorstate_${y?.sensor?.value}_${x?.machine?.value}`,
              takeData
            );
          });
      });
    };
  }, [socket, data]);

  React.useEffect(() => {
    getData();
  }, []);

  React.useEffect(() => {
    if (newValue) {
      const updateIndex = countSensorStates.findIndex(
        (x) => x.idMachine == newValue.idMachine
      );
      if (updateIndex >= 0) {
        let dataUpdate = countSensorStates[updateIndex];

        if (
          newValue?.signals?.length &&
          (newValue?.signals[0]?.value === true ||
            newValue?.signals[0]?.value === "true")
        ) {
          dataUpdate.total = dataUpdate.total + 1;
        } else if (dataUpdate.total > 0 && !data.isTotalDaily) {
          dataUpdate.total = dataUpdate.total - 1;
        } else {
          return;
        }

        setCountSensorStates([
          ...countSensorStates.slice(0, updateIndex),
          dataUpdate,
          ...countSensorStates.slice(updateIndex + 1),
        ]);
      } else {
        setCountSensorStates([
          ...countSensorStates,
          {
            idMachine: newValue.idMachine,
            total: 1,
          },
        ]);
      }
    }
  }, [newValue]);

  const takeData = (values) => {
    setNewValue(values?.length ? values[0] : undefined);
  };

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/sensorstate/chart/manycountbooleangrouped?idChart=${props.id}`)
      .then((response) => {
        if (response.data?.length) {
          setCountSensorStates(response.data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <LoadingCard isLoading={isLoading}>
      <props.component
        countSensorStates={countSensorStates}
        title={data?.title}
        height={height}
        width={width}
        data={data}
        id={props.id}
        activeEdit={props.activeEdit}
      />
    </LoadingCard>
  );
};

export default GroupedFailuresCountWrapper;
