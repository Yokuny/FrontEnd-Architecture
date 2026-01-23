import { Col, Row, Select } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";

import { LabelIcon } from "../../../components";

export default function ConfigSensors(props) {

  const {
    data,
    sensors,
    onChangeSensorOnOff,
    onChangeSensors
  } = props;

  const intl = useIntl();

  const options = sensors?.filter(x => x)?.map((x) => ({
    value: x.sensorId,
    sensorKey: x.sensorId,
    label: `${x.sensor} (${x.sensorId})`,
    title: x.sensor,
    id: x.id,
    type: x.type
  }))?.sort((a, b) => a?.label?.localeCompare(b?.label));

  const sensorOnOff = options?.find((x) => x.value === data?.idSensorOnOff);
  const sensorsKeys = data?.sensors?.map((x) => x.sensorKey) || [];

  const sensorsFiltered = options?.filter((x) => sensorsKeys?.includes(x.value));

  return (<>
    <Row>
      <Col breakPoint={{ md: 12 }} className="mb-4 mt-4">
        <LabelIcon
          iconName="power-outline"
          title={<><FormattedMessage id="machine.equipment.subgroup.onoff" /> *</>}
        />

        <Select
          options={options}
          placeholder={intl.formatMessage({
            id:  "sensor.placeholder",
          })}
          onChange={(value) => onChangeSensorOnOff(value)}
          value={sensorOnOff}
          isClearable
          menuPosition="fixed"
          noOptionsMessage={() =>
            intl.formatMessage({
              id: "nooptions.message",
            })
          }
        />
      </Col>


      <Col breakPoint={{ md: 12 }} className="mb-4">
        <LabelIcon
          iconName="bell-outline"
          title={<FormattedMessage id="sensors" />}
        />
        <Select
          options={options}
          placeholder={intl.formatMessage({
            id:  "sensor.placeholder",
          })}
          onChange={(value) => onChangeSensors(value)}
          value={sensorsFiltered}
          isClearable
          isMulti
          menuPosition="fixed"
          noOptionsMessage={() =>
            intl.formatMessage({
              id: "nooptions.message",
            })
          }
        />
      </Col>
    </Row>

  </>
  )
}
