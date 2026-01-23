import React from "react";
import { Col, Row, InputGroup, Button, EvaIcon } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { LabelIcon } from "../../../components";
import { SelectSensorByMachine } from "../../../components/Select";
import styled from "styled-components";

const RowContent = styled(Row)`
   input {
    line-height: 0.5rem;
  }
`

const FleetDetailsConsumeConfig = (props) => {
  const intl = useIntl();
  const { idMachine, onChangeFleet, fleet } = props;

  const [data, setData] = React.useState([])

  const onAddEngines = () => {
    setData(prevState => prevState?.length
      ? [
        ...prevState,
        {}]
      : [{}]);
  }


  const onChange = (i, prop, value) => {
    setData(prevState => ([
      ...prevState.slice(0, i),
      {
        ...prevState[i],
        [prop]: value
      },
      ...prevState.slice(i + 1),
    ]))
  }

  return (
    <>
      <RowContent>
        <Col breakPoint={{ md: 6 }}>
          <LabelIcon
            iconName="settings-2-outline"
            title={<FormattedMessage id="engines.on" />}
          />

          {data?.map((x, i) => (
            <Row key={i} className="mb-2 ml-2 mr-2">
              <Col breakPoint={{ md: 5 }}>
                <LabelIcon
                  iconName="text-outline"
                  title={<FormattedMessage id="description" />}
                />
                <InputGroup fullWidth className="mt-1">
                  <input
                    value={x?.description}
                    onChange={(e) => onChange(i, "description", e.target.value)}
                    type="text"
                    placeholder={intl.formatMessage({ id: "description" })}
                  />
                </InputGroup>
              </Col>
              <Col breakPoint={{ md: 4 }}>
                <LabelIcon
                  iconName="flash-outline"
                  title={<FormattedMessage id="sensor" />}
                />
                <div className="mt-1"></div>
                <SelectSensorByMachine
                  idMachine={idMachine}
                  placeholder="sensor"
                  value={x?.sensor}
                  onChange={(valueSensor) =>
                    onChange(i, "sensor", valueSensor)
                  }
                />
              </Col>
              <Col breakPoint={{ md: 2 }}>
                <LabelIcon
                  iconName="cube-outline"
                  title={<FormattedMessage id="unit" />}
                />
                <InputGroup fullWidth className="mt-1">
                  <input
                    value={x?.unit}
                    onChange={(e) => onChange(i, "unit", e.target.value)}
                    type="text"
                    placeholder={intl.formatMessage({ id: "unit" })}
                  />
                </InputGroup>
              </Col>
              <Col breakPoint={{ md: 1 }}>
                <Button className="mt-4" status="Danger" appearance="ghost">
                  <EvaIcon name="trash-2-outline" />
                </Button>
              </Col>
            </Row>
          ))}

          <Button
            size="Tiny"
            status="Success"
            className="mb-4"
            onClick={onAddEngines}
          >
            <FormattedMessage id="add.sensor" />
          </Button>
        </Col>

        {/* <Col breakPoint={{ md: 6 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="setup.sensor.geolocation" />
          </TextSpan>
          <div className="mt-1"></div>
          <SelectSensorByMachine
            idMachine={idMachine}
            value={fleet?.sensorCoordinate}
            onChange={(valueSensor) =>
              onChangeFleet("sensorCoordinate", valueSensor)
            }
          />
        </Col> */}


      </RowContent>
    </>
  );
};

export default FleetDetailsConsumeConfig;
