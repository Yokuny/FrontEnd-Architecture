import React from "react";

import { Button, Col, EvaIcon, InputGroup, Row, Select } from "@paljs/ui";
import { injectIntl } from "react-intl";

const ColEditor = ({
  data,
  onChange,
  rowData,
  columnCross,
  intl,
  onRemove = undefined,
}) => {
  let hasRemove = !!onRemove;

  const types_cell = [
    {
      value: "idMachine",
      label: intl.formatMessage({ id: "id.machine" }),
    },
    {
      value: "machine.name",
      label: intl.formatMessage({ id: "description.machine" }),
    },
    {
      value: "sensorId",
      label: intl.formatMessage({ id: "id.sensor" }),
    },
    {
      value: "sensor",
      label: intl.formatMessage({ id: "description.sensor" }),
    },
    {
      value: "value.signal",
      label: intl.formatMessage({ id: "value.signal" }),
    },
    {
      value: "dateServer",
      label: intl.formatMessage({ id: "date.server" }),
    },
    {
      value: "dateSensor",
      label: intl.formatMessage({ id: "date.sensor" }),
    },
  ];

  let items = [...rowData, ...columnCross].map((x) => ({
    value: `${x?.machine?.value}_${x?.sensor?.value}_${x?.signal?.value}`,
    label: `${x?.machine?.label}, ${x?.sensor?.label}, ${x?.signal?.label}`,
    idMachine: x?.machine?.value,
    sensorId: x?.sensor?.value,
    signalId: x?.signal?.value,
  }));

  return (
    <>
      <Row middle>
        <Col breakPoint={{ md: 1 }} className="mb-4" style={{ cursor: 'pointer' }}>
          <Row center>
          <EvaIcon
            options={{ height: 20, width: 20, fill: "#cdcdcd" }}
            name="flip-outline"
            status="Control"
          />
          </Row>
        </Col>
        <Col breakPoint={{ md: hasRemove ? 9 : 11 }}>
          <Row>
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <InputGroup fullWidth>
                <input
                  value={data?.header}
                  onChange={(e) => onChange("header", e.target.value)}
                  type="text"
                  placeholder={intl.formatMessage({ id: "description" })}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <Select
                options={types_cell}
                placeholder={intl.formatMessage({
                  id: "type.info.placelholder",
                })}
                value={data?.typeCell}
                onChange={(value) => onChange("typeCell", value)}
                menuPosition="fixed"
              />
            </Col>
            {data?.typeCell?.value == "value.signal" && [
              <Col breakPoint={{ md: 12 }} className="mb-4">
                <Select
                  options={items}
                  placeholder={intl.formatMessage({
                    id: "signal.placeholder",
                  })}
                  value={data?.signal}
                  onChange={(value) => onChange("signal", value)}
                  menuPosition="fixed"
                />
              </Col>,
              <Col breakPoint={{ md: 12 }} className="mb-4">
                <InputGroup fullWidth>
                  <textarea
                    value={data?.formula}
                    onChange={(e) => onChange("formula", e.target.value)}
                    rows={2}
                    placeholder={intl.formatMessage({ id: "formula.optional" })}
                  />
                </InputGroup>
              </Col>,
            ]}
          </Row>
        </Col>
        {hasRemove && (
          <Col
            breakPoint={{ md: 2 }}
            style={{ justifyContent: "center", alignItems: "center" }}
            className="mb-4"
          >
            <Button status="Danger" size="Tiny" onClick={onRemove}>
              <EvaIcon name="trash-2-outline" />
            </Button>
          </Col>
        )}
      </Row>
    </>
  );
};

export default injectIntl(ColEditor);
