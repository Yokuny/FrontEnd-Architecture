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
} from "../../../Select";
import TextSpan from "../../../Text/TextSpan";
import Select from "@paljs/ui/Select";
import { connect } from "react-redux";
import { setDisabledSave, setDataChart } from "../../../../actions";
import styled from "styled-components";
import { Button, EvaIcon } from "@paljs/ui";
import { LEVEL_NOTIFICATION } from "../../../../constants";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const BatteryOptions = (props) => {
  const { intl, optionsData } = props;

  const levels = [
    {
      label: props.intl.formatMessage({ id: "critical" }),
      value: LEVEL_NOTIFICATION.CRITICAL,
    },
    {
      label: props.intl.formatMessage({ id: "warn" }),
      value: LEVEL_NOTIFICATION.WARNING,
    },
    {
      label: props.intl.formatMessage({ id: "info" }),
      value: LEVEL_NOTIFICATION.INFO,
    },
  ];

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
    let machine = props.optionsData.colorsConditions[index];

    machine[prop] = value;

    props.setOptionsData({
      ...props.optionsData,
      colorsConditions: [
        ...props.optionsData.colorsConditions.slice(0, index),
        machine,
        ...props.optionsData.colorsConditions.slice(index + 1),
      ],
    });
    verifyDisabled();
  };

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <InputGroup fullWidth>
            <input
              value={optionsData?.title}
              onChange={(e) => onChange("title", e.target.value)}
              type="text"
              placeholder={intl.formatMessage({ id: "title" })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <SelectMachine
            value={optionsData?.machine}
            onChange={(value) => onChange("machine", value)}
          />
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <TextSpan apparence="s1">
            <FormattedMessage id="charging" />
          </TextSpan>
          <div className="mt-2"></div>
          <SelectSensorByMachine
            idMachine={optionsData?.machine?.value}
            value={optionsData?.sensorCharging}
            onChange={(value) => onChange("sensorCharging", value)}
          />
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <SelectSignalCreateable
            placeholder={intl.formatMessage({
              id: "signal.placeholder",
            })}
            onChange={(value) => onChange("signalCharging", value)}
            value={optionsData?.signalCharging}
            idMachine={optionsData?.machine?.value}
            sensorId={optionsData?.sensorCharging?.value}
            noOptionsMessage={
              !optionsData?.sensor ? "select.first.sensor" : "nooptions.message"
            }
            sensorNew={!!optionsData?.sensorCharging?.__isNew__}
          />
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <TextSpan apparence="s1">
            <FormattedMessage id="volts.level" />
          </TextSpan>
          <div className="mt-2"></div>
          <SelectSensorByMachine
            idMachine={optionsData?.machine?.value}
            value={optionsData?.sensor}
            onChange={(value) => onChange("sensor", value)}
          />
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <SelectSignalCreateable
            placeholder={intl.formatMessage({
              id: "signal.placeholder",
            })}
            onChange={(value) => onChange("signal", value)}
            value={optionsData?.signal}
            idMachine={optionsData?.machine?.value}
            sensorId={optionsData?.sensor?.value}
            noOptionsMessage={
              !optionsData?.sensor ? "select.first.sensor" : "nooptions.message"
            }
            sensorNew={!!optionsData?.sensor?.__isNew__}
          />
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <Row>
            <Col breakPoint={{ md: 6 }}>
              <Select
                isClearable
                options={optionsDescription}
                menuPosition="fixed"
                placeholder={intl.formatMessage({ id: "type.description" })}
                onChange={(value) => onChange("optionDescription", value)}
                value={optionsData?.optionDescription}
              />
            </Col>
            {!!optionsData?.optionDescription?.value && (
              <Col breakPoint={{ md: 6 }}>
                <InputGroup fullWidth>
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
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <TextSpan apparence="s1">
            <FormattedMessage id="volts.nominal" />
          </TextSpan>
          <div className="mt-2"></div>
          <SelectSensorByMachine
            idMachine={optionsData?.machine?.value}
            value={optionsData?.sensorNominal}
            onChange={(value) => onChange("sensorNominal", value)}
          />
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <SelectSignalCreateable
            placeholder={intl.formatMessage({
              id: "signal.placeholder",
            })}
            onChange={(value) => onChange("signalNominal", value)}
            value={optionsData?.signalNominal}
            idMachine={optionsData?.machine?.value}
            sensorId={optionsData?.sensorNominal?.value}
            noOptionsMessage={
              !optionsData?.sensorNominal
                ? "select.first.sensor"
                : "nooptions.message"
            }
            sensorNew={!!optionsData?.sensorNominal?.__isNew__}
          />
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <Row>
            <Col breakPoint={{ md: 6 }}>
              <Select
                isClearable
                options={optionsDescription}
                menuPosition="fixed"
                placeholder={intl.formatMessage({ id: "type.description" })}
                onChange={(value) =>
                  onChange("optionDescriptionNominal", value)
                }
                value={optionsData?.optionDescriptionNominal}
              />
            </Col>
            {!!optionsData?.optionDescriptionNominal?.value && (
              <Col breakPoint={{ md: 6 }}>
                <InputGroup fullWidth>
                  <input
                    placeholder={intl.formatMessage({
                      id:
                        optionsData?.optionDescriptionNominal?.value == "text"
                          ? "text.placeholder"
                          : "field.integration.placeholder",
                    })}
                    type="text"
                    onChange={(e) =>
                      onChange("descriptionNominal", e.target.value)
                    }
                    value={optionsData?.descriptionNominal}
                  />
                </InputGroup>
                {optionsData?.optionDescriptionNominal?.value ==
                  "integration" && (
                  <TextSpan apparence="c1">
                    <FormattedMessage id="field.integration.observation" />
                  </TextSpan>
                )}
              </Col>
            )}
          </Row>
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
                  {},
                ]);
                return;
              }
              onChange("colorsConditions", [{}]);
            }}
          >
            <FormattedMessage id="add.color.condition" />
          </Button>

          {optionsData?.colorsConditions?.map((colorCondition, i) => (
            <Row key={`${i}`} className="mb-2">
              <Col breakPoint={{ md: 10 }}>
                <Row>
                  <Col breakPoint={{ md: 4 }} className="mb-2">
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
                    <Select
                      options={levels}
                      value={colorCondition?.level}
                      onChange={(value) => onChangeItem(i, "level", value)}
                      menuPosition="fixed"
                      noOptionsMessage={() =>
                        props.intl.formatMessage({
                          id: "nooptions.message",
                        })
                      }
                      placeholder={props.intl.formatMessage({
                        id: "machine.alarm.level.label",
                      })}
                    />
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
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <InputGroup fullWidth>
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

const BatteryOptionsRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(BatteryOptions);

export default injectIntl(BatteryOptionsRedux);
