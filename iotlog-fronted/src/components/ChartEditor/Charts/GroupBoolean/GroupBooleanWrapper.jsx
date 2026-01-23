import React from "react";
import moment from "moment";
import styled from "styled-components";
import { Button, EvaIcon } from "@paljs/ui";
import { useSocket } from "../../../Contexts/SocketContext";
import { LoadingCard } from "../../../Loading";
import { Fetch } from "../../../Fetch";

const ContainerButton = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 9;
`;

const GroupBooleanWrapper = (props) => {
  const { data, height, width } = props;

  const [countSignalsTrue, setCountSignalsTrue] = React.useState([]);
  const [newValue, setNewValue] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [dateFilter, setDateFilter] = React.useState(moment());

  const socket = useSocket();

  React.useEffect(() => {
    if (!socket) return;
    if (data?.machines?.length)
      data.machines.forEach((x) => {
        socket.on(
          `sensorstate_${x?.sensor?.value}_${x?.machine?.value}`,
          takeData
        );
      });


    return () => {
      if (data?.machines?.length)
        data.machines.forEach((x) => {
          socket.off(
            `sensorstate_${x?.sensor?.value}_${x?.machine?.value}`,
            takeData
          );
        });
    };
  }, [socket, data]);

  React.useEffect(() => {
      getData(moment());
  }, []);

  React.useEffect(() => {
    if (newValue && newValue.signals.some((x) => x.value)) {
      const updateIndex = countSignalsTrue.findIndex(
        (x) =>
          x.idMachine == newValue.idMachine && x.sensorId == newValue.sensorId
      );
      if (updateIndex >= 0) {
        let dataUpdate = countSignalsTrue[updateIndex];
        dataUpdate.total = dataUpdate.total + 1;
        setCountSignalsTrue([
          ...countSignalsTrue.slice(0, updateIndex),
          dataUpdate,
          ...countSignalsTrue.slice(updateIndex + 1),
        ]);
      } else {
        setCountSignalsTrue([
          ...countSignalsTrue,
          {
            idMachine: newValue.idMachine,
            sensorId: newValue.sensorId,
            total: 1
          },
        ]);
      }
    }
  }, [newValue]);

  const takeData = (values) => {
    setNewValue(values?.length ? values[0] : undefined);
  };

  const getData = (dateAtual) => {
    setIsLoading(true);
    const dateFiltered = dateAtual.utc().format("YYYY-MM-DD");
    Fetch.get(
      `/sensorstate/chart/manycountboolean?idChart=${props.id}&min=${dateFiltered}&max=${dateFiltered}`
    )
      .then((response) => {
        if (response.data?.length) {
          setCountSignalsTrue(response.data);
        } else {
          setCountSignalsTrue([]);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const filterSubtract = () => {
    setDateFilter(dateFilter.subtract(1, "days"));
    getData(dateFilter);
  };

  const filterAdd = () => {
    setDateFilter(dateFilter.add(1, "days"));
    getData(dateFilter);
  };

  return (
    <LoadingCard isLoading={isLoading}>
      {!props.activeEdit && (
        <ContainerButton>
          <Button size="Tiny" status="Basic" onClick={() => filterSubtract()}>
            <EvaIcon name="arrow-ios-back-outline" />
          </Button>
          <Button
            size="Tiny"
            status="Basic"
            className="ml-2"
            onClick={() => filterAdd()}
          >
            <EvaIcon name="arrow-ios-forward-outline" />
          </Button>
        </ContainerButton>
      )}
      <props.component
        countSignalsTrue={countSignalsTrue}
        dateFilter={dateFilter}
        title={data?.title}
        height={height}
        width={width}
        data={data}
        id={props.id}
        activeEdit={props.activeEdit}
        isMobile={props.isMobile}
      />
    </LoadingCard>
  );
};

export default GroupBooleanWrapper;
