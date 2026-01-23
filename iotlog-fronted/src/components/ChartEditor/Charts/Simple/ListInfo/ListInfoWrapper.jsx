import React from "react";
import { Fetch } from "../../../../Fetch";
import { LoadingCard } from "../../../../Loading";
import { urlRedirect } from "../../../Utils";
import { useSocket } from "../../../../Contexts/SocketContext";

const ListInfoWrapper = (props) => {
  const { data } = props;

  const [sensorStates, setSensorStates] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [newValues, setNewValues] = React.useState([]);

  const socket = useSocket();

  React.useEffect(() => {
    if (!socket || !data?.machines?.length) {
      return;
    }

    const channelsTopic = [
      ...new Set(
        data?.machines?.map(
          (x) => `sensorstate_${x?.sensor?.value}_${x?.machine?.value}`
        )
      ),
    ];

    if (channelsTopic?.length) {
      socket.emit("join", { topics: channelsTopic });
      channelsTopic?.forEach((x) => {
        socket.on(x, takeData);
      });
    }
    return () => {
      if (channelsTopic?.length) {
        socket.emit("leave", { topics: channelsTopic });
        channelsTopic?.forEach((x) => {
          socket.off(x, takeData);
        });
      }
    };
  }, [socket, data]);

  React.useEffect(() => {
    getData();
  }, []);

  React.useEffect(() => {
    if (newValues?.length) {
      const sensorStateToUpdate = newValues[0];

      setSensorStates((prevState) => {
        const lastSensorUpdate = prevState.find(
          (x) =>
            sensorStateToUpdate.idMachine === x.idMachine &&
            sensorStateToUpdate.idSensor === x.idSensor
        );

        return !lastSensorUpdate ||
          new Date(sensorStateToUpdate.date).getTime() >
          new Date(lastSensorUpdate.date).getTime()
          ? [
            ...prevState.filter(
              (x) =>
                !(
                  sensorStateToUpdate.idMachine === x.idMachine &&
                  sensorStateToUpdate.idSensor === x.idSensor
                )
            ),
            sensorStateToUpdate,
          ]
          : prevState;
      });
    }
  }, [newValues]);

  const getData = async () => {
    const machinesQuery = `${[
      ...new Set(
        data?.machines
          ?.filter((x) => x)
          ?.map((x, i) => `idMachines[]=${x.machine?.value}`)
      ),
    ]?.join("&")}`;

    const sensors = data?.machines
      ?.map((x) => {
        return x.sensorHeading?.value
          ? [x.sensor?.value, x.sensorHeading?.value]
          : [x.sensor?.value];
      })
      ?.flat();

    const sensorsQuery = `${[
      ...new Set(sensors?.filter((x) => x)?.map((x, i) => `sensors[]=${x}`)),
    ]?.join("&")}`;

    if (!machinesQuery || !sensorsQuery) return;

    setIsLoading(true);
    try {
      const lastStateResponse = await Fetch.get(
        `/sensorstate/last/machines/sensors?${machinesQuery}&${sensorsQuery}`
      );
      if (!lastStateResponse.data?.length) {
        return;
      }
      setSensorStates(lastStateResponse.data);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const takeData = (values) => {
    setNewValues(values);
  };

  const onClick = () => {
    if (props.activeEdit) return;
    urlRedirect(props.data?.link);
  };

  return (
    <LoadingCard key={props.id} isLoading={isLoading}>
      <props.component
        title={data?.title}
        data={data}
        id={props.id}
        onClick={props.data?.link ? onClick : undefined}
        activeEdit={props.activeEdit}
        sensorStates={sensorStates}
      />
    </LoadingCard>
  );
};

export default ListInfoWrapper;
