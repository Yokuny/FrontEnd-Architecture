import { Col, Row, Select } from "@paljs/ui";
import { LabelIcon, TextSpan, Toggle } from "../../../../components";
import { useIntl } from "react-intl";

export default function FileUploadField({ onChange, data }) {
  const intl = useIntl();

  const onChangeProp = (prop, value) => {
    const properties = {
      ...(data?.properties || {}),
      [prop]: value,
    };
    onChange("properties", properties);
  };

  const options = [
    {
      value: "image/*",
      label: intl.formatMessage({ id: "image" }),
    },
    {
      value: "application/pdf",
      label: "PDF",
    },
  ]
  
  return (
    <>
      <Col breakPoint={{ md: 4 }}>
        <LabelIcon
          iconName="keypad-outline"
          title={intl.formatMessage({ id: "several" })}
        />
        <Row style={{ margin: 0 }} className="mt-1 ml-1" between="xs">
          <TextSpan apparence="s2" hint>
            {intl.formatMessage({ id: "select.several" })}
          </TextSpan>
          <Toggle
            checked={!!data?.properties?.isMulti}
            onChange={(choose) =>
              onChangeProp("isMulti", !data?.properties?.isMulti)
            }
          />
        </Row>
      </Col>
      <Col breakPoint={{ md: 4 }}>
        <LabelIcon
          iconName="archive-outline"
          title={intl.formatMessage({ id: "accept" })}
        />
          <Select
            options={options}
            placeholder={intl.formatMessage({ id: "accept" })}
            value={options.filter((x) => data?.properties?.accept?.includes(x.value)) || ''}
            onChange={(e) => onChangeProp("accept", e.map((x) => x.value))}
            isMulti
          />
      </Col>
    </>
  );
}
