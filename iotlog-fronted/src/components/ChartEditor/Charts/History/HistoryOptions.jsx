import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { connect } from "react-redux";
import { setDisabledSave, setDataChart } from "../../../../actions";
import styled from "styled-components";
import { Button, Checkbox, EvaIcon, Select } from "@paljs/ui";
import {
  SelectMachine,
  SelectSensorByMachine,
} from "../../../Select";
import TextSpan from "../../../Text/TextSpan";
import { debounce } from "underscore";
import { TYPE_CONVERT_VALUE } from "./Constants";
import { formatFloat, parseToFloatValid } from "../../../Utils";
import { LabelIcon } from "../../../Label";

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

const sensorsNotAllowed = ["eta","destination","statusnavigation","currentport","nextport"];

const HistoryOptions = (props) => {
  const { optionsData } = props;
  const intl = useIntl();

  const types_charts = [
    {
      value: "line",
      label: intl.formatMessage({ id: "line.chart" }),
    },
    {
      value: "area",
      label: intl.formatMessage({ id: "area.chart" }),
    },
    {
      value: "bar",
      label: intl.formatMessage({ id: "bar.chart" }),
    },
  ];

  const optionsTakeValue = [
    {
      value: TYPE_CONVERT_VALUE.VALUE,
      label: intl.formatMessage({ id: "value.pure" }),
    },
    {
      value: TYPE_CONVERT_VALUE.BOOLEAN,
      label: intl.formatMessage({ id: "value.boolean" }),
    },
    {
      value: TYPE_CONVERT_VALUE.FUNCTION,
      label: intl.formatMessage({ id: "function.process" }),
    },
  ];

  const verifyDisabled = () => {
    const allDataRequired = !!optionsData?.title;
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
    let machine = props.optionsData.machines[index];
    machine[prop] = value;
    props.setOptionsData({
      ...props.optionsData,
      machines: [
        ...props.optionsData.machines.slice(0, index),
        machine,
        ...props.optionsData.machines.slice(index + 1),
      ],
    });
    verifyDisabled();
  };

  const onChangeItemAnnotation = (index, prop, value) => {


    let annotation = props.optionsData.annotations[index];
    if (prop === 'valueFormated') {
      annotation.value = parseToFloatValid(value);
      annotation.valueFormated = value;
    }
    else
      annotation[prop] = value;
    props.setOptionsData({
      ...props.optionsData,
      annotations: [
        ...props.optionsData.annotations.slice(0, index),
        annotation,
        ...props.optionsData.annotations.slice(index + 1),
      ],
    });
    verifyDisabled();
  };

  const changeValueDebounced = debounce((index, prop, value) => {
    onChangeItem(index, prop, value);
  }, 500);

  const changeValueDebouncedAnnotation = debounce((index, prop, value) => {
    onChangeItemAnnotation(index, prop, value);
  }, 500);

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <LabelIcon
            title={<FormattedMessage id="title" />}
            iconName="text-outline"
          />
          <InputGroup fullWidth className="mt-1">
            <input
              value={optionsData?.title}
              onChange={(e) => onChange("title", e.target.value)}
              type="text"
              placeholder={intl.formatMessage({ id: "title" })}
            />
          </InputGroup>
        </Col>

        <Col breakPoint={{ md: 4 }} className="mb-4">
          <LabelIcon
            title={<FormattedMessage id="type.chart.placelholder" />}
            iconName="bar-chart-outline"
          />
          <Select
            className="mt-1"
            options={types_charts}
            placeholder={intl.formatMessage({
              id: "type.chart.placelholder",
            })}
            value={optionsData?.typeChart}
            onChange={(value) => onChange("typeChart", value)}
            menuPosition="fixed"
          />
        </Col>
        <Col breakPoint={{ md: 4 }} className="mb-4">
          <LabelIcon
            title={<FormattedMessage id="show.date" />}
            iconName="clock-outline"
          />
          <Select
            className="mt-1"
            options={[
              {
                value: "date",
                label: intl.formatMessage({ id: "date.sensor" }),
              },
              {
                value: "dateServer",
                label: intl.formatMessage({ id: "date.server" }),
              },
            ]}
            placeholder={intl.formatMessage({
              id: "type.date",
            })}
            value={optionsData?.typeDate}
            onChange={(value) => onChange("typeDate", value)}
            menuPosition="fixed"
          />
        </Col>
        <Col breakPoint={{ md: 4 }}>
          <LabelIcon
            title={<FormattedMessage id="stepline.style" />}
            iconName="corner-up-right-outline"
          />
          <Checkbox
            className="mt-2"
            checked={optionsData?.stepline}
            onChange={(e) => onChange("stepline", !optionsData?.stepline)}
          >
            <TextSpan apparence="s2">
              <FormattedMessage id="stepline" />
            </TextSpan>
          </Checkbox>
        </Col>
        <Col
          breakPoint={{ md: 12 }}
          style={{ display: "flex", flexDirection: "column" }}
        >
          {optionsData?.machines?.map((machineItem, i) => {
            return (
              <Row key={i} className="mb-4 ml-2">
                <Col breakPoint={{ md: 10 }}>
                  <Row>
                    <Col
                      breakPoint={{ md: 6 }}
                      className="mb-2"
                      id={`machine_${i}`}
                    >
                      <LabelIcon
                        title={<FormattedMessage id="machine" />}
                        iconName="wifi-outline"
                      />
                      <div className="mt-1"></div>
                      <SelectMachine
                        value={machineItem?.machine}
                        onChange={(value) => onChangeItem(i, "machine", value)}
                        placeholder={"machine"}
                      />
                    </Col>
                    <Col breakPoint={{ md: 6 }} className="mb-2">
                      <LabelIcon
                        title={<FormattedMessage id="sensor" />}
                        iconName="flash-outline"
                      />
                      <div className="mt-1"></div>
                      <SelectSensorByMachine
                        placeholder={"sensor"}
                        idMachine={machineItem?.machine?.value}
                        value={machineItem?.sensor}
                        onChange={(value) => onChangeItem(i, "sensor", value)}
                        idsNotAllowed={sensorsNotAllowed}
                      />
                    </Col>
                    <Col breakPoint={{ md: 6 }} className="mb-2">
                      <LabelIcon
                        title={<FormattedMessage id="type.visualization.signal" />}
                        iconName="eye-outline"
                      />
                      <Select
                        className="mt-1"
                        options={optionsTakeValue}
                        menuPosition="fixed"
                        defaultValue={optionsTakeValue[0]}
                        placeholder={intl.formatMessage({
                          id: "type.visualization.signal",
                        })}
                        onChange={(value) =>
                          onChangeItem(i, "typeVisualization", value)
                        }
                        value={machineItem?.typeVisualization}
                      />
                    </Col>
                    {machineItem?.typeVisualization?.value ===
                      TYPE_CONVERT_VALUE.BOOLEAN && [
                        <Col breakPoint={{ md: 3 }} className="mb-2">
                          <TextSpan apparence="s2">
                            <FormattedMessage id="true.value" />
                          </TextSpan>
                          <InputGroup fullWidth className="mt-1">
                            <input
                              value={machineItem?.trueValue}
                              onChange={(e) =>
                                onChangeItem(
                                  i,
                                  "trueValue",
                                  parseInt(e.target.value)
                                )
                              }
                              type="number"
                              placeholder={intl.formatMessage({
                                id: "true.value",
                              })}
                            />
                          </InputGroup>
                        </Col>,
                        <Col breakPoint={{ md: 3 }} className="mb-2">
                          <TextSpan apparence="s2">
                            <FormattedMessage id="false.value" />
                          </TextSpan>
                          <InputGroup fullWidth className="mt-1">
                            <input
                              value={machineItem?.falseValue}
                              onChange={(e) =>
                                onChangeItem(
                                  i,
                                  "falseValue",
                                  parseInt(e.target.value)
                                )
                              }
                              type="number"
                              placeholder={intl.formatMessage({
                                id: "false.value",
                              })}
                            />
                          </InputGroup>
                        </Col>,
                      ]}

                    <Col
                      breakPoint={{ md: 6 }}
                      className={`mb-2`}
                    >
                      <LabelIcon
                        title={<FormattedMessage id="color" />}
                        iconName="color-palette-outline"
                      />
                      <ContainerColor className="mt-1">
                        <InputColor
                          type="color"
                          defaultValue={"#3366ff"}
                          value={machineItem?.color}
                          onChange={(e) =>
                            changeValueDebounced(i, "color", e.target.value)
                          }
                        />
                        <TextSpan apparence="s1" className="ml-2">
                          <FormattedMessage id="color" />
                        </TextSpan>
                      </ContainerColor>
                    </Col>

                    {machineItem?.typeVisualization?.value ===
                      TYPE_CONVERT_VALUE.FUNCTION && (
                        <Col breakPoint={{ md: 12 }} className="mb-2">
                          <LabelIcon
                            title={<FormattedMessage id="function" />}
                            iconName="code-outline"
                          />
                          <InputGroup fullWidth className="mt-1">
                            <textarea
                              type="text"
                              placeholder={`value * 10`}
                              value={machineItem.function}
                              onChange={(e) =>
                                onChangeItem(i, "function", e.target.value)
                              }
                            />
                          </InputGroup>
                        </Col>
                      )}
                  </Row>
                </Col>
                <Col
                  breakPoint={{ md: 2 }}
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Button
                    status="Danger"
                    className="mb-4"
                    size="Tiny"
                    onClick={() => {
                      onChange(
                        "machines",
                        optionsData?.machines.filter((x, j) => j != i)
                      );
                    }}
                  >
                    <EvaIcon name="trash-2-outline" />
                  </Button>
                </Col>
              </Row>
            );
          })}
          <div className="ml-1">
            <Button
              size="Tiny"
              status="Info"
              className="mb-4 ml-4 flex-between"
              onClick={() => {
                if (optionsData?.machines?.length) {
                  onChange("machines", [
                    ...optionsData?.machines,
                    { typeVisualization: optionsTakeValue[0] },
                  ]);
                  return;
                }
                onChange("machines", [{}]);
              }}
              style={{ padding: 4 }}
            >
              <EvaIcon name="wifi-outline" className="mr-1" />
              <FormattedMessage id="add.machine" />
            </Button>
          </div>

          {optionsData?.annotations?.map((annotationItem, i) => {
            return (
              <>
                <Row key={`anno-${i}`} className="mb-2 ml-2 mr-4">
                  <Col breakPoint={{ md: 10 }}>
                    <Row>
                      <Col breakPoint={{ md: 6 }} className="mb-2">
                        <LabelIcon
                          title={<FormattedMessage id="description" />}
                          iconName="message-circle-outline"
                        />
                        <InputGroup fullWidth className="mt-1">
                          <input
                            value={annotationItem?.description}
                            onChange={(e) =>
                              onChangeItemAnnotation(
                                i,
                                "description",
                                e.target.value
                              )
                            }
                            type="text"
                            placeholder={intl.formatMessage({
                              id: "description",
                            })}
                          />
                        </InputGroup>
                      </Col>
                      <Col breakPoint={{ md: 4 }} className="mb-2">
                        <LabelIcon
                          title={<FormattedMessage id="value" />}
                          iconName="hash-outline"
                        />
                        <InputGroup fullWidth className="mt-1">
                          <input
                            value={annotationItem?.valueFormated || annotationItem?.value}
                            onChange={(e) =>
                              onChangeItemAnnotation(
                                i,
                                "valueFormated",
                                formatFloat(e.target.value)
                              )
                            }
                            type="text"
                            placeholder={intl.formatMessage({
                              id: "value",
                            })}
                          />
                        </InputGroup>
                      </Col>
                      <Col breakPoint={{ md: 2 }}>
                        <LabelIcon
                          title={<FormattedMessage id="color" />}
                          iconName="color-palette-outline"
                        />
                        <ContainerColor className="mt-1">
                          <InputColor
                            type="color"
                            defaultValue={"#3366ff"}
                            value={annotationItem?.color}
                            onChange={(e) =>
                              changeValueDebouncedAnnotation(
                                i,
                                "color",
                                e.target.value
                              )
                            }
                          />
                          <TextSpan apparence="s1" className="ml-2">
                            <FormattedMessage id="color" />
                          </TextSpan>
                        </ContainerColor>
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    breakPoint={{ md: 2 }}
                    style={{
                      justifyContent: "center",
                      display: "flex",
                      alignItems: "center",
                    }}
                    className="pt-4"
                  >
                    <Button
                      status="Danger"
                      size="Tiny"
                      appearance="ghost"
                      onClick={() => {
                        onChange(
                          "annotations",
                          optionsData?.annotations.filter((x, j) => j != i)
                        );
                      }}
                    >
                      <EvaIcon name="trash-2" />
                    </Button>
                  </Col>
                </Row>
              </>
            );
          })}
          <div className={`ml-3 ${!optionsData?.annotations?.length && 'mt-2'}`}>
            <Button
              size="Tiny"
              status="Success"
              className="mb-4 ml-2 flex-between"
              onClick={() => {
                if (optionsData?.annotations?.length) {
                  onChange("annotations", [...optionsData?.annotations, {}]);
                  return;
                }
                onChange("annotations", [{}]);
              }}
              style={{ padding: 4 }}
            >
              <EvaIcon name="trending-up-outline" className="mr-1" />
              <FormattedMessage id="add.goal" />
            </Button>
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(HistoryOptions);
