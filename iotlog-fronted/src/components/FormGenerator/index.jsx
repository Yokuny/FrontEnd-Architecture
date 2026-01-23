import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { InputGroup } from "@paljs/ui/Input";
import Select from "@paljs/ui/Select";
import { Button } from "@paljs/ui/Button";

import { UNITY_LIFECYCLE } from "../../constants";
import { Checkbox } from "@paljs/ui/Checkbox";
import TextSpan from "../Text/TextSpan";

const FormGenerator = ({
  dataMap,
  data,
  optionsSelect,
  onClick,
  onChange,
  children,
  isLoading = [],
  disabled = [],
  noSave = false,
}) => {
  const intl = useIntl();

  const getComponent = (componentProps) => {
    switch (componentProps.typeComponent) {
      case "text":
        return (
          <>
            <TextSpan apparence="s2">
              {componentProps.placeholder
                ? intl.formatMessage({ id: componentProps.placeholder })
                : ""}
            </TextSpan>
            <InputGroup fullWidth>
              <input
                id={`fe${componentProps.name}`}
                type="text"
                placeholder={
                  componentProps.placeholder
                    ? intl.formatMessage({ id: componentProps.placeholder })
                    : ""
                }
                onChange={(text) =>
                  onChange(componentProps.name, text.target.value)
                }
                value={data[componentProps.name]}
                disabled={disabled.find((x) => x === componentProps.name)}
              />
            </InputGroup>
          </>
        );
      case "number":
        return (
          <InputGroup fullWidth>
            <input
              id={`fe${componentProps.name}`}
              type="number"
              placeholder={
                componentProps.placeholder
                  ? intl.formatMessage({ id: componentProps.placeholder })
                  : ""
              }
              onChange={(text) =>
                onChange(componentProps.name, text.target.value)
              }
              value={data[componentProps.name]}
              disabled={disabled.find((x) => x === componentProps.name)}
            />
          </InputGroup>
        );
      case "check":
        return (
          <Checkbox
            checked={!!data[componentProps.name]}
            onChange={() =>
              onChange(componentProps.name, !data[componentProps.name])
            }
          >
            <TextSpan apparence="s2">
              <FormattedMessage id={componentProps.label} />
            </TextSpan>
          </Checkbox>
        );
      case "select":
        return (
          <Select
            id={`fe${componentProps.name}`}
            options={optionsSelect[componentProps.name]}
            className="no-fontWeight"
            placeholder={
              componentProps.placeholder
                ? intl.formatMessage({ id: componentProps.placeholder })
                : ""
            }
            onChange={(value) => onChange(componentProps.name, value)}
            value={data[componentProps.name]}
            isMulti={!!componentProps.isMulti}
            noOptionsMessage={() =>
              intl.formatMessage({ id: "nooptions.message" })
            }
            isClearable={!!componentProps.isClearable}
            isDisabled={disabled.find((x) => x === componentProps.name)}
          />
        );
      case "texteditor":
        return (
          <>
            <TextSpan apparence="s2">
              {componentProps.placeholder
                ? intl.formatMessage({ id: componentProps.placeholder })
                : ""}
            </TextSpan>
            <InputGroup fullWidth className="mt-1">
              <textarea
                id={`fe${componentProps.name}`}
                type="text"
                placeholder={
                  componentProps.placeholder
                    ? intl.formatMessage({ id: componentProps.placeholder })
                    : ""
                }
                onChange={(text) =>
                  onChange(componentProps.name, text.target.value)
                }
                value={data[componentProps.name]}
                disabled={disabled.find((x) => x === componentProps.name)}
                rows={componentProps.rows}
              />
            </InputGroup>
          </>
        );
      case "lifecycle":
        let unityCycle =
          data[componentProps.name] && data[componentProps.name].unity
            ? data[componentProps.name].unity
            : undefined;

        const valueCycle =
          data[componentProps.name] && data[componentProps.name].value
            ? data[componentProps.name].value
            : undefined;

        const optionsTranslate = UNITY_LIFECYCLE.map((y) => ({
          value: y.value,
          label: intl.formatMessage({ id: y.label }),
        }));

        return (
          <Row between style={{ alignItems: "center" }}>
            <Col breakPoint={{ md: 6 }}>
              <InputGroup fullWidth>
                <input
                  id={`lifecycle.value.${componentProps.name}`}
                  type="number"
                  placeholder={intl.formatMessage({ id: "value.cycle" })}
                  onChange={(text) =>
                    onChange(componentProps.name, {
                      unity: unityCycle,
                      value: text.target.value,
                    })
                  }
                  value={valueCycle}
                  min={0}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 6 }}>
              <Select
                id={`lifecycle.select.${componentProps.name}`}
                options={optionsTranslate}
                placeholder={intl.formatMessage({ id: "unity.cycle" })}
                onChange={(value) =>
                  onChange(componentProps.name, {
                    unity: value.value,
                    value: valueCycle,
                  })
                }
                value={
                  unityCycle
                    ? optionsTranslate.find((y) => y.value == unityCycle)
                    : undefined
                }
                defaultValue={optionsTranslate[0]}
                isLoading={isLoading.some((x) => x == componentProps.name)}
                noOptionsMessage={() =>
                  intl.formatMessage({ id: "nooptions.message" })
                }
              />
            </Col>
          </Row>
        );
      case "col":
        return (
          <Col breakPoint={{ md: 12 }}>
            {!!componentProps.fields &&
              !!componentProps.fields.length &&
              componentProps.fields.map((line, i) => {
                return (
                  <Row key={`field-col-${i}`}>
                    {!!line &&
                      !!line.length &&
                      line.map((column, j) => {
                        return (
                          <Col
                            key={`field-col-${j}`}
                            breakPoint={{ md: column.md }}
                          >
                            {!!column.label && (
                              <label
                                htmlFor={`fe${column.name}`}
                                className={column.classLabel || ""}
                              >
                                <FormattedMessage id={column.label} />
                              </label>
                            )}
                            {getComponent(column)}
                            {!!column.observation && (
                              <span className="description-info">
                                <FormattedMessage id={column.observation} />
                              </span>
                            )}
                          </Col>
                        );
                      })}
                  </Row>
                );
              })}
          </Col>
        );
      default:
        return <div></div>;
    }
  };

  return (
    <>
      {dataMap?.map((line, i) => {
        return (
          <Row key={i}>
            {line?.map((column, j) => {
              return (
                <Col
                  className={`${j < line.length - 1 ? "mb-4" : ""} ${
                    column.className
                  }`}
                  key={j}
                  breakPoint={{ md: column.md }}
                >
                  {getComponent(column)}
                  {!!column.observation && (
                    <span className="description-info">
                      <FormattedMessage id={column.observation} />
                    </span>
                  )}
                </Col>
              );
            })}
          </Row>
        );
      })}
      {!!children ? <Row>{children}</Row> : undefined}
      {!!onClick && (
        <Button status="Primary" size="Small" onClick={onClick}>
          <FormattedMessage id="save" />
        </Button>
      )}
    </>
  );
};

export default FormGenerator;
