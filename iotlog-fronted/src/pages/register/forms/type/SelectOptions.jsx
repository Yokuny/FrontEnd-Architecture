import { Button, Col, EvaIcon, InputGroup, Row } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { LabelIcon } from "../../../../components";

export default function SelectOptions({ onChange, data }) {
  const intl = useIntl();

  const onChangePropOptions = (index, value) => {
    const properties = {
      ...(data?.properties || {}),
      options: [
        ...data?.properties?.options?.slice(0, index),
        value,
        ...data?.properties?.options?.slice(index + 1),
      ],
    };
    onChange("properties", properties);
  };

  const onAddProp = () => {
    const properties = {
      ...(data?.properties || {}),
      options: [...(data?.properties?.options || []), ""],
    };
    onChange("properties", properties);
  };

  const onRemoveProp = (index) => {
    const properties = {
      ...(data?.properties || {}),
      options: [
        ...data?.properties?.options?.slice(0, index),
        ...data?.properties?.options?.slice(index + 1),
      ],
    };
    onChange("properties", properties);
  };

  return (
    <>
      <Col breakPoint={{ md: 12 }} className="mb-2">
        <LabelIcon
          iconName="list-outline"
          title={<FormattedMessage id="options" />}
        />
        {data?.properties?.options?.map((x, i) => (
          <Col breakPoint={{ md: 5 }} className="mb-1" key={i}>
            <Row style={{ margin: 0, flexWrap: 'nowrap' }}>
              <InputGroup key={i} fullWidth className="mt-1">
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "option",
                  })}
                  value={x}
                  onChange={(e) => onChangePropOptions(i, e.target.value)}
                />
              </InputGroup>
              <Button
                size="Tiny"
                className="ml-1 mt-1"
                status="Danger"
                appearance="ghost"
                onClick={() => onRemoveProp(i)}
              >
                <EvaIcon name="minus-circle-outline" />
              </Button>
            </Row>
          </Col>
        ))}

        <Button size="Tiny" className="mt-2 ml-3" onClick={onAddProp}>
          <FormattedMessage id="add.option" />
        </Button>
      </Col>
    </>
  );
}
