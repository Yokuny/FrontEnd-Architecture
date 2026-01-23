import { Col, Row, InputGroup } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { TextSpan, Toggle } from "../../../components";
import { SelectSensorByMachine } from "../../../components/Select";

const FleetConfig = (props) => {
  const intl = useIntl();
  const { idMachine, onChangeFleet, fleet } = props;

  return (
    <>
      <Row>
        <Col breakPoint={{ md: 6 }} className="mb-4">
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
        </Col>

        <Col breakPoint={{ md: 6 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="setup.sensor.course" />
          </TextSpan>
          <div className="mt-1"></div>
          <SelectSensorByMachine
            idMachine={idMachine}
            value={fleet?.sensorCourse}
            onChange={(valueSensor) =>
              onChangeFleet("sensorCourse", valueSensor)
            }
          />
        </Col>

        <Col breakPoint={{ md: 6 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="sensor" /> ETA
          </TextSpan>
          <div className="mt-1"></div>
          <SelectSensorByMachine
            idMachine={idMachine}
            value={fleet?.sensorETA}
            onChange={(valueSensor) => onChangeFleet("sensorETA", valueSensor)}
          />
        </Col>

        <Col breakPoint={{ md: 4 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="sensor.speed" />
          </TextSpan>
          <div className="mt-1"></div>
          <SelectSensorByMachine
            idMachine={idMachine}
            value={fleet?.sensorSpeed}
            onChange={(valueSensor) =>
              onChangeFleet("sensorSpeed", valueSensor)
            }
          />
        </Col>
        <Col breakPoint={{ md: 2 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="unity.speed" />
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <input
              idMachine={idMachine}
              value={fleet?.unitySpeed}
              onChange={(e) => onChangeFleet("unitySpeed", e.target.value)}
              type="text"
              placeholder={intl.formatMessage({
                id: "unity.speed",
              })}
            />
          </InputGroup>
        </Col>

        <Col breakPoint={{ md: 6 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="sensor.destiny" />
          </TextSpan>
          <div className="mt-1"></div>
          <SelectSensorByMachine
            idMachine={idMachine}
            value={fleet?.sensorDestiny}
            onChange={(valueSensor) =>
              onChangeFleet("sensorDestiny", valueSensor)
            }
          />
        </Col>

        <Col breakPoint={{ md: 6 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="sensor.draught" />
          </TextSpan>
          <div className="mt-1"></div>
          <SelectSensorByMachine
            idMachine={idMachine}
            value={fleet?.sensorDraught}
            onChange={(valueSensor) =>
              onChangeFleet("sensorDraught", valueSensor)
            }
          />
        </Col>

        <Col breakPoint={{ md: 6 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="sensor.status.navigation" />
          </TextSpan>
          <div className="mt-1"></div>
          <SelectSensorByMachine
            idMachine={idMachine}
            value={fleet?.sensorStatusNavigation}
            onChange={(valueSensor) =>
              onChangeFleet("sensorStatusNavigation", valueSensor)
            }
          />
        </Col>

        <Col breakPoint={{ md: 6 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="sensor" /> DP
          </TextSpan>
          <div className="mt-1"></div>
          <SelectSensorByMachine
            idMachine={idMachine}
            value={fleet?.sensorDP}
            onChange={(valueSensor) =>
              onChangeFleet("sensorDP", valueSensor)
            }
          />
        </Col>

        {/* <Col breakPoint={{ md: 6 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="sensor.consume" />
          </TextSpan>
          <div className="mt-1"></div>
          <SelectSensorByMachine
            idMachine={idMachine}
            value={fleet?.sensorConsume}
            onChange={(valueSensor) =>
              onChangeFleet("sensorConsume", valueSensor)
            }
          />
        </Col> */}

        <Col breakPoint={{ md: 6 }} className="mb-4">
          <Row between="xs" middle="xs" style={{ margin: 0 }}>
            <TextSpan apparence="s2">
              <FormattedMessage id="show.in.fleet" />
            </TextSpan>
            <Toggle
              checked={!!fleet?.isShow}
              onChange={() => onChangeFleet("isShow", !fleet?.isShow)}
            />
          </Row>
        </Col>

        <Col breakPoint={{ md: 6 }} className="mb-4">
          <Row between="xs" middle="xs" style={{ margin: 0 }}>
            <TextSpan apparence="s2">
              <FormattedMessage id="process.status" />
            </TextSpan>
            <Toggle
              checked={!!fleet?.isProcessStatus}
              onChange={() => onChangeFleet("isProcessStatus", !fleet?.isProcessStatus)}
            />
          </Row>
        </Col>

        <Col breakPoint={{ md: 6 }} className="mb-4">
          <Row between="xs" middle="xs" style={{ margin: 0 }}>
            <TextSpan apparence="s2">
              <FormattedMessage id="not.show.public.fleet" />
            </TextSpan>
            <Toggle
              checked={!!fleet?.notShowPublicFleet}
              onChange={() => onChangeFleet("notShowPublicFleet", !fleet?.notShowPublicFleet)}
            />
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default FleetConfig;
