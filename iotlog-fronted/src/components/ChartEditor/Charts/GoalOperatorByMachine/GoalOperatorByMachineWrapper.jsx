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

const GoalOperatorByMachineWrapper = (props) => {
  const { data, height, width } = props;

  const [produced, setProduced] = React.useState([]);
  const [newValue, setNewValue] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [dateFilter, setDateFilter] = React.useState(moment());

  React.useLayoutEffect(() => {
    getData(moment());
  }, []);

  React.useLayoutEffect(() => {
    if (newValue && dateFilter.isSame(new Date(), "day")) {
      const updateIndex = produced.data.findIndex((x) => x.working > 0);
      if (updateIndex >= 0) {
        let dataUpdate = produced.data[updateIndex];
        dataUpdate.working =
          dataUpdate.working + (newValue.signals[0]?.value || 0);
        setProduced({
          ...produced,
          data: [
            ...produced.data.slice(0, updateIndex),
            dataUpdate,
            ...produced.data.slice(updateIndex + 1),
          ],
        });
      }
    }
  }, [newValue]);

  const takeData = (values) => {
    setNewValue(values?.length ? values[0] : undefined);
  };

  const getData = (date) => {
    setIsLoading(true);
    Fetch.get(
      `/sensorstate/chart/producedoperator?idChart=${
        props.id
      }&date=${date.utc().format("YYYY-MM-DD")}`
    )
      .then((response) => {
        if (response.data) {
          setProduced(response.data);
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
          produced={produced}
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

export default GoalOperatorByMachineWrapper;
