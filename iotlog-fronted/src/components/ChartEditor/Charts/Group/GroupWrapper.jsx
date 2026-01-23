import React from "react";
import { LoadingCard } from "../../../Loading";
import { Fetch } from "../../../Fetch";
import { useSocket } from "../../../Contexts/SocketContext";

const GroupWrapper = (props) => {
  const { data } = props;

  const [sensorStates, setSensorStates] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const socket = useSocket();

  React.useEffect(() => {
    if (!socket || !data?.machines?.length) {
      return;
    }
    if (data?.machines?.length) {
      socket.emit("join", {
        topics: data.machines.map(
          (x) => `sensorstate_${x?.sensor?.value}_${x?.machine?.value}`
        ),
      });
      data.machines.forEach((x) => {
        socket.on(
          `sensorstate_${x?.sensor?.value}_${x?.machine?.value}`,
          takeData
        );
      });
    }
    return () => {
      socket.emit("leave", {
        topics: data.machines?.map(
          (x) => `sensorstate_${x?.sensor?.value}_${x?.machine?.value}`
        ),
      });
      data.machines.forEach((x) => {
        socket.off(
          `sensorstate_${x?.sensor?.value}_${x?.machine?.value}`,
          takeData
        );
      });
    };
  }, [socket, data]);

  React.useEffect(() => {
    getData();
  }, []);

  const takeData = (values) => {
    if (values.length) {
      const newValue = values?.length ? values[0] : undefined;
      if (newValue)
        setSensorStates((prevState) => [
          ...prevState.filter(
            (x) =>
              !(
                x.idMachine === newValue.idMachine &&
                ((x.idSensor && x.idSensor === newValue.idSensor))
              )
          ),
          newValue,
        ]);
    }
  };

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/sensorstate/chart/signalbymachines?idChart=${props.id}`)
      .then((response) => {
        if (response.data?.length) {
          setSensorStates(response.data);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <LoadingCard isLoading={isLoading}  id={props.id}>
      <props.component
        sensorStates={sensorStates}
        title={data?.title}
        data={data}
        id={props.id}
        activeEdit={props.activeEdit}
        isMobile={props.isMobile}
      />
    </LoadingCard>
  );
};

export default GroupWrapper;
