import React from "react";

import { Button, Col, EvaIcon, Row } from "@paljs/ui";
import {
  SelectMachine,
  SelectSensorByMachine,
  SelectSignalCreateable,
} from "../../Select";

export const RowMachineSensorEditor = ({ data, onChange, onRemove = undefined }) => {
  let hasRemove = !!onRemove;
  return (
    <>
      <Row>
        <Col breakPoint={{ md: hasRemove ? 10 : 12 }}>
          <Row>
            <Col breakPoint={{ md: 4 }} className="mb-4">
              <SelectMachine
                value={data?.machine}
                onChange={(value) => onChange("machine", value)}
                placeholder={"machine"}
              />
            </Col>
            <Col breakPoint={{ md: 4 }} className="mb-4">
              <SelectSensorByMachine
                placeholder={"sensor"}
                idMachine={data?.machine?.value}
                value={data?.sensor}
                onChange={(value) => onChange("sensor", value)}
              />
            </Col>
            <Col breakPoint={{ md: 4 }} className="mb-4">
              <SelectSignalCreateable
                placeholder={"signal"}
                onChange={(value) => onChange("signal", value)}
                value={data?.signal}
                idMachine={data?.machine?.value}
                sensorId={data?.sensor?.value}
                noOptionsMessage={
                  !data?.sensor ? "select.first.sensor" : "nooptions.message"
                }
                sensorNew={!!data?.sensor?.__isNew__}
              />
            </Col>
          </Row>
        </Col>
        {hasRemove && (
          <Col breakPoint={{ md: 2 }} style={{ justifyContent: "center" }}>
            <Button status="Danger" size="Tiny" onClick={onRemove}>
              <EvaIcon name="trash-2-outline" />
            </Button>
          </Col>
        )}
      </Row>
    </>
  );
};
