import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { urlRedirect } from "../Utils";
import { LoadingCard } from "../../Loading";
import { useSocket } from "../../Contexts/SocketContext";

const BasicShowWrapper = (props) => {
  const { data, height, width } = props;

  const [sensorData, setSensorData] = React.useState();
  const [description, setDescription] = React.useState(
    data?.optionDescription?.value == "text" ? data?.description : ""
  );

  const socket = useSocket();

  React.useEffect(() => {

    if (!socket || !data?.machine?.value) {
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
    const dataToUpdate = props.listLastState?.filter(
      (x) =>
        x.idMachine == data?.machine?.value && x.idSensor == data?.sensor?.value
    );

    if (dataToUpdate?.length) {
      takeData(dataToUpdate);
    }
  }, [props.listLastState]);

  const takeData = (values) => {
    if (!!values?.length) {
      const sensorToUpdate = values[0];
      if (
        (!sensorData || moment(sensorToUpdate.date).isAfter(sensorData.date))
      ) {
        setSensorData({
          value: sensorToUpdate.value,
          date: sensorToUpdate.date,
        });

        if (
          data?.optionDescription?.value == "integration" &&
          data?.description
        )
          setDescription(sensorToUpdate[data?.description]);
        else if (data?.optionDescription?.value == "text")
          setDescription(data?.description);
      }
    }
  };

  const onClick = () => {
    if (props.activeEdit) return;

    if (props.onHandleOpen) {
      props.onHandleOpen({
        idMachine: props.idMachine,
        idSensors: [data?.sensor?.value],
      });
      return;
    }

    urlRedirect(props.data?.link);
  };

  return (
    <LoadingCard key={props.id} isLoading={props.isLoading}>
      <props.component
        value={sensorData?.value}
        title={data?.title}
        description={description}
        height={height}
        width={width}
        data={data}
        id={props.id}
        onClick={props.data?.link || props.onHandleOpen ? onClick : undefined}
      />
    </LoadingCard>
  );
};

const mapStateToProps = (state) => ({
  listLastState: state.sensorState.listLastState,
  isLoading: state.sensorState.isLoading,
});

export default connect(mapStateToProps, undefined)(BasicShowWrapper);
