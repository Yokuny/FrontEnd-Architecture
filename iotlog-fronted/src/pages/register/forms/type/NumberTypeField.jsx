import { Col, InputGroup, Row } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { LabelIcon, TextSpan, Toggle } from "../../../../components";

export default function NumberTypeField({ onChange, data }) {
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
      <Col breakPoint={{ md: 3 }} className="mb-2">
        <LabelIcon
          iconName="arrow-forward-outline"
          title={<FormattedMessage id="decimals.acron" />}
        />
        <InputGroup fullWidth className="mt-1">
          <input
            type="number"
            min={0}
            placeholder={intl.formatMessage({
              id: "decimals.acron",
            })}
            value={data?.properties?.sizeDecimals}
            onChange={(e) =>
              onChangeProp(
                "sizeDecimals",
                e.target.value ? parseInt(e.target.value) : ""
              )
            }
          />
        </InputGroup>
      </Col>
      <Col breakPoint={{ md: 3 }} className="mb-2">
        <LabelIcon
          iconName="arrow-up-outline"
          title={<FormattedMessage id="sensor.signal.value.min" />}
        />
        <InputGroup fullWidth className="mt-1">
          <input
            type="number"
            placeholder={intl.formatMessage({
              id: "sensor.signal.value.min",
            })}
            value={data?.properties?.min}
            onChange={(e) =>
              onChangeProp(
                "min",
                e.target.value ? parseInt(e.target.value) : ""
              )
            }
          />
        </InputGroup>
      </Col>
      <Col breakPoint={{ md: 3 }} className="mb-2">
        <LabelIcon
          iconName="arrow-down-outline"
          title={<FormattedMessage id="sensor.signal.value.max" />}
        />
        <InputGroup fullWidth className="mt-1">
          <input
            type="number"
            placeholder={intl.formatMessage({
              id: "sensor.signal.value.max",
            })}
            value={data?.properties?.max}
            onChange={(e) =>
              onChangeProp(
                "max",
                e.target.value ? parseInt(e.target.value) : ""
              )
            }
          />
        </InputGroup>
      </Col>
      <Col breakPoint={{ md: 4 }}>
        <LabelIcon iconName="pantone-outline" title={`Heatmap`} />
        <Row style={{ margin: 0 }} className="mt-2" between="xs">
          <TextSpan apparence="s2">
            {intl.formatMessage({ id: "heatmap.color" })}
          </TextSpan>
          <Toggle
            checked={!!data?.properties?.isHeatmap}
            onChange={(choose) =>
              onChangeProp("isHeatmap", !data?.properties?.isHeatmap)
            }
          />
        </Row>
      </Col>
    </>
  );
}
