import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { SelectMachine, SelectSensorByMachine } from "../../../../Select";
import TextSpan from "../../../../Text/TextSpan";
import { connect } from "react-redux";
import styled from "styled-components";
import { setDataChart, setDisabledSave } from "../../../../../actions";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const GaugeCompassOptions = (props) => {
  const { optionsData } = props;
  const intl = useIntl();
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
)(GaugeCompassOptions);
