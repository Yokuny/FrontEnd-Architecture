import React from "react";
import { LoadingCard } from "../../../Loading";
import { Fetch } from "../../../Fetch";
import moment from "moment";
import { Button, EvaIcon } from "@paljs/ui";
import styled from "styled-components";

const ContainerButton = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 9;
`;

const LossOperatorWrapper = (props) => {
  const { data, height, width } = props;

  const [losses, setLosses] = React.useState([]);
  const [newValue, setNewValue] = React.useState();
  const [newValueProduced, setNewValueProduced] = React.useState();
  const [newStatusOperator, setNewStatusOperator] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [dateFilter, setDateFilter] = React.useState(moment());

  React.useLayoutEffect(() => {
    getData(moment(), socket);
  }, []);

  React.useLayoutEffect(() => {
    if (newValue && dateFilter.isSame(new Date(), "day")) {
      const updateIndex = losses.findIndex(
        (x) => !x.end && x.idMachine == newValue.idMachine
      );
      if (updateIndex >= 0) {
        let dataUpdate = losses[updateIndex];
        dataUpdate.loss =
          dataUpdate.loss + (newValue.signals[0]?.value || 0);
        setLosses([
          ...losses.slice(0, updateIndex),
          dataUpdate,
          ...losses.slice(updateIndex + 1),
        ]);
      }
    }
  }, [newValue]);

  React.useLayoutEffect(() => {
    if (newValueProduced && dateFilter.isSame(new Date(), "day")) {
      const updateIndex = losses.findIndex(
        (x) => !x.end && x.idMachine == newValueProduced.idMachine
      );
      if (updateIndex >= 0) {
        let dataUpdate = losses[updateIndex];
        dataUpdate.produced =
          dataUpdate.produced + (newValueProduced.signals[0]?.value || 0);
        setLosses([
          ...losses.slice(0, updateIndex),
          dataUpdate,
          ...losses.slice(updateIndex + 1),
        ]);
      }
    }
  }, [newValueProduced]);

  React.useLayoutEffect(() => {
    if (newStatusOperator) {
      if (newStatusOperator.signals.some((x) => x.action == "end")) {
        const updateIndex = losses.findIndex(
          (x) =>
            !x.end &&
            x.idMachine == newStatusOperator.idMachine &&
            newStatusOperator.signals.some((y) => y.value == x.operator)
        );
        if (updateIndex >= 0) {
          let dataUpdate = losses[updateIndex];
          dataUpdate.end = newStatusOperator.date;
          dataUpdate.working = false;
          setLosses([
            ...losses.slice(0, updateIndex),
            dataUpdate,
            ...losses.slice(updateIndex + 1),
          ]);
        }
      } else if (newStatusOperator.signals.some((x) => x.action == "start")) {
        const operatorValue = newStatusOperator.signals.map((x) => x.value)[0];
        const operatorFinded = data.operators.find(
          (x) => x.operator.codeIntegrationUser == operatorValue
        );
        if (operatorFinded)
          setLosses([
            ...losses,
            {
              idMachine: newStatusOperator.idMachine,
              operator: operatorValue,
              name: operatorFinded.operator.name,
              dailyGoal: operatorFinded.dailyGoal,
              losses: 0,
              working: true,
              start: newStatusOperator.date,
              end: null,
            },
          ]);
      }
    }
  }, [newStatusOperator]);

  const tabkeDataLoss = (values) => {
    setNewValue(values?.length ? values[0] : undefined);
  };

  const tabkeDataProduced = (values) => {
    setNewValueProduced(values?.length ? values[0] : undefined);
  };

  const takeDataOperator = (values) => {
    setNewStatusOperator(values?.length ? values[0] : undefined);
  };

  const getData = (date, socket = undefined) => {
    setIsLoading(true);
    Fetch.get(
      `/sensorstate/chart/lossoperator?idChart=${
        props.id
      }&date=${date.utc().format("YYYY-MM-DD")}`
    )
      .then((response) => {
        if (response.data) {
          setLosses(response.data);
          if (dateFilter.isSame(new Date(), "day") && !!socket) {
            [...new Set(response.data?.map((x) => x.idMachine))].forEach(
              (x) => {
                socket.on(
                  `sensorstate_lossproduction_${x}`,
                  tabkeDataLoss
                );
                socket.on(
                  `sensorstate_production_${x}`,
                  tabkeDataProduced
                );
                socket.on(
                  `sensorstate_operator_${x}`,
                  takeDataOperator
                );
              }
            );
          }
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
    <>
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
          losses={losses}
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
    </>
  );
};

export default LossOperatorWrapper;
