import { Button, EvaIcon, Row } from "@paljs/ui";
import { Card, CardHeader } from "@paljs/ui/Card";
import moment from "moment";
import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  getStatusConsume,
  setDataStatusConsume,
  setFilterStatusConsume,
  setUnitStatusConsume,
} from "../../../../actions";
import { FilterData } from "../../../FilterData";
import TextSpan from "../../../Text/TextSpan";

const ButtonFilter = styled(Button)`
  padding: 3px;
  position: absolute;
  left: 8px;
  top: 8px;
  z-index: 999;
`;

const ButtonUnit = styled(Button)`
  position: absolute;
  padding: 5px;
  width: 27px;
  height: 27px;
  left: 45px;
  top: 8px;
  z-index: 999;
`;

const StatusConsumptionWrapper = (props) => {
  const { data, filterDashboard } = props;

  const dateInit = moment().subtract(7, "days").format("YYYY-MM-DD");

  const [date, setDate] = React.useState({
    dateInit: dateInit,
    dateEnd: undefined,
  });

  React.useEffect(() => {
    getData({
      dateInit: dateInit,
      dateEnd: undefined,
      timeInit: "00:00",
      timeEnd: "23:59",
      interval: undefined,
    });

    return () => {
      props.setDataStatusConsume([]);
      props.setFilterStatusConsume(undefined);
    };
  }, []);

  React.useEffect(() => {
    if (filterDashboard) {
      getData(filterDashboard);
      setDate(filterDashboard);
    }
  }, [filterDashboard]);

  const getData = (filter) => {
    props.getStatusConsume({
      ...filter,
      idChart: props.id,
      idMachine: props.idMachine,
    });
    props.setFilterStatusConsume([null,
      {
        dateInit: filter.dateInit,
        dateEnd: filter.dateEnd,
        idMachine: props.data?.machine.value,
      },
    ]);
  };

  const getDateFiltered = () => {
    const dateInit = moment(date.dateInit);
    const dateEnd = moment(date.dateEnd);
    return dateInit.isSame(dateEnd, "date")
      ? `${dateInit.format("DD MMM, YYYY")}`
      : `${dateInit.format("DD MMM, YYYY")} - ${dateEnd.format(
          "DD MMM, YYYY"
        )}`;
  };

  const onFilter = (filterData) => {
    getData(filterData);
    setDate(filterData);
  };

  const getStatusErro = () => {
    if (props.statusResponse === 400) {
      return {
        status: "Warning",
        header: (
          <CardHeader>
            <Row end="xs" className="ml-4 mr-2">
              <TextSpan apparence="s2">
                <FormattedMessage id="warning" />
              </TextSpan>
            </Row>
          </CardHeader>
        ),
      };
    }
    if (props.statusResponse >= 500) {
      return {
        status: "Danger",
        header: (
          <CardHeader>
            <Row end="xs" className="ml-4 mr-2">
              <TextSpan apparence="s2">
                <FormattedMessage id="error" />
              </TextSpan>
            </Row>
          </CardHeader>
        ),
      };
    }
    return;
  };

  const statusShow = getStatusErro();

  return (
    <Card
      status={statusShow?.status}
      style={{
        boxShadow: "none",
        height: "100%",
        width: "100%",
        marginBottom: 0,
      }}
    >
      {statusShow?.header}
      <props.component
        title={data?.title}
        dataConfig={data}
        id={props.id}
        activeEdit={props.activeEdit}
        isMobile={props.isMobile}
      />

      {!props.activeEdit && (
        <>
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
          <ButtonUnit
            size="Tiny"
            status="Basic"
            onClick={() =>
              props.setUnitStatusConsume(
                props.unitStatusConsume === "L" ? "m³" : "L"
              )
            }
          >
            <TextSpan apparence="s2">
              {props.unitStatusConsume === "L" ? "m³" : "L"}
            </TextSpan>
          </ButtonUnit>
        </>
      )}
      <div style={{ position: "fixed", left: "30%", top: 10 }}>
        <TextSpan apparence="p3" hint>
          <FormattedMessage id="consume" />: {getDateFiltered()}
        </TextSpan>
      </div>
      {props.filterStatusConsume?.length ? (
        <Button
          size="Tiny"
          status="Danger"
          appearance="ghost"
          style={{ position: "fixed", right: 0, top: 10, marginRight: "10px" }}
          onClick={() => props.setFilterStatusConsume([null, props.filterStatusConsume[1]])}
        >
          <FormattedMessage id="clear.filter" />
        </Button>
      ) : null}
    </Card>
  );
};

const mapStateToProps = (state) => ({
  unitStatusConsume: state.chartData.unitStatusConsume,
  statusResponse: state.chartData.statusResponse,
  filterStatusConsume: state.chartData.filterStatusConsume,
});

const mapDispatchToProps = (dispatch) => ({
  getStatusConsume: (filter) => {
    dispatch(getStatusConsume(filter));
  },
  setFilterStatusConsume: (disabled) => {
    dispatch(setFilterStatusConsume(disabled));
  },
  setDataStatusConsume: (data) => {
    dispatch(setDataStatusConsume(data));
  },
  setUnitStatusConsume: (unit) => {
    dispatch(setUnitStatusConsume(unit));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusConsumptionWrapper);
