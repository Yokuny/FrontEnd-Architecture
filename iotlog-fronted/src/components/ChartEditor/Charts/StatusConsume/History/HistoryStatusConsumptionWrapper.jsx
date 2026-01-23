import React from "react";
import moment from "moment";
import { Card } from "@paljs/ui/Card";
import { Button, EvaIcon } from "@paljs/ui";
import styled from "styled-components";
import { FilterData } from "../../../../FilterData";
import { Fetch } from "../../../../Fetch";
import TextSpan from "../../../../Text/TextSpan";
import { SpinnerStyled } from "../../../../Inputs/ContainerRow";
import { FormattedMessage, useIntl } from "react-intl";

const ButtonFilter = styled(Button)`
  padding: 3px;
  min-width: 28px;
  height: 28px;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
`;

const FilterDataStyled = styled.div`
  position: absolute;
  left: 8px;
  top: 8px;
  z-index: 999;
  display: flex;
  gap: 0.5rem;
  `

const HistoryStatusConsumptionWrapper = (props) => {
  const intl = useIntl();
  const { data } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  const [dataHistory, setDataHistory] = React.useState();
  const [unitStatusConsume, setUnitStatusConsume] = React.useState("m³");
  const [statusConsume, setStatusConsume] = React.useState("consumption");
  const filterDashboard = React.useRef();

  React.useEffect(() => {
    getData({
      dateInit: `${moment().subtract(6, "months").format("YYYY-MM")}-01`,
      dateEnd: undefined,
      timeInit: "00:00",
      timeEnd: "23:59",
      interval: undefined,
    });

    return () => {
      setDataHistory(undefined);
      filterDashboard.current = undefined;
    };
  }, []);

  const getData = (filter) => {
    setIsLoading(true);
    const query = [`idChart=${props.id}`];
    if (filter.dateInit) {
      query.push(
        `min=${filter.dateInit}T${
          filter.timeInit || "00:00"
        }:00.000Z`
      );
    }
    if (filter.dateEnd) {
      query.push(
        `max=${filter.dateEnd}T${
          filter.timeEnd || "23:59"
        }:59.999Z`
      );
    }
    if (props.idMachine) {
      query.push(`idMachine=${props.idMachine}`);
    }
    Fetch.get(`/sensorstate/chart/historyconsumption?${query.join("&")}`)
      .then((response) => {
        filterDashboard.current = filter;
        setDataHistory(response.data);
      })
      .catch((error) => {})
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getDateFiltered = () => {
    if (!filterDashboard.current) {
      return "";
    }

    const dateInit = moment(filterDashboard.current.dateInit);
    const dateEnd = moment(filterDashboard.current.dateEnd);
    return dateInit.isSame(dateEnd, "date")
      ? `${dateInit.format("DD MMM, YYYY")}`
      : `${dateInit.format("DD MMM, YYYY")} - ${dateEnd.format(
          "DD MMM, YYYY"
        )}`;
  };

  const onFilter = (filterData) => {
    getData(filterData);
  };

  return (
    <Card
      style={{
        boxShadow: "none",
        height: "100%",
        width: "100%",
        marginBottom: 0,
      }}
      key={props.id}
    >
      <props.component
        title={`${data.title} (${statusConsume === "consume" ? intl.formatMessage({ id: "filtered.by.consume" }) : intl.formatMessage({ id: "filtered.by.time" })}): ${getDateFiltered()}`}
        data={data}
        id={props.id}
        dataHistory={dataHistory}
        unit={unitStatusConsume}
        activeEdit={props.activeEdit}
        isMobile={props.isMobile}
        type={statusConsume}
      />

      {!props.activeEdit && (
        <FilterDataStyled>
          <FilterData
            key={props.id}
            onApply={onFilter}
            isLoading={false}
            noShowInterval
          >
            <ButtonFilter size="Tiny" status="Basic">
              <EvaIcon name="funnel-outline" />
            </ButtonFilter>
          </FilterData>
          <ButtonFilter
            size="Tiny"
            status="Basic"
            onClick={() =>
              setStatusConsume(statusConsume === "consume" ? "time" : "consume")
            }
          >
            <EvaIcon
              name={
                statusConsume === "consume"
                  ? "clock-outline"
                  : "droplet-outline"
              }
            />
            {statusConsume === "consume" ?
             <FormattedMessage id="filter.by.time" />
             :
             <FormattedMessage id="filter.by.consume" />
            }
          </ButtonFilter>
          {statusConsume === "consume" && (
            <ButtonFilter
              size="Tiny"
              status="Basic"
              onClick={() =>
                setUnitStatusConsume(unitStatusConsume === "L" ? "m³" : "L")
              }
            >
              <TextSpan apparence="s2">
                {unitStatusConsume === "L" ? "m³" : "L"}
              </TextSpan>
            </ButtonFilter>
          )}
        </FilterDataStyled>
      )}
      {isLoading && (
        <div
          style={{
            ...{
              padding: 3,
              position: "absolute",
              left: 90,
              top: 5,
              zIndex: 999,
              width: 40,
              height: 40,
            },
          }}
        >
          <SpinnerStyled />
        </div>
      )}
    </Card>
  );
};

export default HistoryStatusConsumptionWrapper;
