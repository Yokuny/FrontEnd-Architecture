import { Button, Card, CardBody, CardHeader, Col, EvaIcon, Row } from "@paljs/ui";
import React, { useState } from "react";
import { connect } from "react-redux";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import { loadAndGet } from "./DecodeSensorData";
import { SpinnerStyled } from "../../components/Inputs/ContainerRow";
import FilterData from "./FilterData";
import { Fetch, LabelIcon, TextSpan } from "../../components";
import SelectMachineFiltered from "../remote-ihm/bravante/SelectMachineFiltered";
import TrendChart from "./TrendChart";
import ListSensors from "./ListSensors";

function DataLogger(props) {

  const [machine, setMachine] = useState(null);
  const [sensorsFilter, setSensorsFilter] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();

  const idSensorsNewRef = React.useRef([]);

  const dateInit = searchParams.get("dateInit");
  const dateEnd = searchParams.get("dateEnd");
  const timeInit = searchParams.get("timeInit");
  const timeEnd = searchParams.get("timeEnd");
  const interval = searchParams.get("interval") || "30";
  const idAsset = searchParams.get("idAsset");

  const intl = useIntl();

  const idEnterprise = props.enterprises?.length ? props.enterprises[0].id : localStorage.getItem("id_enterprise_filter");

  React.useEffect(() => {
    onRemoveAll();
  }, [machine]);

  const onRemoveAll = () => {
    idSensorsNewRef.current = [];
    setSensorsFilter([])
    setHistoryData([]);
  }

  const getData = (sensorsFilter, isAdd = false) => {

    if (moment(dateInit).isAfter(moment(dateEnd))) {
      toast.warn(intl.formatMessage({ id: "date.end.is.before.date.start" }));
      return;
    }
    if (!sensorsFilter?.length) {
      toast.warn(intl.formatMessage({ id: "sensor.required" }));
      return;
    }
    if (interval === "" || interval === undefined) {
      toast.warn(intl.formatMessage({ id: "interval.required" }));
      return;
    }

    const diffDatesMoreThan15Days = moment(dateEnd).diff(moment(dateInit), 'days') > 15;
    if (diffDatesMoreThan15Days) {
      toast.warn(intl.formatMessage({ id: "interval.required.when.date.range.more.than.15.days" }));
      return;
    }

    setIsLoading(true);

    let query = [
      `min=${moment(dateInit).format("YYYY-MM-DD")}T${timeInit || "00:00"}:00${moment(dateInit).format("Z")}`,
      `max=${moment(dateEnd).format("YYYY-MM-DD")}T${timeEnd || "23:59"}:59${moment(dateEnd).format("Z")}`,
    ]

    if (Number(interval) === 0) {
      query.push(`noInterval=true`);
    } else {
      query.push(`interval=${interval || 30}`);
    }

    sensorsFilter.forEach(x => {
      query.push(`idSensor[]=${x}`);
    });

    const root = loadAndGet();
    const TimeSeriesCollection = root.lookupType('timeseries.TimeSeriesCollection');

    Fetch.get(
      `/sensordata/${machine?.value}?${query.join('&')}`,
      {
        isV2: true,
        responseType: 'arraybuffer',
        defaultTakeCareError: false,
      }
    )
      .then((response) => {
        if (!response.data) {
          setIsLoading(false);
          return;
        }

        const buffer = new Uint8Array(response.data);
        const collection = TimeSeriesCollection.decode(buffer)?.series || [];
        if (!collection?.length) {
          setIsLoading(false);
          return;
        }

        idSensorsNewRef.current = []
        if (!isAdd) {
          setHistoryData(collection);

        } else {
          setHistoryData(prevState => [...prevState, ...collection]);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        if (e?.response?.status === 400) {
          toast.warn(intl.formatMessage({ id: "error.query.fields" }));
        } else {
          toast.error(intl.formatMessage({ id: "error.get" }));
        }
        setIsLoading(false)
      });
  };

  const onAddManySensors = (sensors) => {
    if (!sensors?.length) {
      setSensorsFilter([]);
      idSensorsNewRef.current = [];
      return;
    }
    const hasNewSensors = sensors?.filter(x => !sensorsFilter?.includes(x));
    const sensorsToRemove = sensorsFilter?.filter(x => !sensors?.includes(x));
    if (hasNewSensors?.length) {
      setSensorsFilter([...sensorsFilter?.filter(x => !sensorsToRemove?.includes(x)), ...hasNewSensors]);
      idSensorsNewRef.current.push(...hasNewSensors);
    } else {
      setSensorsFilter(sensorsFilter?.filter(x => !sensorsToRemove?.includes(x)) || []);
    }
  }

  const onHandleSearch = () => {
    getData(idSensorsNewRef.current?.length
      ? idSensorsNewRef.current
      : sensorsFilter, idSensorsNewRef.current?.length);
  }

  return (
    <Card>
      <CardHeader>
        <Col breakPoint={{ md: 6, xs: 12, is: 8, sm: 8 }}>
          <Row middle="xs">
            <TextSpan apparence="s1">
              <FormattedMessage id="trends" />
            </TextSpan>
            {!idAsset && (
              <Col breakPoint={{ md: 8 }}>
                <SelectMachineFiltered
                  idEnterprise={idEnterprise}
                  onChange={(value) => setMachine(value)}
                  placeholder="machine.placeholder"
                  value={machine}
                  renderLastActivity
                />
              </Col>
            )}
          </Row>
        </Col>
      </CardHeader>
      {!!machine?.value &&
        <CardBody style={{
          maxHeight: "calc(100vh - 250px)", overflowY: "auto"
        }}>
          <Row style={{
            display: "flex",
            height: "100%",
          }}>
            <Col breakPoint={{ is: 6, sm: 12, md: 5.5, xs: 12, lg: 4, xl: 3 }}>
              <LabelIcon
                title={intl.formatMessage({ id: "sensors" })}
                iconName="flash-outline"
              />
              <ListSensors
                noMarginTop
                onAddManySensors={onAddManySensors}
                sensorsFilter={sensorsFilter}
                idMachine={machine?.value}
                isLoadingData={isLoading}
                styleList={{ minHeight: 200, maxHeight: `calc(100vh - ${sensorsFilter?.length ? 330 : 300}px)`, overflowY: "auto", marginBottom: "1rem" }}
              />

              <FilterData />

              <Row className="m-0 pt-4 pb-2" center="xs" middle="xs">
                {isLoading
                  ? <SpinnerStyled />
                  : <Button
                    //appearance="outline"
                    status="Info"
                    className="flex-between mt-2"
                    size="Small"
                    onClick={onHandleSearch}
                    disabled={isLoading || !sensorsFilter?.length || !dateInit || !dateEnd}
                  >
                    <EvaIcon name="search-outline" />
                    <FormattedMessage id="search" />
                  </Button>}
              </Row>
            </Col>
            <Col
              style={{ minHeight: "calc(100vh - 315px)" }}
              breakPoint={{ is: 6, sm: 12, md: 6.5, xs: 12, lg: 8, xl: 9 }}>
              <TrendChart
                series={historyData}
                title={``}
                isNoShowDataLabel={false}
                data={{ typeChart: { value: "line" } }}
              />
            </Col>
          </Row>
        </CardBody>}
    </Card>
  );
}

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, null)(DataLogger);
