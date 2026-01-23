import { Button, Checkbox, Col, EvaIcon, Row, Select } from "@paljs/ui";
import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  SelectMaintenancePlan,
  SelectMaintenancePlanByMachine,
  SelectPartByMachine,
  SelectSensorByMachine,
  SelectSignalCreateable,
} from "../../../../../components/Select";
import TextSpan from "../../../../../components/Text/TextSpan";
import { TYPE_SENSOR_WEAR } from "../../../../../constants";

const ItemFieldWear = (props) => {
  const { item, listItems, idMachine, onChange, onRemove } = props;

  const typesWear = [
    {
      label: props.intl.formatMessage({ id: "horimeter" }),
      value: TYPE_SENSOR_WEAR.HORIMETER,
    },
    {
      label: props.intl.formatMessage({ id: "trigger" }),
      value: TYPE_SENSOR_WEAR.TRIGGER,
    },
    {
      label: props.intl.formatMessage({ id: "odometer" }),
      value: TYPE_SENSOR_WEAR.ODOMETER,
    },
  ];

  const filterParts = listItems
    ?.filter((x) => !!x?.parts?.length)
    ?.map((x) => x?.parts?.map((y) => y.value))
    ?.flat();

  const filterPlans = listItems
    ?.filter((x) => !!x?.maintenancePlans?.length)
    ?.map((x) => x?.maintenancePlans?.map((y) => y.value))
    ?.flat();

  return (
    <>
      <Row className="mb-4">
        <Col breakPoint={{ md: 11, xs: 11 }}>
          <Row>
            <Col breakPoint={{ md: 12 }} className="mb-4">
              <Select
                options={typesWear}
                value={typesWear.find((x) => x.value === item?.typeWearSensor)}
                onChange={(value) => onChange("typeWearSensor", value?.value)}
                menuPosition="fixed"
                noOptionsMessage={() =>
                  props.intl.formatMessage({
                    id: "nooptions.message",
                  })
                }
                placeholder={props.intl.formatMessage({
                  id: "type.wear.sensor",
                })}
                isClearable
              />
            </Col>
            <Col breakPoint={{ md: 5 }} className="mb-4 col-center">
              <SelectSensorByMachine
                idMachine={idMachine}
                value={item?.sensor}
                onChange={(valueSensor) => onChange("sensor", valueSensor)}
              />
            </Col>
            <Col breakPoint={{ md: 4 }} className="mb-4 col-center">
              <SelectSignalCreateable
                placeholder={props.intl.formatMessage({
                  id: "signal.placeholder",
                })}
                onChange={(valueSignal) => onChange("signal", valueSignal)}
                value={item?.signal}
                idMachine={idMachine}
                sensorId={item?.sensor?.value}
                noOptionsMessage={
                  !item?.sensor ? "select.first.sensor" : "nooptions.message"
                }
                sensorNew={!!item?.sensor?.__isNew__}
              />
            </Col>
            <Col breakPoint={{ md: 3 }} className="mb-4 col-center">
              <Checkbox
                checked={item?.accumulate}
                onChange={(e) => onChange("accumulate", !item?.accumulate)}
              >
                <TextSpan apparence="s2">
                  <FormattedMessage id="sum.old" />
                </TextSpan>
              </Checkbox>
            </Col>
            <Col breakPoint={{ md: 12 }} className="mb-4">
              <SelectPartByMachine
                onChange={(value) => onChange("parts", value)}
                value={item?.parts}
                placeholder="select.part"
                idMachine={idMachine}
                isClearable
                isMulti
                filtered={filterParts}
              />
            </Col>
            <Col breakPoint={{ md: 12 }} className="mb-4">
              <SelectMaintenancePlanByMachine
                onChange={(value) => onChange("maintenancePlans", value)}
                value={item?.maintenancePlans}
                idMachine={idMachine}
                filtered={filterPlans}
                isClearable={true}
                isMulti
              />
            </Col>
          </Row>
        </Col>
        <Col breakPoint={{ md: 1, xs: 1 }} className="col-flex-center mb-4">
          <Button status="Danger" size="Tiny" onClick={onRemove}>
            <EvaIcon name="trash-2-outline" />
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default injectIntl(ItemFieldWear);
