import React from "react";

import { Col, InputGroup, Row, Select } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import TextSpan from "../../../../Text/TextSpan";

const ItemType = ({
  item,
  onChange
}) => {

  const intl = useIntl();

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
      value: "value.signal",
      label: intl.formatMessage({ id: "value.signal" }),
    },
    {
      value: "dateServer",
      label: intl.formatMessage({ id: "date.server" }),
    },
    {
      value: "date",
      label: intl.formatMessage({ id: "date.sensor" }),
    },
    {
      value: "proximity",
      label: intl.formatMessage({ id: "proximity" }),
    },
  ];

  return (
    <>
      <Row>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <Select
            options={types_cell}
            placeholder={intl.formatMessage({
              id: "type.info.placelholder",
            })}
            value={item?.typeCell}
            onChange={(value) => onChange("typeCell", value)}
            menuPosition="fixed"
          />
        </Col>
        {item?.typeCell?.value == "value.signal" &&
          <Col breakPoint={{ md: 12 }} className="mb-4">
            <TextSpan apparence="s2">
              <FormattedMessage id="formula.optional"/>
            </TextSpan>
            <InputGroup fullWidth className="mt-1">
              <textarea
                value={item?.formula}
                onChange={(e) => onChange("formula", e.target.value)}
                rows={2}
                placeholder={intl.formatMessage({ id: "formula.optional" })}
              />
            </InputGroup>
          </Col>
        }
      </Row>
    </>
  );
};

export default ItemType;
