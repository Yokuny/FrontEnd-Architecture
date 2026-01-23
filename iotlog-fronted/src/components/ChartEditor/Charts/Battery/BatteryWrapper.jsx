import React from "react";
import { LoadingCard } from "../../../Loading";
import { connect } from "react-redux";
import { urlRedirect } from "../../Utils";
import { useSocket } from "../../../Contexts/SocketContext";

const BatteryWrapper = (props) => {
  const { data, height, width } = props;

  const [level, setLevel] = React.useState();
  const [description, setDescription] = React.useState(
    data?.optionDescription?.value == "text" ? data?.description : ""
  );
  const [levelNominal, setLevelNominal] = React.useState();
  const [descriptionNominal, setDescriptionNominal] = React.useState(
    data?.optionDescriptionNominal?.value == "text"
      ? data?.descriptionNominal
      : ""
  );
  const [charging, setCharging] = React.useState(false);

  let socket = useSocket();

  React.useEffect(() => {
    if (!socket || !data?.machine?.value) {
      return;
    }
    socket.on(
      `sensorstate_${data?.sensor?.value}_${data?.machine?.value}`,
      takeDataLevel
    );
    socket.on(
      `sensorstate_${data?.sensorNominal?.value}_${data?.machine?.value}`,
      takeDataLevelNominal
    );
    socket.on(
      `sensorstate_${data?.sensorCharging?.value}_${data?.machine?.value}`,
      takeDataCharging
    );

    return () => {
      socket.off(
        `sensorstate_${data?.sensor?.value}_${data?.machine?.value}`,
        takeDataLevel
      );
      socket.off(
        `sensorstate_${data?.sensorNominal?.value}_${data?.machine?.value}`,
        takeDataLevelNominal
      );
      socket.off(
        `sensorstate_${data?.sensorCharging?.value}_${data?.machine?.value}`,
        takeDataCharging
      );
    };
  }, [socket, data]);

  React.useEffect(() => {
    if (props.listLastState?.length) {
      const hasLevel = props.listLastState.filter(
        (x) =>
          x.idMachine == data?.machine?.value &&
          x.sensorId == data?.sensor?.value
      );

      hasLevel?.length && takeDataLevel(hasLevel);

      const hasLevelNominal = props.listLastState.filter(
        (x) =>
          x.idMachine == data?.machine?.value &&
          x.sensorId == data?.sensorNominal?.value
      );
      hasLevelNominal?.length && takeDataLevelNominal(hasLevelNominal);

      const hasLevelCharging = props.listLastState.filter(
        (x) =>
          x.idMachine == data?.machine?.value &&
          x.sensorId == data?.sensorCharging?.value
      );

      hasLevelCharging?.length && takeDataCharging(hasLevelCharging);
    }
  }, [props.listLastState]);

  const takeDataLevel = (values) => {
    if (!!values?.length) {
      const signalReceveid = !!values[0].signals?.length
        ? data?.signal?.value
          ? values[0].signals?.find((x) => x.signal == data?.signal?.value)
          : values[0].signals[0]
        : undefined;

      if (signalReceveid) {
        setLevel(signalReceveid.value);

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

  const takeDataLevelNominal = (values) => {
    if (!!values?.length) {
      const signalReceveid = !!values[0].signals?.length
        ? data?.signalNominal?.value
          ? values[0].signals?.find(
            (x) => x.signal == data?.signalNominal?.value
          )
          : values[0].signals[0]
        : undefined;

      if (signalReceveid) {
        setLevelNominal(signalReceveid.value);

        if (
          data?.optionDescriptionNominal?.value == "integration" &&
          data?.descriptionNominal
        )
          setDescriptionNominal(signalReceveid[data?.description]);
        else if (data?.optionDescription?.value == "text")
          setDescriptionNominal(data?.description);
      }
    }
  };

  const takeDataCharging = (values) => {
    if (!!values?.length) {
      const signalReceveid = !!values[0].signals?.length
        ? data?.signalCharging?.value
          ? values[0].signals?.find(
            (x) => x.signal == data?.signalCharging?.value
          )
          : values[0].signals[0]
        : false;

      if (signalReceveid) {
        setCharging(signalReceveid.value);
      }
    }
  };

  const onClick = () => {
    if (props.activeEdit) return;
    urlRedirect(props.data?.link);
  };

  return (
    <LoadingCard id={props.id} isLoading={props.isLoading}>
      <props.component
        level={level}
        title={data?.title}
        nominal={levelNominal}
        charging={charging}
        height={height}
        width={width}
        data={data}
        id={props.id}
        onClick={props.data?.link ? onClick : undefined}
      />
    </LoadingCard>
  );
};

const mapStateToProps = (state) => ({
  listLastState: state.sensorState.listLastState,
  isLoading: state.sensorState.isLoading,
});

export default connect(mapStateToProps, undefined)(BatteryWrapper);
