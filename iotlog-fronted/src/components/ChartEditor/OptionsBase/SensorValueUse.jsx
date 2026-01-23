import { Col, InputGroup, Row, Select } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { LabelIcon } from "../../Label";

export const TYPE_CONVERT_VALUE = {
  VALUE: "value",
  BOOLEAN: "boolean",
  FUNCTION: "function",
};

export const convertValue = (value, machineProps) => {
  if (machineProps.typeVisualization?.value === TYPE_CONVERT_VALUE.BOOLEAN) {
    return value === true ? machineProps.trueValue : machineProps.falseValue;
  }

  if (machineProps.typeVisualization?.value === TYPE_CONVERT_VALUE.FUNCTION) {
    return eval(machineProps.function?.replaceAll("value", value));
  }

  if (typeof value === "boolean") {
    return value === true || value === "true" ? 10000 : 0;
  }
  return isNaN(value) ? undefined : value % 1 === 0 ? value : value?.toFixed(1);
};

export const normalizeSizeDecimals = (floatValue, sizeDecimals = 0) => {
  if (!floatValue) return 0;

  return sizeDecimals
    ? parseFloat(floatValue?.toFixed(sizeDecimals))
    : floatValue;
};

export default function SensorValueUse(props) {
  const { item, onChange, noShowSizeDecimals, noShowBooleanOption } = props;

  const intl = useIntl();

  const optionsTakeValue = [
    {
      value: TYPE_CONVERT_VALUE.VALUE,
      label: intl.formatMessage({ id: "value.pure" }),
    },
    {
      value: TYPE_CONVERT_VALUE.FUNCTION,
      label: intl.formatMessage({ id: "function.process" }),
    },
  ];

  !noShowBooleanOption &&
    optionsTakeValue.push({
      value: TYPE_CONVERT_VALUE.BOOLEAN,
      label: intl.formatMessage({ id: "value.boolean" }),
    });

  return (
    <>
      <Row>
        <Col breakPoint={{ md: 3 }}>
          <LabelIcon
            title={<FormattedMessage id="view" />}
            iconName="eye-outline"
          />
          <Select
            options={optionsTakeValue}
            menuPosition="fixed"
            defaultValue={optionsTakeValue[0]}
            placeholder={intl.formatMessage({
              id: "type.visualization.signal",
            })}
            onChange={(value) => onChange("typeVisualization", value)}
            value={item?.typeVisualization}
          />
        </Col>
        {!noShowSizeDecimals &&
          (!item?.typeVisualization ||
            item?.typeVisualization?.value === TYPE_CONVERT_VALUE.VALUE) && (
            <Col breakPoint={{ md: 4 }} className="mb-2">
              <LabelIcon
                title={<FormattedMessage id="decimals.acron" />}
                iconName="percent-outline"
              />
              <InputGroup fullWidth>
                <input
                  value={item?.sizeDecimals}
                  onChange={(e) =>
                    onChange("sizeDecimals", parseInt(e.target.value))
                  }
                  type="number"
                  min={1}
                  max={25}
                  placeholder={intl.formatMessage({
                    id: "size.decimals",
                  })}
                />
              </InputGroup>
            </Col>
          )}

        {item?.typeVisualization?.value === TYPE_CONVERT_VALUE.BOOLEAN && [
          <Col breakPoint={{ md: 4 }} className="mb-2">
            <LabelIcon
              title={<FormattedMessage id="true.value" />}
              iconName="hash-outline"
            />
            <InputGroup fullWidth>
              <input
                value={item?.trueValue}
                onChange={(e) =>
                  onChange("trueValue", parseInt(e.target.value))
                }
                type="number"
                placeholder={intl.formatMessage({
                  id: "true.value",
                })}
              />
            </InputGroup>
          </Col>,
          <Col breakPoint={{ md: 4 }} className="mb-2">
            <LabelIcon
              title={<FormattedMessage id="falseValue" />}
              iconName="hash-outline"
            />
            <InputGroup fullWidth>
              <input
                value={item?.falseValue}
                onChange={(e) =>
                  onChange("falseValue", parseInt(e.target.value))
                }
                type="number"
                placeholder={intl.formatMessage({
                  id: "false.value",
                })}
              />
            </InputGroup>
          </Col>,
        ]}
        {item?.typeVisualization?.value === TYPE_CONVERT_VALUE.FUNCTION && (
          <Col breakPoint={{ md: 9 }} className="mb-2">
            <LabelIcon
              title={<FormattedMessage id="function" />}
              iconName="code-outline"
            />
            <InputGroup fullWidth>
              <textarea
                type="text"
                placeholder={intl.formatMessage({
                  id: "function",
                })}
                value={item.function}
                onChange={(e) => onChange("function", e.target.value)}
              />
            </InputGroup>
          </Col>
        )}
      </Row>
    </>
  );
}
