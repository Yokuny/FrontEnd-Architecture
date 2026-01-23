import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import {
  SelectMachine,
  SelectSensorByMachine,
} from "../../../Select";
import TextSpan from "../../../Text/TextSpan";
import Select from "@paljs/ui/Select";
import { connect } from "react-redux";
import { setDisabledSave, setDataChart } from "../../../../actions";
import styled from "styled-components";
import { debounce } from "underscore";
import SensorValueUse from "../../OptionsBase/SensorValueUse";
import { Checkbox } from "@paljs/ui";
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

const RealtimeOptions = (props) => {
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

  const changeValueDebounced = debounce((prop, value) => {
    onChange(prop, value);
  }, 500);

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ md: 4 }} className="mb-2">
          <LabelIcon
            title={<FormattedMessage id="title" />}
            iconName="text-outline"
          />
          <InputGroup fullWidth>
            <input
              value={optionsData?.title}
              onChange={(e) => onChange("title", e.target.value)}
              type="text"
              placeholder={intl.formatMessage({ id: "title" })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 4 }} className="mb-2">
          <LabelIcon
            title={<FormattedMessage id="machine" />}
            iconName="wifi-outline"
          />
          <SelectMachine
            value={optionsData?.machine}
            onChange={(value) => onChange("machine", value)}
          />
        </Col>
        <Col breakPoint={{ md: 4 }} className="mb-2">
          <LabelIcon
            title={<FormattedMessage id="sensor" />}
            iconName="flash-outline"
          />
          <SelectSensorByMachine
            idMachine={optionsData?.machine?.value}
            value={optionsData?.sensor}
            onChange={(value) => onChange("sensor", value)}
          />
        </Col>

        <Col breakPoint={{ md: 12 }}>
          <SensorValueUse
            onChange={(prop, value) => onChange(prop, value)}
            item={optionsData}
          />
        </Col>
        <Col breakPoint={{ md: 8 }} className="mb-2">
          <Row>
            <Col breakPoint={{ md: 6 }}>
              <LabelIcon
                title={<FormattedMessage id="type.description" />}
                iconName="message-circle-outline"
              />
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
                <LabelIcon
                  title={<FormattedMessage id="unit" />}
                  iconName="droplet-outline"
                />
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
        <Col breakPoint={{ md: 4 }} className="mb-4">
          <LabelIcon
            title={<FormattedMessage id="type.chart.placelholder" />}
            iconName="bar-chart-outline"
          />
          <Select
            options={types_charts}
            placeholder={intl.formatMessage({ id: "type.chart.placelholder" })}
            value={optionsData?.typeChart}
            onChange={(value) => onChange("typeChart", value)}
            menuPosition="fixed"
          />
        </Col>

        <Col breakPoint={{ md: 4 }} className="mb-4">
          <ContainerColor>
            <InputColor
              type="color"
              defaultValue="#3366ff"
              value={optionsData?.color}
              onChange={(e) => changeValueDebounced("color", e.target.value)}
            />
            <TextSpan apparence="s1" className="ml-2">
              <FormattedMessage id="color.info" />
            </TextSpan>
          </ContainerColor>
        </Col>
        <Col breakPoint={{ md: 4 }}>
          <Checkbox
            className="mt-1"
            checked={optionsData?.showDataLabel}
            onChange={(e) => onChange("showDataLabel", !optionsData?.showDataLabel)}
          >
            <TextSpan apparence="s2">
              <FormattedMessage id="show.data.label" />
            </TextSpan>
          </Checkbox>
        </Col>
        <Col breakPoint={{ md: 4 }}>
          <Checkbox
            className="mt-1"
            checked={optionsData?.stepline}
            onChange={(e) => onChange("stepline", !optionsData?.stepline)}
          >
            <TextSpan apparence="s2">
              <FormattedMessage id="stepline" />
            </TextSpan>
          </Checkbox>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RealtimeOptions);
