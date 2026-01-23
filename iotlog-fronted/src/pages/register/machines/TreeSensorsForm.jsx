import { Col, InputGroup, Row } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";
import { LabelIcon, Toggle } from "../../../components";
import { SelectSensorByMachine } from "../../../components/Select";
import React, { useState } from "react";

export function TreeSensorsForm({
  item,
  onChangeItem
}) {
  const intl = useIntl();

  React.useEffect(() => {
    if (!item.sensors?.length) {
      setIsPutSensors(false);
    }
    else {
      setIsPutSensors(true);
    }
  }, []);

  const [isPutSensors, setIsPutSensors] = useState(false);

  const [searchParams] = useSearchParams();

  const idMachine = searchParams.get("idMachine");

  const onChangeIsPutSensors = (value) => {
    if (value) {
      onChangeItem({
        ...item,
        sensors: []
      })

      setIsPutSensors(false);
      return;
    }
    setIsPutSensors(true);
  }

  return (
    <Row className="m-0" between="xs" style={{ width: "100%" }}>
      <Col breakPoint={{ md: 12 }}>
        <LabelIcon
          iconName={"text-outline"}
          title={<FormattedMessage id="title" />}
        />
        <InputGroup fullWidth>
          <input
            type="text"
            name="title"
            id="title"
            placeholder={intl.formatMessage({ id: "add.title" })}
            value={item.title}
            onChange={(e) => {
              onChangeItem({
                ...item,
                title: e.target.value
              })
            }}
          />
        </InputGroup>
      </Col>
      <Col breakPoint={{ md: 12 }} className="mt-4">
        <LabelIcon
          iconName={"flash-outline"}
          title={intl.formatMessage({ id: "select.sensors" })}
        />
        <Toggle
          checked={isPutSensors}
          onChange={() => onChangeIsPutSensors(isPutSensors)}
        />
      </Col>
      {isPutSensors && <Col breakPoint={{ md: 12 }} className="mt-4">
        <LabelIcon
          iconName={"hash-outline"}
          title={intl.formatMessage({ id: "sensors" })}
        />
        <SelectSensorByMachine
          idMachine={idMachine}
          value={item.sensors}
          onChange={(e) => {
            onChangeItem({
              ...item,
              sensors: e
            })
          }}
          isMulti
        />
      </Col>}
    </Row>
  );
}
