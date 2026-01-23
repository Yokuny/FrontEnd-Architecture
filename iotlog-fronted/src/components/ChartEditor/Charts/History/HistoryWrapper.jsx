import React from "react";
import { Card, CardBody, CardHeader } from "@paljs/ui/Card";
import moment from "moment";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import { LoadingCard } from "../../../Loading";
import { Fetch } from "../../../Fetch";
import { FilterData } from "../../../FilterData";
import { Button, EvaIcon, Row } from "@paljs/ui";
import Overlay from "../../../Overlay";
import { FilterDataOverlay } from "../../../FilterData/FilterOverlay";
import TextSpan from "../../../Text/TextSpan";

const FullCard = styled(Card)`
  width: calc(100vw);
  height: calc(100vh);
  display: flex;
  margin: 0;
`;

const ButtonExpand = styled(Button)`
  padding: 3px;
  position: absolute;
  right: 8px;
  bottom: 8px;
  z-index: 999;
`;

const ButtonCollapse = styled(Button)`
  padding: 3px;
  position: absolute;
  right: 16px;
  bottom: 12px;
  z-index: 999;
`;

const ButtonFilter = styled(Button)`
  padding: 3px;
  position: absolute;
  left: 8px;
  top: 8px;
  z-index: 999;
`;

const ButtonEyeView = styled(Button)`
  padding: 3px;
  position: absolute;
  left: 44px;
  top: 8px;
  z-index: 999;
`;

const HistoryWrapper = (props) => {
  const { data, filterDashboard } = props;

  const [isLoading, setIsLoading] = React.useState(false);
  const [isShowFull, setIsShowFull] = React.useState(false);
  const [isShowFilter, setIsShowFilter] = React.useState(false);
  const [isNoShowDataLabel, setIsNoShowDataLabel] = React.useState(true);
  const [historyData, setHistoryData] = React.useState([]);
  const [status, setStatus] = React.useState();

  React.useEffect(() => {
    getData({
      dateInit: undefined,
      dateEnd: undefined,
      timeInit: "00:00",
      timeEnd: "23:59",
      interval: undefined,
    });
  }, []);

  React.useEffect(() => {
    if (filterDashboard) {
      getData(filterDashboard);
    }
  }, [filterDashboard]);

  const getData = ({ dateInit, dateEnd, timeInit, timeEnd, interval }) => {
    setIsLoading(true);

    const query = [
      `idChart=${props.id}`,
      `min=${moment(dateInit).format("YYYY-MM-DD")}T${timeInit || "00:00"}:00${moment(dateInit).format("Z")}`,
      `max=${moment(dateEnd).format("YYYY-MM-DD")}T${timeEnd || "23:59"}:59${moment(dateEnd).format("Z")}`,
      interval === "noInterval"
        ? `noInterval=true`
        : `interval=${interval || 30}`
    ]

    if (props.idMachine) {
      query.push(`idMachine=${props.idMachine}`);
    }

    if (props.idSensors) {
      query.push(`idSensors=${props.idSensors}`);
    }

    Fetch.get(
      `/sensorstate/chart/history?${query.join("&")}`
    )
      .then((res) => {
        setHistoryData(res.data);
        setIsLoading(false);
        setStatus(200);
      })
      .catch((e) => {
        setIsLoading(false)
        setStatus(e?.response?.status);
      });
  };

  const getStatusErro = () => {
    if (status === 400) {
      return {
        status: "Warning",
        header: <CardHeader>
          <Row end="xs" className="ml-4 mr-2">
            <TextSpan apparence="s2">
              <FormattedMessage id="warning" />
            </TextSpan>
          </Row>
        </CardHeader>
      }
    }
    if (status >= 500) {
      return {
        status: "Danger",
        header: <CardHeader>
          <Row end="xs" className="ml-4 mr-2">
            <TextSpan apparence="s2">
              <FormattedMessage id="error" />
            </TextSpan>
          </Row>
        </CardHeader>
      }
    }
    return;
  }

  const statusShow = getStatusErro();

  return (
    <LoadingCard key={props.id}>
      <Card status={statusShow?.status} style={{
        boxShadow: "none",
        height: "100%", width: "100%", marginBottom: 0
      }} key={props.id}>
        {statusShow?.header}
        <props.component
          series={historyData}
          title={data?.title}
          data={data}
          id={props.id}
          activeEdit={props.activeEdit}
          isMobile={props.isMobile}
          isNoShowDataLabel={isNoShowDataLabel}
        />

        {!props.activeEdit && (
          <>
            <FilterData key={props.id} onApply={getData} isLoading={isLoading}>
              <ButtonFilter size="Tiny" status="Basic">
                <EvaIcon name="funnel-outline" />
              </ButtonFilter>
            </FilterData>

            <ButtonEyeView
              status="Basic"
              onClick={() => setIsNoShowDataLabel((prevState) => !prevState)}
            >
              <EvaIcon
                name={!isNoShowDataLabel ? "eye-off-outline" : "eye-outline"}
              />
            </ButtonEyeView>

            <Overlay
              className="inline-block"
              trigger="click"
              placement="top"
              positionOverlay={{ top: 2, left: 2 }}
              showControlOutside={isShowFull}
              controlOutside
              key={props.id}
              target={
                <>
                  <ButtonExpand
                    size="Tiny"
                    status="Basic"
                    onClick={() => setIsShowFull(true)}
                  >
                    <EvaIcon name="expand-outline" />
                  </ButtonExpand>
                </>
              }
            >
              <FullCard>
                <CardBody style={{ margin: 0 }}>
                  <props.component
                    series={historyData}
                    title={data?.title}
                    data={data}
                    id={props.id}
                    activeEdit={props.activeEdit}
                    isMobile={props.isMobile}
                    isNoShowDataLabel={isNoShowDataLabel}
                  />

                  <FilterDataOverlay
                    isShowFilter={isShowFilter}
                    onRequestClose={() => setIsShowFilter(false)}
                    onApply={getData}
                    isLoading={isLoading}
                    key={props.id}
                  >
                    <ButtonFilter
                      size="Tiny"
                      status={isShowFilter ? "Info" : "Basic"}
                      onClick={() =>
                        setIsShowFilter((prevState) =>
                          prevState ? false : true
                        )
                      }
                    >
                      <EvaIcon name="funnel-outline" />
                    </ButtonFilter>
                  </FilterDataOverlay>
                  <ButtonEyeView
                    status="Basic"
                    onClick={() =>
                      setIsNoShowDataLabel((prevState) => !prevState)
                    }
                  >
                    <EvaIcon
                      name={
                        !isNoShowDataLabel ? "eye-off-outline" : "eye-outline"
                      }
                    />
                  </ButtonEyeView>
                  <ButtonCollapse
                    size="Tiny"
                    status="Basic"
                    onClick={() => setIsShowFull(false)}
                  >
                    <EvaIcon name="collapse-outline" />
                  </ButtonCollapse>
                </CardBody>
              </FullCard>
            </Overlay>
          </>
        )}
      </Card>
    </LoadingCard >
  );
};

export default HistoryWrapper;
