import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import {
  SelectCondition,
  SelectMachine,
  SelectSensorByMachine,
} from "../../../Select";
import TextSpan from "../../../Text/TextSpan";
import Select from "@paljs/ui/Select";
import { connect } from "react-redux";
import { setDisabledSave, setDataChart } from "../../../../actions";
import styled from "styled-components";
import { Button, EvaIcon } from "@paljs/ui";
import { debounce } from "underscore";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const InputColor = styled.input`
  width: 50px;
  height: 35px;
  padding: 2px !important;
`;

const ContainerColor = styled(InputGroup)`
  display: flex !important;
  align-items: center !important;
`;

const TemperatureOptions = (props) => {
  const { optionsData } = props;
  const intl = useIntl();

  const optionsDescription = [
    {
      value: "text",
      label: intl.formatMessage({ id: "fixed.text" }),
    },
    {
      value: "integration",
      label: intl.formatMessage({ id: "field.integration" }),
    },
  ];

  const verifyDisabled = () => {
    const allDataRequired =
      !!optionsData?.sensor?.value &&
      !!optionsData?.machine?.value &&
      !!optionsData?.title;
    if (allDataRequired && props.disabled) {
      props.setDisabled(false);
    } else if (!allDataRequired && !props.disabled) {
      props.setDisabled(true);
    }
  };

  const onChange = (prop, value) => {
    props.setOptionsData({
      ...props.optionsData,
      [prop]: value,
    });
    verifyDisabled();
  };

  const onChangeItem = (index, prop, value) => {
    let limit = props.optionsData.colorsConditions[index];

    limit[prop] = value;

    props.setOptionsData({
      ...props.optionsData,
      colorsConditions: [
        ...props.optionsData.colorsConditions.slice(0, index),
        limit,
        ...props.optionsData.colorsConditions.slice(index + 1),
      ],
    });
    verifyDisabled();
  };

  const changeValueDebounced = debounce((index, prop, value) => {
    onChangeItem(index, prop, value);
  }, 500);

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="title" /> *
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <input
              value={optionsData?.title}
              onChange={(e) => onChange("title", e.target.value)}
              type="text"
              placeholder={intl.formatMessage({ id: "title" })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 6 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="machine" /> *
          </TextSpan>
          <div className="mt-1"></div>
          <SelectMachine
            value={optionsData?.machine}
            onChange={(value) => onChange("machine", value)}
          />
        </Col>
        <Col breakPoint={{ md: 6 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="sensor" /> *
          </TextSpan>
          <div className="mt-1"></div>
          <SelectSensorByMachine
            idMachine={optionsData?.machine?.value}
            value={optionsData?.sensor}
            onChange={(value) => onChange("sensor", value)}
          />
        </Col>
        <Col breakPoint={{ md: 3 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="size.decimals" />
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <input
              value={optionsData?.sizeDecimals}
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
        <Col breakPoint={{ md: 9 }} className="mb-4">
          <Row>
            <Col breakPoint={{ md: 6 }}>
              <TextSpan apparence="s2">
                <FormattedMessage id="source.unit" />
              </TextSpan>
              <Select
                className="mt-1"
                isClearable
                options={optionsDescription}
                menuPosition="fixed"
                placeholder={intl.formatMessage({ id: "unit" })}
                onChange={(value) => onChange("optionDescription", value)}
                value={optionsData?.optionDescription}
              />
            </Col>
            {!!optionsData?.optionDescription?.value && (
              <Col breakPoint={{ md: 6 }}>
                <TextSpan apparence="s2">
                  <FormattedMessage id="unit" />
                </TextSpan>
                <InputGroup fullWidth className="mt-1">
                  <input
                    placeholder={intl.formatMessage({
                      id:
                        optionsData?.optionDescription?.value == "text"
                          ? "text.placeholder"
                          : "field.integration.placeholder",
                    })}
                    type="text"
                    onChange={(e) => onChange("description", e.target.value)}
                    value={optionsData?.description}
                  />
                </InputGroup>
                {optionsData?.optionDescription?.value == "integration" && (
                  <TextSpan apparence="c1">
                    <FormattedMessage id="field.integration.observation" />
                  </TextSpan>
                )}
              </Col>
            )}
          </Row>
        </Col>
        <Col breakPoint={{ md: 3 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="min.value" />
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <input
              value={optionsData?.minValue}
              onChange={(e) => onChange("minValue", e.target.value)}
              type="number"
              placeholder={intl.formatMessage({ id: "min.value" })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 3 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="max.value" />
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <input
              value={optionsData?.maxValue}
              onChange={(e) => onChange("maxValue", e.target.value)}
              type="number"
              placeholder={intl.formatMessage({ id: "max.value" })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 6 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="pointers.placeholder" />
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <input
              value={optionsData?.pointers}
              onChange={(e) => onChange("pointers", e.target.value)}
              type="text"
              placeholder={intl.formatMessage({ id: "pointers.placeholder" })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="link.open.chart" />
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <input
              value={optionsData?.link}
              onChange={(e) => onChange("link", e.target.value)}
              type="text"
              placeholder={intl.formatMessage({
                id: "link.open.chart",
              })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 12 }} className="ml-2 pr-1">
          <Button
            size="Tiny"
            status="Success"
            className="mb-4"
            onClick={() => {
              if (optionsData?.colorsConditions?.length) {
                onChange("colorsConditions", [
                  ...optionsData?.colorsConditions,
                  { color: "#3366ff" },
                ]);
                return;
              }
              onChange("colorsConditions", [{ color: "#3366ff" }]);
            }}
          >
            <FormattedMessage id="add.color.condition" />
          </Button>

          {optionsData?.colorsConditions?.map((colorCondition, i) => (
            <Row key={`${i}`} className="mb-2">
              <Col breakPoint={{ md: 10 }}>
                <Row>
                  <Col breakPoint={{ md: 4 }} className="mb-4">
                    <SelectCondition
                      placeholderID="condition"
                      onChange={(value) => onChangeItem(i, "condition", value)}
                      value={colorCondition?.condition}
                    />
                  </Col>
                  <Col breakPoint={{ md: 4 }} className="mb-2">
                    <InputGroup fullWidth>
                      <input
                        value={colorCondition?.value}
                        onChange={(e) =>
                          onChangeItem(i, "value", e.target.value)
                        }
                        type="text"
                        placeholder={intl.formatMessage({
                          id: "machine.alarm.value.label",
                        })}
                      />
                    </InputGroup>
                  </Col>
                  <Col breakPoint={{ md: 4 }} className="mb-2">
                    <ContainerColor>
                      <InputColor
                        type="color"
                        defaultValue={"#3366ff"}
                        value={colorCondition?.color}
                        onChange={(e) =>
                          changeValueDebounced(i, "color", e.target.value)
                        }
                      />
                      <TextSpan apparence="s1" className="ml-2">
                        <FormattedMessage id="color" />
                      </TextSpan>
                    </ContainerColor>
                  </Col>
                </Row>
              </Col>
              <Col breakPoint={{ md: 2 }} style={{ justifyContent: "center" }}>
                <Button
                  status="Danger"
                  size="Tiny"
                  onClick={() => {
                    onChange(
                      "colorsConditions",
                      optionsData?.colorsConditions?.filter((x, z) => z != i)
                    );
                  }}
                >
                  <EvaIcon name="trash-2-outline" />
                </Button>
              </Col>
            </Row>
          ))}
        </Col>
      </ContainerRow>
    </>
  );
};

const mapStateToProps = (state) => ({
  disabled: state.dashboard.disabledButtonSave,
  optionsData: state.dashboard.data,
});

const mapDispatchToProps = (dispatch) => ({
  setDisabled: (disabled) => {
    dispatch(setDisabledSave(disabled));
  },
  setOptionsData: (data) => {
    dispatch(setDataChart(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TemperatureOptions);
