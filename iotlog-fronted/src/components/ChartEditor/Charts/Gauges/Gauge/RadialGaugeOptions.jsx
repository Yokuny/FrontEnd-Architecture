import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import {
  SelectCondition,
  SelectMachine,
  SelectSensorByMachine,
  SelectSignalCreateable,
} from "../../../../Select";
import TextSpan from "../../../../Text/TextSpan";
import Select from "@paljs/ui/Select";
import { connect } from "react-redux";
import styled from "styled-components";
import { Button, EvaIcon } from "@paljs/ui";
import { debounce } from "underscore";
import { setDataChart, setDisabledSave } from "../../../../../actions";
import { LabelIcon } from "../../../../Label";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }

  overflow-x: hidden;
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

const RadialGaugeOptions = (props) => {
  const { intl, optionsData } = props;

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
          <TextSpan apparence="p2" hint>
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
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="machine" /> *
          </TextSpan>
          <div className="mt-1"></div>
          <SelectMachine
            value={optionsData?.machine}
            onChange={(value) => onChange("machine", value)}
          />
        </Col>
        <Col breakPoint={{ md: 6 }} className="mb-4">
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="sensor" /> *
          </TextSpan>
          <div className="mt-1"></div>
          <SelectSensorByMachine
            idMachine={optionsData?.machine?.value}
            value={optionsData?.sensor}
            onChange={(value) => onChange("sensor", value)}
          />
        </Col>
        <Col breakPoint={{ md: 2 }} className="mb-4">
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="unit" />
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <input
              placeholder={intl.formatMessage({
                id: "unit"
              })}
              type="text"
              onChange={(e) => onChange("description", e.target.value)}
              value={optionsData?.description}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 2 }} className="mb-4">
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="decimals.acron" />
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <input
              placeholder={intl.formatMessage({
                id: "decimals.acron",
              })}
              type="number"
              min={0}
              onChange={(e) =>
                onChange("sizeDecimal", parseInt(e.target.value))
              }
              value={optionsData?.sizeDecimal}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 2 }} className="mb-4">
          <TextSpan apparence="p2" hint>
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
        <Col breakPoint={{ md: 2 }} className="mb-4">
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="scale" />
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <input
              value={optionsData?.scale}
              onChange={(e) => onChange("scale", e.target.value ? parseInt(e.target.value) : 0)}
              type="number"
              placeholder={intl.formatMessage({ id: "scale" })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 2 }} className="mb-4">
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="pointers.placeholder" />
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <input
              value={optionsData?.split}
              onChange={(e) => onChange("split", e.target.value ? parseInt(e.target.value) : 0)}
              type="number"
              placeholder={intl.formatMessage({ id: "pointers.placeholder" })}
            />
          </InputGroup>
        </Col>
        {/* <Col breakPoint={{ md: 6 }} className="mb-4">
          <TextSpan apparence="p2" hint>
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
        </Col> */}
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="function" />
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <textarea
              value={optionsData?.funcTakeData}
              rows={2}
              onChange={(e) => onChange("funcTakeData", e.target.value)}
              placeholder={"() => value;"}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <TextSpan apparence="p2" hint>
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
        <Col breakPoint={{ md: 12 }} className="ml-1 pr-1">
          {optionsData?.colorsConditions?.map((colorCondition, i) => (
            <Row key={`${i}`}>
              <Col breakPoint={{ md: 10 }}>
                <Row>
                  <Col breakPoint={{ md: 5 }} className="mb-2">
                    <TextSpan apparence="p2" hint>
                      <FormattedMessage id="condition" /> *
                    </TextSpan>
                    <div className="mt-1"></div>
                    <SelectCondition
                      placeholderID="condition"
                      onChange={(value) => onChangeItem(i, "condition", value)}
                      value={colorCondition?.condition}
                    />
                  </Col>
                  <Col breakPoint={{ md: 5 }} className="mb-2">
                    <TextSpan apparence="p2" hint>
                      <FormattedMessage id="value" /> *
                    </TextSpan>
                    <InputGroup fullWidth className="mt-1">
                      <input
                        value={colorCondition?.value}
                        onChange={(e) =>
                          onChangeItem(i, "value", e.target.value)
                        }
                        type="text"
                        placeholder={intl.formatMessage({
                          id: "value",
                        })}
                      />
                    </InputGroup>
                  </Col>
                  <Col breakPoint={{ md: 2 }} className="mb-2">
                    <LabelIcon
                      title={intl.formatMessage({ id: "color" })}
                    />
                    <ContainerColor className="mt-1">
                      <InputColor
                        type="color"
                        defaultValue={"#3366ff"}
                        value={colorCondition?.color}
                        onChange={(e) =>
                          changeValueDebounced(i, "color", e.target.value)
                        }
                      />
                    </ContainerColor>
                  </Col>
                </Row>
              </Col>
              <Col breakPoint={{ md: 2 }} className="pt-2" style={{ justifyContent: "center" }}>
                <Button
                  status="Danger"
                  appearance="ghost"
                  className="mt-4"
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
          <Button
            size="Tiny"
            status="Info"
            className="mt-2 mb-2 flex-between"
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
            <EvaIcon name="plus-outline" />
            <FormattedMessage id="add.color.condition" />
          </Button>
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

const RadialGaugeOptionsRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(RadialGaugeOptions);

export default injectIntl(RadialGaugeOptionsRedux);
