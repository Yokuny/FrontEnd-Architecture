import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import {
  SelectMachine,
  SelectSensorByMachine,
  SelectSignalCreateable,
} from "../../../Select";
import TextSpan from "../../../Text/TextSpan";
import { connect } from "react-redux";
import { setDisabledSave, setDataChart } from "../../../../actions";
import styled from "styled-components";
import DateTime from "../../../DateTime";

const ContainerRow = styled(Row)`

`;

const GoalOperatorByMachineOptions = (props) => {
  const { intl, optionsData } = props;

  const onChange = (prop, value) => {
    props.setOptionsData({
      ...props.optionsData,
      [prop]: value,
    });

    const allDataRequired =
      !!optionsData?.machine?.value && !!optionsData?.title;
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
        <Col breakPoint={{ md: 12 }}>
          <TextSpan apparence="s2">
            <FormattedMessage id="sensor.production" />
          </TextSpan>
          <Row className="mt-1">
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <SelectSensorByMachine
                idMachine={optionsData?.machine?.value}
                value={optionsData?.sensorProduction}
                onChange={(value) => onChange("sensorProduction", value)}
              />
            </Col>
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <SelectSignalCreateable
                placeholder={intl.formatMessage({
                  id: "signal.placeholder",
                })}
                onChange={(value) => onChange("signalProduction", value)}
                value={optionsData?.signalProduction}
                idMachine={optionsData?.machine?.value}
                sensorId={optionsData?.sensorProduction?.value}
                noOptionsMessage={
                  !optionsData?.sensorProduction
                    ? "select.first.sensor"
                    : "nooptions.message"
                }
                sensorNew={!!optionsData?.sensorProduction?.__isNew__}
              />
            </Col>
          </Row>
        </Col>
        <Col breakPoint={{ md: 12 }}>
          <TextSpan apparence="s2">
            <FormattedMessage id="sensor.operator" />
          </TextSpan>
          <Row className="mt-1">
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <SelectSensorByMachine
                idMachine={optionsData?.machine?.value}
                value={optionsData?.sensorOperator}
                onChange={(value) => onChange("sensorOperator", value)}
              />
            </Col>
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <SelectSignalCreateable
                placeholder={intl.formatMessage({
                  id: "signal.placeholder",
                })}
                onChange={(value) => onChange("signalOperator", value)}
                value={optionsData?.signalOperator}
                idMachine={optionsData?.machine?.value}
                sensorId={optionsData?.sensorOperator?.value}
                noOptionsMessage={
                  !optionsData?.sensorOperator
                    ? "select.first.sensor"
                    : "nooptions.message"
                }
                sensorNew={!!optionsData?.sensorOperator?.__isNew__}
              />
            </Col>
          </Row>
        </Col>
        <Col breakPoint={{ md: 4 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="init.hour" />
          </TextSpan>
          <DateTime
            onChangeTime={(value) => onChange("initTime", value)}
            time={optionsData?.initTime}
            onlyTime
          />
        </Col>
        <Col breakPoint={{ md: 4 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="end.hour" />
          </TextSpan>
          <DateTime
            onChangeTime={(value) => onChange("endTime", value)}
            time={optionsData?.endTime}
            onlyTime
          />
        </Col>
        <Col breakPoint={{ md: 4 }} className="mb-4">
        <TextSpan apparence="s2"><FormattedMessage id="daily.goal" /></TextSpan>
          <InputGroup fullWidth>
            <input
              value={optionsData?.dailyGoal}
              onChange={(e) => onChange("dailyGoal", e.target.value)}
              type="number"
              placeholder={intl.formatMessage({ id: "daily.goal" })}
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

const GoalOperatorByMachineOptionsRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(GoalOperatorByMachineOptions);

export default injectIntl(GoalOperatorByMachineOptionsRedux);
