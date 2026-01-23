import { Checkbox, Col, Row } from "@paljs/ui";
import { useIntl } from "react-intl";
import { LabelIcon, TextSpan } from "../../../../components";

export default function DateTimeField({ onChange, data }) {
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
      <Col breakPoint={{ md: 4 }} className="mt-2">
        <LabelIcon iconName="clock-outline" title={intl.formatMessage({ id: "datetime" })} />
        <Row style={{ margin: 0 }} className="mt-1 ml-1" start="xs">
          <Checkbox
            className="mr-1"
            checked={!!data?.properties?.useDateNowDefault}
            onChange={(choose) => onChangeProp("useDateNowDefault", !data?.properties?.useDateNowDefault)}
          />
          <TextSpan apparence="s2" hint>
            {intl.formatMessage({ id: "datetime.now" })}
          </TextSpan>
        </Row>
      </Col>
    </>
  );
}
