import React from "react";
import { connect } from "react-redux";
import { LoadingCard } from "../../../Loading";
import { urlRedirect } from "../../Utils";
import { useSocket } from "../../../Contexts/SocketContext";

const BatteryChargeWrapper = (props) => {
  const { data, height, width } = props;

  const [percentual, setPercentual] = React.useState();
  const [status, setStatus] = React.useState();

  const socket = useSocket();
  React.useEffect(() => {
    if (!socket || !data?.machine?.value) {
      return;
    }
    socket.on(
      `sensorstate_${data?.sensorPercent?.value}_${data?.machine?.value}`,
      takePercentual
    );
    socket.on(
      `sensorstate_${data?.sensorStatus?.value}_${data?.machine?.value}`,
      takeDataStatus
    );

    return () => {
      socket.off(
        `sensorstate_${data?.sensorPercent?.value}_${data?.machine?.value}`,
        takePercentual
      );
      socket.off(
        `sensorstate_${data?.sensorStatus?.value}_${data?.machine?.value}`,
        takeDataStatus
      );
    };
  }, [socket, data]);

  React.useEffect(() => {
    if (props.listLastState?.length) {
      const hasLevel = props.listLastState.filter(
        (x) =>
          x.idMachine === data?.machine?.value &&
          x.idSensor === data?.sensorPercent?.value
      );

      hasLevel?.length && takePercentual(hasLevel);

      const hasLevelNominal = props.listLastState.filter(
        (x) =>
          x.idMachine === data?.machine?.value &&
          x.idSensor === data?.sensorStatus?.value
      );
      hasLevelNominal?.length && takeDataStatus(hasLevelNominal);
    }
  }, [props.listLastState]);

  const takePercentual = (values) => {
    if (!!values?.length) {
      const signalReceveid = values[0].value;
      if (signalReceveid !== undefined) {
        setPercentual(signalReceveid);
      }
    }
  };

  const takeDataStatus = (values) => {
    if (!!values?.length) {
      const signalReceveid = values[0].value;
      if (signalReceveid !== undefined) {
        setStatus(signalReceveid);
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
        percentual={percentual}
        status={status}
        title={data?.title}
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

export default connect(mapStateToProps, undefined)(BatteryChargeWrapper);
