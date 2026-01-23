import { Button, Col, EvaIcon, Popover, Row, Spinner } from "@paljs/ui";
import { Card, CardHeader } from "@paljs/ui/Card";
import moment from "moment";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import styled from "styled-components";
import DateTime from "../../../DateTime";
import { Fetch } from "../../../Fetch";
import { Divide } from "../../../Info";
import { LabelIcon } from "../../../Label";
import TextSpan from "../../../Text/TextSpan";

const ContainerRow = styled(Row)`
  z-index: 9;
  display: flex;
  flex-direction: row;

  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;

  input {
    line-height: 1.2rem;
  }

  a svg {
    top: -6px;
    position: absolute;
    right: -5px;
  }
`;


const FuelConsumptionWrapper = (props) => {
  const { data } = props;

  const intl = useIntl()

  const [dateInit, setDateInit] = React.useState(moment().subtract(data?.lastDaysSearch, 'days').format("YYYY-MM-DD"))
  const [dateEnd, setDateEnd] = React.useState(moment().format("YYYY-MM-DD"))
  const [fuelConsumption, setFuelConsumption] = React.useState()
  const [measureUnit, setMeasureUnit] = React.useState()
  const [isLoading, setIsLoading] = React.useState(true)
  const [popoverVisible, setPopoverVisible] = React.useState(false);

  const [dateFiltered, setDateFiltered] = React.useState({
    dateInit: null,
    dateEnd: null
  })

  React.useLayoutEffect(() => {
    if (props.data.machine) fetchData(props.data.machine.value, dateInit, dateEnd);
  }, []);

  function fetchData(idMachine, _dateInit, _dateEnd) {
    setPopoverVisible(false)

    setIsLoading(true);
    const filter = {
      idMachine,
      dateInit: moment(dateInit).format("YYYY-MM-DDT00:00:00Z"),
      dateEnd: moment(dateEnd).format("YYYY-MM-DDT23:59:59Z"),
    };

    Fetch.post("/consumption/range", filter, false)
      .then((response) => {
        if (response.data?.totalConsumption)
          setFuelConsumption(response.data?.totalConsumption)
        if (response.data?.measureUnit)
          setMeasureUnit(response.data?.measureUnit)
        setDateFiltered(filter)
        setIsLoading(false);
      })
      .catch((error) => {
        toast(intl.formatMessage({ id: 'error.get' }))
        setIsLoading(false);
      });
  }

  const getStatusErro = () => {
    if (props.statusResponse === 400) {
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
    if (props.statusResponse >= 500) {
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
    <Card
      status={statusShow?.status}
      style={{ height: "100%", width: "100%" }}
      key={props.id}
    >

      {isLoading ? (<Spinner />) : (
        <>
          {statusShow?.header}
          <props.component
            title={data?.title}
            dataConfig={data}
            id={props.id}
            activeEdit={props.activeEdit}
            isMobile={props.isMobile}
            fuelConsumption={fuelConsumption || 0}
            measureUnit={measureUnit || ''}
            dateFiltered={dateFiltered}
          />

          {!props.activeEdit && (
            <Popover
              trigger="click"
              placement="top"
              visible={popoverVisible}
              onVisibleChange={(visible) => setPopoverVisible(visible)}
              overlay={
                <ContainerRow
                  style={{ minWidth: 150, maxWidth: 380 }}
                >
                  <Col breakPoint={{ md: 12 }} className="ml-2 mb-3">
                    <LabelIcon
                      iconName="funnel-outline"
                      title={data.title}
                    />
                  </Col>
                  <Divide style={{ width: "100%" }} />
                  <Row className="m-2" style={{ width: "100%" }}>
                    <Col breakPoint={{ md: 12 }} className="mb-4">
                      <Row>
                        <Col breakPoint={{ md: 6 }}>
                          <TextSpan apparence="s2">
                            <FormattedMessage id="date.start" />
                          </TextSpan>
                        </Col>
                      </Row>
                      <div className="mt-1" />
                      <DateTime onlyDate
                        onChangeDate={setDateInit}
                        date={dateInit}
                        max={dateEnd}
                      />
                    </Col>
                    <Col breakPoint={{ md: 12 }} className="mb-4">
                      <Row>
                        <Col breakPoint={{ md: 6 }}>
                          <TextSpan apparence="s2">
                            <FormattedMessage id="date.end" />
                          </TextSpan>
                        </Col>
                      </Row>
                      <div className="mt-1" />
                      <DateTime onlyDate
                        onChangeDate={setDateEnd}
                        date={dateEnd}
                        max={new Date()}
                        min={moment(dateInit).add(1, 'days').toDate()}
                      />
                    </Col>

                  </Row>
                  <Divide style={{ width: "100%" }} />
                  <Row end="xs" style={{ width: "100%" }} className="pb-3 pt-3 pr-3">
                    <Button
                      size="Tiny"
                      status="Primary"
                      disabled={!dateEnd || !dateInit}
                      onClick={() => fetchData(props.data.machine.value, dateInit, dateEnd)}
                    >
                      <EvaIcon name="search-outline" />
                    </Button>
                  </Row>

                </ContainerRow>
              }
            >
              <Button
                size="Tiny"
                style={{
                  padding: 3,
                  zIndex: 999,
                  position: "absolute",
                  right: 8,
                  top: 8,
                }}
                status="Basic"
                onClick={() => setPopoverVisible(!popoverVisible)}
              >
                <EvaIcon name="funnel-outline" />
              </Button>
            </Popover>

          )}
        </>
      )}



    </Card>
  );
};

const mapStateToProps = (state) => ({
  optionsData: state.dashboard.data,
});

export default connect(mapStateToProps)(FuelConsumptionWrapper);
