import { Checkbox as CheckboxUi, Col, InputGroup, Row } from "@paljs/ui";
import React from 'react';
import { FormattedMessage, useIntl } from "react-intl";
import styled from 'styled-components';
import { TextSpan, Toggle } from "../../../components";

const uuid = require("uuid").v4;

const Checkbox = styled(CheckboxUi)`
  cursor: pointer;
`;

export default function HeatmapAlertForm(props) {

  const intl = useIntl()
  const { sensorIndex, updateHeatmapAlerts, heatmapAlerts } = props;

  const [sensor, setSensor] = React.useState(null)
  const [alert, setAlert] = React.useState(undefined)
  const [onOffValue, setOnOffValue] = React.useState('off')   // Determines which value is selected: 'on' | 'off'
  const [alertOnOff, setAlertOnOff] = React.useState(false)   // Determines if the onOff Alert is enabled/disabled
  const [alertMax, setAlertMax] = React.useState(false)
  const [alertMin, setAlertMin] = React.useState(false)
  const [danger, setDanger] = React.useState(false)


  function setInitialState() {

    const initialSensorData = {
      key: props.sensor?.key,
      id: props.sensorData.id || props.sensor?.key,
      name: props.sensorData.sensor,
      type: props.sensorData.type || 'default',
      onOff: props.sensor?.onOff,
    }

    const heatmapAlert = heatmapAlerts?.alerts?.find((_alert) => _alert.idSensor === initialSensorData.id)

    const initialAlertData = {
      idSensor: heatmapAlert?.idSensor || props.sensorData.id,
      idAlert: heatmapAlert?.idAlert || uuid(),
      minValue: heatmapAlert?.minValue || undefined,
      maxValue: heatmapAlert?.maxValue || undefined,
      onOffValue: heatmapAlert?.onOffValue || undefined,
      alertMin: heatmapAlert?.alertMin || false,
      alertMax: heatmapAlert?.alertMax || false,
      alertOnOff: heatmapAlert?.alertOnOff || false
    }

    setOnOffValue(heatmapAlert?.onOffValue || 'off')
    setAlertOnOff(heatmapAlert?.alertOnOff || false)
    setAlertMax(heatmapAlert?.alertMax || false)
    setAlertMin(heatmapAlert?.alertMin || false)

    setAlert(initialAlertData)
    setSensor(initialSensorData)
  }

  function handleValueInput(field, value) {

    let newAlert = { ...alert };
    let aux;
    let newDanger;

    switch (field) {
      case 'minValue':
        newAlert.minValue = value;
        newDanger = [false, danger[1]];
        setDanger(newDanger);
        break;

      case 'maxValue':
        newAlert.maxValue = value;
        newDanger = [danger[0], false];
        setDanger(newDanger);
        break;

      case 'alertMin':
        aux = !alertMin
        newAlert.alertMin = aux;
        setAlertMin(aux);
        break;

      case 'alertMax':
        aux = !alertMax
        newAlert.alertMax = aux;
        setAlertMax(aux);
        break;

      case 'alertOnOff':
        aux = !alertOnOff
        newAlert.alertOnOff = aux;
        setAlertOnOff(aux);
        break;

      case 'onOffValue':
        const newValue = value ? 'on' : 'off';
        newAlert.onOffValue = newValue;
        setOnOffValue(newValue)
        break;

      default: break;
    }

    setAlert(newAlert)
    updateHeatmapAlerts(newAlert)
  };

  function validateCheckbox(field, value) {

    let newDanger;

    switch (field) {
      case 'alertMin':

        if (!alert.minValue && value === true) {
          newDanger = [true, danger[1]]
          return setDanger(newDanger)
        };

        handleValueInput('alertMin', value);
        break;

      case 'alertMax':

        if (!alert.maxValue && value === true) {
          newDanger = [danger[0], true]
          return setDanger(newDanger)
        };

        handleValueInput('alertMax', value);
        break;

      default:
        break;
    }

  }

  function handleSwitchCheck() {
    switch (onOffValue) {
      case 'on': return true;
      case 'off': return false;
      default: return false;
    }
  }

  React.useEffect(() => {
    setInitialState()
  }, [])

  if (!sensor) return <></>;

  if (true) return (
    <Row key={`i-sensor-${sensorIndex}`} middle>

      <Col breakPoint={{ xs: 12, md: 3 }}>
        <TextSpan apparence="p2">{sensor.name}</TextSpan>
      </Col>


      {sensor.onOff && (
        <>
          <Col breakPoint={{ xs: 12, md: 2 }} className="mb-2">
            <Row middle>
              <Toggle
                checked={handleSwitchCheck()}
                onChange={(e) => handleValueInput('onOffValue', e.target.checked)}
              />
              <TextSpan apparence="p2" hint className="ml-1">Off/On</TextSpan>
            </Row>
          </Col>
          <Col breakPoint={{ xs: 12, md: 2 }} className="mb-2">
            <Checkbox
              checked={alertOnOff}
              onChange={() => handleValueInput('alertOnOff', !alertOnOff)}
            >
              <TextSpan apparence="s2" hint>
                <FormattedMessage id="enable" />
              </TextSpan>
            </Checkbox>
          </Col>
        </>
      )}

      {
        sensor.type === 'default' && !sensor.onOff && (
          <>
            <Col breakPoint={{ md: 3 }} className="mb-2">
              <InputGroup status={danger[0] ? "Danger" : "Basic"} fullWidth>
                <input
                  placeholder={intl.formatMessage({ id: "sensor.signal.value.min" })}
                  type="number"
                  value={alert.minValue}
                  onChange={(value) => handleValueInput('minValue', value.target.value)}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 2 }} className="mb-2">
              <Checkbox
                checked={alertMin}
                onChange={() => validateCheckbox('alertMin', !alertMin)}
              >
                <TextSpan apparence="s2" hint>
                  <FormattedMessage id="enable" />
                </TextSpan>
              </Checkbox>
            </Col>

            <Col breakPoint={{ md: 3 }} className="mb-2">
              <InputGroup status={danger[1] ? "Danger" : "Basic"} fullWidth>
                <input
                  placeholder={intl.formatMessage({ id: "sensor.signal.value.max" })}
                  type="number"
                  value={alert.maxValue}
                  onChange={(value) => handleValueInput('maxValue', value.target.value)}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 1 }} className="mb-2">
              <Checkbox
                checked={alertMax}
                onChange={() => validateCheckbox('alertMax', !alertMax)}
              >
                <TextSpan apparence="s2" hint>
                  <FormattedMessage id="enable" />
                </TextSpan>
              </Checkbox>
            </Col>
          </>
        )
      }
    </Row>
  )
}
