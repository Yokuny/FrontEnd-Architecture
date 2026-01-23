import React from "react";
import { LoadingCard } from "../../../../Loading";
import { Fetch } from "../../../../Fetch";
import { urlRedirect } from "../../../Utils";
//import { useSocket } from "../../../../Contexts/SocketContext";

const ModeCombineWrapper = (props) => {
  const { data } = props;

  const [modoStates, setModoStates] = React.useState([]);
  const [newValue, setNewValue] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  // const socket = useSocket();

  React.useEffect(() => {

    // if (data?.machine?.value && data?.sensorManual?.value)
    //   socket.on(
    //     `sensorstate_${data?.sensorManual?.value}_${data?.machine?.value}`,
    //     takeData
    //   );
    // if (data?.machine?.value && data?.sensorAutomatic?.value)
    //   socket.on(
    //     `sensorstate_${data?.sensorAutomatic?.value}_${data?.machine?.value}`,
    //     takeData
    //   );
    // if (data?.machine?.value && data?.sensorActive?.value)
    //   socket.on(
    //     `sensorstate_${data?.sensorActive?.value}_${data?.machine?.value}`,
    //     takeData
    //   );
    // if (data?.machine?.value && data?.sensorBusy?.value)
    //   socket.on(
    //     `sensorstate_${data?.sensorBusy?.value}_${data?.machine?.value}`,
    //     takeData
    //   );
    // if (data?.machine?.value && data?.sensorAvaliable?.value)
    //   socket.on(
    //     `sensorstate_${data?.sensorAvaliable?.value}_${data?.machine?.value}`,
    //     takeData
    //   );
    // getData();
    // return () => {
    //   socket.emit("leave", {
    //     topics: [
    //       data?.sensorManual?.value,
    //       data?.sensorAutomatic?.value,
    //       data?.sensorActive?.value,
    // };
  }, []);

  React.useLayoutEffect(() => {
    if (newValue) {
      let modeFiltered = modoStates.filter(
        (x) => x.sensorId !== newValue.sensorId
      );

      setModoStates([
        ...modeFiltered,
        newValue
      ]);
      setNewValue(undefined)
    }
  }, [newValue]);

  const takeData = (values) => {
    setNewValue(values?.length ? values[0] : undefined);
  };

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/sensorstate/chart/modecombine?idChart=${props.id}`)
      .then((response) => {
        setModoStates(response.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const onClick = () => {
    if (props.activeEdit)
    return;

    urlRedirect(props.data?.link);
  };

  return (
    <LoadingCard isLoading={isLoading}>
      <props.component
        modoStates={modoStates}
        title={data?.title}
        data={data}
        id={props.id}
        activeEdit={props.activeEdit}
        onClick={props.data?.link ? onClick : undefined}
      />
    </LoadingCard>
  );
};

export default ModeCombineWrapper;
