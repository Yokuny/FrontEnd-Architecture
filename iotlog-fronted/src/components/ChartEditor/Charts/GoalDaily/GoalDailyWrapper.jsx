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

const GoalDailyWrapper = (props) => {
  const { data, height, width } = props;

  const [producesByMachine, setProducesByMachine] = React.useState([]);
  const [goalByMachine, setGoalByMachine] = React.useState([]);
  const [newValue, setNewValue] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [dateFilter, setDateFilter] = React.useState(moment());

  React.useEffect(() => {

    getData(moment());
  }, []);

  React.useEffect(() => {
    if (newValue) {
      const updateIndex = producesByMachine.findIndex(
        (x) => x.idMachine == newValue.idMachine
      );
      if (updateIndex >= 0) {
        let dataUpdate = producesByMachine[updateIndex];
        dataUpdate.produced =
          dataUpdate.produced + (newValue.signals[0]?.value || 0);
        setProducesByMachine([
          ...producesByMachine.slice(0, updateIndex),
          dataUpdate,
          ...producesByMachine.slice(updateIndex + 1),
        ]);
      }
    }
  }, [newValue]);

  const takeData = (values) => {
    setNewValue(values?.length ? values[0] : undefined);
  };

  const getData = (dateAtual) => {
    setIsLoading(true);
    Fetch.get(
      `/sensorstate/chart/produced?idChart=${props.id}&date=${dateAtual.utc().format(
        "YYYY-MM-DD"
      )}`
    )
      .then((response) => {
        if (response.data?.length) {
          setProducesByMachine(response.data);
          setGoalByMachine(response.data);
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
        produces={producesByMachine}
        goals={goalByMachine}
        dateFilter={dateFilter}
        title={data?.title}
        data={data}
        id={props.id}
        activeEdit={props.activeEdit}
        isMobile={props.isMobile}
      />
    </LoadingCard>
  );
};

export default GoalDailyWrapper;
