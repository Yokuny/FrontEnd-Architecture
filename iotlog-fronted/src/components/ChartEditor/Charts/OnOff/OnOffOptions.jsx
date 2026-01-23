import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { connect } from "react-redux";
import styled from "styled-components";
import { setDataChart, setDisabledSave } from "../../../../actions";
import { LabelIcon, SelectMachine } from "../../..";
import { SelectSensorByMachine } from "../../../Select";
import { Select } from "@paljs/ui";
import { TYPE_CONVERT_VALUE } from "../History/Constants";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const OnOffOptions = (props) => {
  const { optionsData } = props;

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

  const onChange = (prop, value) => {
    props.setOptionsData({
      ...props.optionsData,
      [prop]: value,
    });

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
            iconName="wifi-outline"
            title={<FormattedMessage id="machine" />}
          />
          <div className="mt-1"></div>
          <SelectMachine
            value={optionsData?.machine}
            onChange={(value) => onChange("machine", value)}
          />
        </Col>
        <Col breakPoint={{ md: 4 }} className="mb-4">
          <LabelIcon
            iconName="flash-outline"
            title={<FormattedMessage id="sensor" />}
          />
          <div className="mt-1"></div>
          <SelectSensorByMachine
            idMachine={optionsData?.machine?.value}
            value={optionsData?.sensor}
            onChange={(value) => onChange("sensor", value)}
          />
        </Col>
        <Col breakPoint={{ md: 4 }} className="mb-4">
          <LabelIcon
            title={"Link"}
            iconName="link-2-outline"
          />
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
        <Col breakPoint={{ md: 4 }} className="mb-2">
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
              onChange("typeVisualization", value)
            }
            value={optionsData?.typeVisualization}
          />
        </Col>
        {optionsData?.typeVisualization?.value === TYPE_CONVERT_VALUE.FUNCTION &&
          <Col breakPoint={{ md: 8 }} className="mb-2">
            <LabelIcon
              title={<FormattedMessage id="function" />}
              iconName="code-outline"
            />
            <InputGroup fullWidth className="mt-1">
              <textarea
                type="text"
                placeholder={`value > 10`}
                value={optionsData?.function}
                onChange={(e) => onChange("function", e.target.value)}
              />
            </InputGroup>
          </Col>}
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
)(OnOffOptions);
