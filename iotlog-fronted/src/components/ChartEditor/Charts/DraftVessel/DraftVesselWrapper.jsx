import React from "react";
import { LoadingCard } from "../../../Loading";
import { urlRedirect } from "../../Utils";
import { Fetch } from "../../../Fetch";
import { useSocket } from "../../../Contexts/SocketContext";

const DraftVesselWrapper = (props) => {
  const { data } = props;

  const [draftData, setDraftData] = React.useState({ bow: 0, stern: 0 });

  const [isLoading, setIsLoading] = React.useState(false);
  const socket = useSocket();

  React.useEffect(() => {
    if (!socket || !data?.machine?.value) {
      return;
    }
    socket.emit("join", {
      topics: [
        `sensorstate_${data?.sensorBow?.value}_${data?.machine?.value}`,
        `sensorstate_${data?.sensorStern?.value}_${data?.machine?.value}`,
      ],
    });

    socket.on(
      `sensorstate_${data?.sensorBow?.value}_${data?.machine?.value}`,
      (values) => setDraftData(prevState => values?.length
        ? ({ ...prevState, bow: values[0].value })
        : prevState
      )
    );
    socket.on(
      `sensorstate_${data?.sensorStern?.value}_${data?.machine?.value}`,
      (values) => setDraftData(prevState => values?.length
        ? ({ ...prevState, bow: values[0].value })
        : prevState
      )
    );

    return () => {
      socket.emit("leave", {
        topics: [
          `sensorstate_${data?.sensorBow?.value}_${data?.machine?.value}`,
          `sensorstate_${data?.sensorStern?.value}_${data?.machine?.value}`,
        ],
      });
      socket.off(
        `sensorstate_${data?.sensorBow?.value}_${data?.machine?.value}`,
        (values) => setDraftData(prevState => values?.length
          ? ({ ...prevState, bow: values[0].value })
          : prevState
        )
      );
      socket.off(
        `sensorstate_${data?.sensorStern?.value}_${data?.machine?.value}`,
        (values) => setDraftData(prevState => values?.length
          ? ({ ...prevState, stern: values[0].value })
          : prevState
        )
      );
    };
  }, [socket, data]);

  React.useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setIsLoading(true);
    const query = [`idChart=${props.id}`];
    if (props.idMachine) {
      query.push(`idMachine=${props.idMachine}`);
    }
    Fetch.get(`/sensorstate/chart/draft?${query.join("&")}`)
      .then((response) => {
        if (response.data) setDraftData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onClick = () => {
    if (props.activeEdit) return;

    if (props.onHandleOpen) {
      props.onHandleOpen({
        idMachine: props.idMachine,
        idSensors: [data?.sensorBow?.value, data?.sensorStern?.value],
      });
      return;
    }

    urlRedirect(props.data?.link);
  };

  return (
    <LoadingCard key={props.id} isLoading={isLoading}>
      <props.component
        draftData={draftData}
        title={data?.title}
        data={data}
        id={props.id}
        onClick={props.data?.link || props.onHandleOpen ? onClick : undefined}
      />
    </LoadingCard>
  );
};

export default DraftVesselWrapper;
