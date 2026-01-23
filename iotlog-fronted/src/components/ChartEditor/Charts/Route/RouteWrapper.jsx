import React from "react";
import { LoadingCard } from "../../../Loading";
import { Fetch } from "../../../Fetch";
import { useSocket } from "../../../Contexts/SocketContext";

const RouteWrapper = (props) => {
  const { data, height, width } = props;

  const [sensorStatesAndParams, setsensorStatesAndParamsAndParams] = React.useState([]);
  const [newValue, setNewValue] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  const socket = useSocket();

  React.useEffect(() => {
    if (!socket || !data?.sensors?.length || !data?.machine?.value) {
      return;
    }
    if (data?.sensors?.length && data?.machine?.value) {
      socket.emit("join", {
        topics: data.sensors.map(
          (x) => `sensorstate_${x?.sensor?.value}_${data?.machine?.value}`
        ),
      });
      data.sensors.forEach((x) => {
        socket.on(
          `sensorstate_${x?.sensor?.value}_${data?.machine?.value}`,
          takeData
        );
      });
    }

    return () => {
      if (data?.sensors?.length && data?.machine?.value) {
        socket.emit("leave", {
          topics: data.sensors.map(
            (x) => `sensorstate_${x?.sensor?.value}_${data?.machine?.value}`
          ),
        });
        data.sensors.forEach((x) => {
          socket.off(
            `sensorstate_${x?.sensor?.value}_${data?.machine?.value}`,
            takeData
          );
        });
      }
    }
  }, [socket, data]);

  React.useEffect(() => {
    getData();
  }, []);

  React.useEffect(() => {
    if (newValue) {
      setsensorStatesAndParamsAndParams({
        ...sensorStatesAndParams,
        data: [
          ...sensorStatesAndParams.data.filter(x => x.sensorId != newValue.sensorId),
          newValue
        ]
      })
    }
  }, [newValue])

  const takeData = (values) => {
    setNewValue(values?.length ? values[0] : undefined)
  }

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/sensorstate/chart/route?idChart=${props.id}`)
      .then((response) => {
        if (response.data?.data?.length) {
          setsensorStatesAndParamsAndParams(response.data);
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
        sensorStatesAndParams={sensorStatesAndParams}
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

export default RouteWrapper;
