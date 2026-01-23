import React from "react";
import moment from "moment";
import { LoadingCard } from "../../../../Loading";
import { urlRedirect } from "../../../Utils";
import { TYPE_VALUE } from "./constants";
import { Fetch } from "../../../../Fetch";
import { useSocket } from "../../../../Contexts/SocketContext";

const NumericWrapper = (props) => {
  const { data } = props;

  const [sensorData, setSensorData] = React.useState();
  const [newValue, setNewValue] = React.useState(0);
  const [description, setDescription] = React.useState(
    data?.optionDescription?.value == "text" ? data?.description : ""
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const socket = useSocket();

  React.useEffect(() => {
    if (!socket || !data?.machines?.length) {
      return;
    }
    socket.emit("join", {
      topic: `sensorstate_${data?.sensor?.value}_${data?.machine?.value}`,
    });
    socket.on(
      `sensorstate_${data?.sensor?.value}_${data?.machine?.value}`,
      takeData
    );

    return () => {
      socket.emit("leave", {
        topic: `sensorstate_${data?.sensor?.value}_${data?.machine?.value}`,
      });
      socket.off(
        `sensorstate_${data?.sensor?.value}_${data?.machine?.value}`,
        takeData
      );
    };
  }, [socket, data]);

  React.useEffect(() => {
    getData();
  }, []);

  React.useEffect(() => {
    if (data.typeValue?.value === TYPE_VALUE.SUM) {
      setSensorData({ value: sensorData?.value ?? 0 + newValue?.value ?? 0 });
    } else if (data.typeValue?.value === TYPE_VALUE.COUNT) {
      setSensorData({ value: sensorData?.value ?? 0 + 1 });
    } else if (
      !sensorData ||
      moment(newValue?.date).isAfter(sensorData?.date)
    ) {
      setSensorData({ value: newValue?.value ?? 0, date: newValue?.date });
    }
  }, [newValue]);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/sensorstate/chart/numeric?idChart=${props.id}`)
      .then((response) => {
        if (response.data) setSensorData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const takeData = (values) => {
    if (!!values?.length) {
      const sensorState = values[0];
      const signalReceveid =
        sensorState.value ||
        (sensorState.signals?.length ? sensorState.signals[0].value : undefined);

      if (signalReceveid) {
        setNewValue({
          value: signalReceveid,
          date: sensorState.date,
        });
        if (
          data?.optionDescription?.value == "integration" &&
          data?.description
        )
          setDescription(signalReceveid[data?.description]);
        else if (data?.optionDescription?.value == "text")
          setDescription(data?.description);
      }
    }
  };

  const onClick = () => {
    if (props.activeEdit) return;

    urlRedirect(props.data?.link);
  };

  return (
    <LoadingCard key={props.id} isLoading={isLoading}>
      <props.component
        value={sensorData?.value}
        title={data?.title}
        description={description}
        data={data}
        id={props.id}
        onClick={props.data?.link ? onClick : undefined}
      />
    </LoadingCard>
  );
};

export default NumericWrapper;
