import { Col, InputGroup, Row } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { LabelIcon, TextSpan, Toggle } from "../../../../components";

export default function FunctionTypeField({ onChange, data }) {
  const intl = useIntl();

  const onChangeProp = (prop, value) => {
    const properties = {
      ...(data?.properties || {}),
      [prop]: value,
    };
    onChange("properties", properties);
  };

  return (
    <>
      <Col breakPoint={{ md: 3 }} className="mb-2">
        <LabelIcon
          iconName="cube-outline"
          title={<FormattedMessage id="unit" />}
        />
        <InputGroup fullWidth className="mt-1">
          <input
            type="text"
            placeholder={intl.formatMessage({
              id: "unit",
            })}
            value={data?.properties?.unit}
            onChange={(e) => onChangeProp("unit", e.target.value)}
          />
        </InputGroup>
      </Col>
      <Col breakPoint={{ md: 12 }} className="mb-2 mt-2">
        <LabelIcon
          iconName="code-outline"
          title={`${intl.formatMessage({
            id: "function",
          })} KonzScript`}
        />
        <InputGroup fullWidth className="mt-1">
          <textarea
            type="text"
            rows={5}
            placeholder={`${intl.formatMessage({
            id: "function",
          })} KonzScript`}
            value={data?.properties?.functionString}
            onChange={(e) => onChangeProp("functionString", e.target.value)}
          />
        </InputGroup>
      </Col>
    </>
  );
}
