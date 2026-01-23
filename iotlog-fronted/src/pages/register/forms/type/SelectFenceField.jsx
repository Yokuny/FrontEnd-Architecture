import { Col, Row } from "@paljs/ui";
import { LabelIcon, TextSpan, Toggle } from "../../../../components";
import { useIntl } from "react-intl";

export default function SelectFenceField({ onChange, data }) {
  const intl = useIntl()
  
  const onChangeProp = (prop, value) => {
    const properties = {
      ...(data?.properties || {}),
      [prop]: value,
    };
    onChange("properties", properties);
  };

  
  return (
    <>
      <Col breakPoint={{ md: 4 }}>
        <LabelIcon iconName="keypad-outline" title={intl.formatMessage({ id: "several" })} />
        <Row style={{ margin: 0 }} className="mt-1 ml-1" between="xs">
          <TextSpan apparence="s2" hint>
            {intl.formatMessage({ id: "select.several" })}
          </TextSpan>
          <Toggle
            checked={!!data?.properties?.isMulti}
            onChange={(choose) => onChangeProp("isMulti", !data?.properties?.isMulti)}
          />
        </Row>
      </Col>
    </>
  )
}