import React from "react";
import { useIntl } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import {
  SelectMachine,
  SelectSensorByMachine,
} from "../../../Select";
import { LabelIcon } from "../../../Label";
import { connect } from "react-redux";
import { setDisabledSave, setDataChart } from "../../../../actions";
import styled from "styled-components";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const BatteryChargeOptions = (props) => {

  const { optionsData } = props;
  const intl = useIntl();

  const verifyDisabled = () => {
    const allDataRequired =
      !!optionsData?.sensorPercent?.value &&
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
        <Col breakPoint={{ md: 12 }} className="mb-2">
          <LabelIcon
            title={`${intl.formatMessage({ id: "title" })} *`}
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
        <Col breakPoint={{ md: 6 }} className="mb-2">
          <LabelIcon
            title={`${intl.formatMessage({ id: "machine" })} *`}
          />
          <SelectMachine
            value={optionsData?.machine}
            onChange={(value) => onChange("machine", value)}
          />
        </Col>
        <Col breakPoint={{ md: 6 }} className="mb-2">
          <LabelIcon
            title={`${intl.formatMessage({ id: "percent" })} *`}
          />
          <SelectSensorByMachine
            idMachine={optionsData?.machine?.value}
            value={optionsData?.sensorPercent}
            onChange={(value) => onChange("sensorPercent", value)}
            placeholder="sensor"
          />
        </Col>


        <Col breakPoint={{ md: 4 }} className="mb-2">
          <LabelIcon
            title={`${intl.formatMessage({ id: "status" })}`}
          />
          <SelectSensorByMachine
            idMachine={optionsData?.machine?.value}
            value={optionsData?.sensorStatus}
            onChange={(value) => onChange("sensorStatus", value)}
            placeholder="sensor"
          />
        </Col>

        <Col breakPoint={{ md: 8 }} className="mb-2">
        <LabelIcon
            title={`${intl.formatMessage({ id: "link" })}`}
          />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatteryChargeOptions);
