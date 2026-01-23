import React from "react";
import { Card, CardBody, CardHeader } from "@paljs/ui/Card";
import moment from "moment";
import { LoadingCard } from "../../../Loading";
import { Fetch } from "../../../Fetch";
import { FilterData } from "../../../FilterData";
import { Button, Col, EvaIcon, Row } from "@paljs/ui";
import Overlay from "../../../Overlay";
import styled, { useTheme } from "styled-components";
import { FilterDataOverlay } from "../../../FilterData/FilterOverlay";
import TextSpan from "../../../Text/TextSpan";
import { FormattedMessage } from "react-intl";
import ListSensors from "./ListSensors";

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

const LoadingCardStyled = styled(LoadingCard)`
  .overlay-pane {
    z-index: 1020;
  }
`

const HistoryListWrapper = (props) => {
  const { data, filterDashboard } = props;

  const theme = useTheme();

  const [isLoading, setIsLoading] = React.useState(false);
  const [isShowFull, setIsShowFull] = React.useState(false);
  const [isShowFilter, setIsShowFilter] = React.useState(false);
  const [isNoShowDataLabel, setIsNoShowDataLabel] = React.useState(true);
  const [historyData, setHistoryData] = React.useState([]);
  const [status, setStatus] = React.useState();
  const [sensorsFilter, setSensorsFilter] = React.useState(props.idSensors?.length ? props.idSensors : []);
  const [filter, setFilter] = React.useState({
    dateInit: undefined,
    dateEnd: undefined,
    timeInit: "00:00",
    timeEnd: "23:59",
    interval: "30",
  });



  React.useEffect(() => {
    getData(filter, sensorsFilter);
  }, []);

  React.useEffect(() => {
    if (filterDashboard) {
      getData(filterDashboard, sensorsFilter);
    }
  }, [filterDashboard]);

  const getData = (filterInternal, sensorsFilter, isAdd = false) => {
    const { dateInit, dateEnd, timeInit, timeEnd, interval } = filterInternal;

    if (!sensorsFilter?.length) {
      setFilter(filterInternal);
      return;
    }

    setIsLoading(true);

    let query = [
      `idChart=${props.id}`,
      `min=${moment(dateInit).format("YYYY-MM-DD")}T${timeInit || "00:00"}:00${moment(dateInit).format("Z")}`,
      `max=${moment(dateEnd).format("YYYY-MM-DD")}T${timeEnd || "23:59"}:59${moment(dateEnd).format("Z")}`,
      interval === "noInterval" ? `noInterval=true` : `interval=${interval || 30}`
    ]

    if (props.idMachine) {
      query.push(`idMachine=${props.idMachine}`);
    }

    sensorsFilter.forEach(x => {
      query.push(`idSensor[]=${x}`);
    });

    Fetch.get(
      `/sensorstate/chart/historylist?${query.join('&')}`
    )
      .then((res) => {
        if (!isAdd) {
          setHistoryData(res.data);
          setFilter(filterInternal)
        } else {
          setHistoryData(prevState => [...prevState, ...res.data]);
        }
        setIsLoading(false);
        setStatus(200);
      })
      .catch((e) => {
        setIsLoading(false)
        setStatus(e?.response?.status);
      });
  };

  const onRemove = (idSensor) => {
    setSensorsFilter(prevState => prevState?.filter(x => x !== idSensor) || []);
    setHistoryData(prevState => prevState?.filter(x => x.idSensor !== idSensor) || []);
  }

  const onRemoveAll = () => {
    setSensorsFilter([])
    setHistoryData([]);
  }

  const onAdd = (idSensor) => {
    setSensorsFilter(prevState => [...prevState, idSensor]);
    getData(filter, [idSensor], true)
  }

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
    <LoadingCardStyled key={props.id}>
      <Card
        status={statusShow?.status}
        style={{
          boxShadow: "none",
          border: `1px solid ${theme.borderBasicColor3}`,
          height: "100%", width: "100%", marginBottom: 0
        }}
        key={props.id}>
        {statusShow?.header}
        <Row className="m-0" style={{ height: '100%' }}>
          <Col breakPoint={{ md: 3 }} className="pt-4" style={{ height: '100%' }}>
            <ListSensors
              onAdd={onAdd}
              onRemove={onRemove}
              onRemoveAll={onRemoveAll}
              sensorsFilter={sensorsFilter}
              idMachine={data?.machine?.value}
              isLoadingData={isLoading}
            />
          </Col>
          <Col breakPoint={{ md: 9 }} style={{ height: '100%' }}>
            <props.component
              series={historyData}
              title={data?.title}
              data={data}
              id={props.id}
              activeEdit={props.activeEdit}
              isMobile={props.isMobile}
              isNoShowDataLabel={isNoShowDataLabel}
            />
          </Col>
        </Row>

        {!props.activeEdit && (
          <>
            <FilterData
              key={props.id} onApply={(filter) => getData(filter, sensorsFilter)} isLoading={isLoading}>
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
                <CardBody style={{ margin: 0, overflowY: 'hidden' }}>
                  <Row className="m-0" style={{ height: '100%' }}>
                    <Col breakPoint={{ md: 2 }} className="pt-4" style={{ height: '100%' }}>
                      <ListSensors
                        onAdd={onAdd}
                        onRemove={onRemove}
                        sensorsFilter={sensorsFilter}
                        idMachine={data?.machine?.value}
                        isLoadingData={isLoading}
                      />
                    </Col>
                    <Col breakPoint={{ md: 10 }} style={{ height: '100%' }}>
                      <props.component
                        series={historyData}
                        title={data?.title}
                        data={data}
                        id={props.id}
                        activeEdit={props.activeEdit}
                        isMobile={props.isMobile}
                        isNoShowDataLabel={isNoShowDataLabel}
                      />
                    </Col>
                  </Row>

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
    </LoadingCardStyled >
  );
};

export default HistoryListWrapper;
