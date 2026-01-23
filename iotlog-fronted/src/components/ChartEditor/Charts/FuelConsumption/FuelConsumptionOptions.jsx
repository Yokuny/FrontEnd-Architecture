import Col from "@paljs/ui/Col";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import styled from "styled-components";
import { setDataChart, setDisabledSave } from "../../../../actions";
import { LabelIcon } from "../../../Label";
import { SelectMachine } from "../../../Select";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const FuelConsumptionOptions = (props) => {
  const { optionsData } = props;

  const intl = useIntl();

  const onChange = (prop, value) => {
    props.setOptionsData({
      ...props.optionsData,
      [prop]: value,
    });
    props.setDisabled(false);
  };

  return (
    <ContainerRow>
      <Col breakPoint={{ md: 6 }} className="mb-4">
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
      <Col
        breakPoint={{ md: 6 }}
        className="mb-4"
      >
        <LabelIcon
          title={<FormattedMessage id="machine" />}
          iconName="wifi-outline"
        />
        <div className="mt-1"></div>
        <SelectMachine
          value={optionsData?.machine}
          onChange={(value) => onChange("machine", value)}
          placeholder={"machine"}
        />
      </Col>

      <Col breakPoint={{ md: 4 }} className="mb-4">
        <LabelIcon
          title={<FormattedMessage id="qt.days.search" />}
          iconName="calendar-outline"
        />
        <InputGroup fullWidth className="mt-1">
          <input
            value={optionsData?.lastDaysSearch}
            onChange={(e) => onChange("lastDaysSearch", e.target.value)}
            type="number"
            min={1}
            placeholder={intl.formatMessage({ id: "qt.days.search" })}
          />
        </InputGroup>
      </Col>
    </ContainerRow>
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
)(FuelConsumptionOptions);
