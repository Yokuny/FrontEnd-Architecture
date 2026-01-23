import { CardBody, CardHeader, Col, EvaIcon, InputGroup, Row } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { CardNoShadow, LabelIcon, SelectMachineEnterprise, TextSpan, Toggle } from "../../../../components";
import { SelectSensorByMachine } from "../../../../components/Select";

const LostConnectionSensor = (props) => {
  const { idEnterprise, onChange, onActiveEvent, event } = props;

  const intl = useIntl();

  return (
    <>
      <CardNoShadow>
        <CardHeader>
          <Row between="xs" middle="xs" style={{ margin: 0 }}>
            <Row middle="xs"style={{ margin: 0 }}>
              <EvaIcon status="Danger" name="wifi-off-outline" />

              <TextSpan apparence="s1" className="ml-2">
                <FormattedMessage id="lostconnection" />
              </TextSpan>
            </Row>
            <Toggle
              checked={!!event?.lostConnectionSensor}
              onChange={() => onActiveEvent("lostConnectionSensor")}
              status="Success"
            />
          </Row>
        </CardHeader>
        {!!event?.lostConnectionSensor && (
          <CardBody>
            <Row>
              <Col breakPoint={{ md: 6 }} className="mb-4">
                <LabelIcon
                  title={<FormattedMessage id="machine" />}
                  iconName="wifi-outline"
                />
                <div className="mt-1"></div>
                <SelectMachineEnterprise
                  isMulti={false}
                  idEnterprise={idEnterprise}
                  onChange={(value) =>
                    onChange("lostConnectionSensor", "machine", value)
                  }
                  placeholder="machine"
                  value={event?.lostConnectionSensor?.machine}
                />
              </Col>
              <Col breakPoint={{ md: 6 }} className="mb-4">
                <LabelIcon
                  title={<FormattedMessage id="sensors" />}
                  iconName="flash-outline"
                />
                <div className="mt-1"></div>
                <SelectSensorByMachine
                  placeholder={"sensors"}
                  idMachine={event?.lostConnectionSensor?.machine?.value}
                  value={event?.lostConnectionSensor?.sensors}
                  onChange={(value) => onChange("lostConnectionSensor", "sensors", value)}
                  isMulti
                />
              </Col>
              <Col breakPoint={{ md: 6 }}>
                <LabelIcon
                  title={<FormattedMessage id="time.min.lost.connection" />}
                  iconName="clock-outline"
                />
                <InputGroup fullWidth className="mt-1">
                  <input
                    value={event?.lostConnectionSensor?.timeMinutes}
                    onChange={(e) =>
                      onChange(
                        "lostConnectionSensor",
                        "timeMinutes",
                        e.target.value ? parseInt(e.target.value) : ""
                      )
                    }
                    type="number"
                    placeholder={intl.formatMessage({
                      id: "time.min",
                    })}
                  />
                </InputGroup>
              </Col>
            </Row>
          </CardBody>
        )}
      </CardNoShadow>
    </>
  )
}

export default LostConnectionSensor;
