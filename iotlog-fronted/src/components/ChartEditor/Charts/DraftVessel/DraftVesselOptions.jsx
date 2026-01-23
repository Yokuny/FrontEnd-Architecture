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
import { connect } from "react-redux";
import { setDisabledSave, setDataChart } from "../../../../actions";
import styled from "styled-components";
import { LabelIcon } from "../../../Label";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const DraftVesselOptions = (props) => {
  const { optionsData } = props;

  const intl = useIntl();

  const onChange = (prop, value) => {
    props.setOptionsData({
      ...props.optionsData,
      [prop]: value,
    });
    props.setDisabled(false);
    // const allDataRequired =
    //   !!optionsData?.sensorBow?.value &&
    //   !!optionsData?.sensorStern?.value &&
    //   !!optionsData?.machine?.value &&
    //   !!optionsData?.title;
    // if (allDataRequired && props.disabled) {
    //   props.setDisabled(false);
    // } else if (!allDataRequired && !props.disabled) {
    //   props.setDisabled(true);
    // }
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
        <Col
          breakPoint={{ md: 4 }}
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
        <Col breakPoint={{ md: 4 }} className="mb-2">
          <LabelIcon
            title={`${intl.formatMessage({ id: 'sensor' })} Draft Stern`}
            iconName="arrow-back-outline"
          />
          <div className="mt-1"></div>
          <SelectSensorByMachine
            placeholderText={"Draft Stern"}
            idMachine={optionsData?.machine?.value}
            value={optionsData?.sensorStern}
            onChange={(value) => onChange("sensorStern", value)}
          />
        </Col>
        <Col breakPoint={{ md: 4 }} className="mb-2">
          <LabelIcon
            title={`${intl.formatMessage({ id: 'sensor' })} Draft Bow`}
            iconName="arrow-forward-outline"
          />
          <div className="mt-1"></div>
          <SelectSensorByMachine
            placeholderText={"Draft Bow"}
            idMachine={optionsData?.machine?.value}
            value={optionsData?.sensorBow}
            onChange={(value) => onChange("sensorBow", value)}
          />
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
)(DraftVesselOptions);
