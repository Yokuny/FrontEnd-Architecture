import React from "react";
import { LoadingCard } from "../../../Loading";
import { Fetch } from "../../../Fetch";
import moment from "moment";
import styled from "styled-components";
import { Button, EvaIcon } from "@paljs/ui";

const ContainerButton = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 9;
`;

const LossDailyWrapper = (props) => {
  const { data, height, width } = props;

  const [lossByMachine, setLossByMachine] = React.useState([]);
  const [newValueProduced, setNewValueProduced] = React.useState();
  const [newValueLoss, setNewValueLoss] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [dateFilter, setDateFilter] = React.useState(moment());

  React.useLayoutEffect(() => {

    getData(moment());

  }, []);

  React.useLayoutEffect(() => {
    if (newValueProduced) {
      const updateIndex = lossByMachine.findIndex(
        (x) => x.idMachine == newValueProduced.idMachine
      );
      if (updateIndex >= 0) {
        let dataUpdate = lossByMachine[updateIndex];
        dataUpdate.produced =
          dataUpdate.produced + (newValueProduced.signals[0]?.value || 0);
        setLossByMachine([
          ...lossByMachine.slice(0, updateIndex),
          dataUpdate,
          ...lossByMachine.slice(updateIndex + 1),
        ]);
      }
    }
  }, [newValueProduced]);

  React.useLayoutEffect(() => {
    if (newValueLoss) {
      const updateIndex = lossByMachine.findIndex(
        (x) => x.idMachine == newValueLoss.idMachine
      );
      if (updateIndex >= 0) {
        let dataUpdate = lossByMachine[updateIndex];
        dataUpdate.loss =
          dataUpdate.loss + (newValueLoss.signals[0]?.value || 0);
        setLossByMachine([
          ...lossByMachine.slice(0, updateIndex),
          dataUpdate,
          ...lossByMachine.slice(updateIndex + 1),
        ]);
      }
    }
  }, [newValueLoss]);

  const takeDataProduction = (values) => {
    setNewValueProduced(values?.length ? values[0] : undefined);
  };

  const takeDataLoss = (values) => {
    setNewValueLoss(values?.length ? values[0] : undefined);
  };

  const getData = (dateAtual) => {
    setIsLoading(true);
    Fetch.get(
      `/sensorstate/chart/losses?idChart=${props.id}&date=${dateAtual.utc().format(
        "YYYY-MM-DD"
      )}`
    )
      .then((response) => {
        if (response.data?.length) {
          setLossByMachine(response.data);
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
        losses={lossByMachine}
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

export default LossDailyWrapper;
