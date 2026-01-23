import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import {
  SelectMachine,
  SelectSensorByMachine,
  SelectSignalCreateable,
} from "../../../../Select";
import { connect } from "react-redux";
import { setDisabledSave, setDataChart } from "../../../../../actions";
import styled from "styled-components";
import TextSpan from "../../../../Text/TextSpan";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const ModeCombineOptions = (props) => {
  const { intl, optionsData } = props;

  const verifyDisabled = () => {
    const allDataRequired =
      !!optionsData?.machine?.value && !!optionsData?.title;
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
          <TextSpan apparence="s1">
            <FormattedMessage id="manual" />
          </TextSpan>
          <Row className="mt-2">
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <SelectSensorByMachine
                placeholder={"sensor"}
                idMachine={optionsData?.machine?.value}
                value={optionsData?.sensorManual}
                onChange={(value) => onChange("sensorManual", value)}
              />
            </Col>
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <SelectSignalCreateable
                placeholder={"signal"}
                onChange={(value) => onChange("signalManual", value)}
                value={optionsData?.signalManual}
                idMachine={optionsData?.machine?.value}
                sensorId={optionsData?.sensorManual?.value}
                noOptionsMessage={
                  !optionsData?.sensorManual
                    ? "select.first.sensor"
                    : "nooptions.message"
                }
                sensorNew={!!optionsData?.sensorManual?.__isNew__}
              />
            </Col>
          </Row>
        </Col>

        <Col breakPoint={{ md: 12 }}>
          <TextSpan apparence="s1">
            <FormattedMessage id="automatic" />
          </TextSpan>
          <Row className="mt-2">
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <SelectSensorByMachine
                placeholder={"sensor"}
                idMachine={optionsData?.machine?.value}
                value={optionsData?.sensorAutomatic}
                onChange={(value) => onChange("sensorAutomatic", value)}
              />
            </Col>
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <SelectSignalCreateable
                placeholder={"signal"}
                onChange={(value) => onChange("signalAutomatic", value)}
                value={optionsData?.signalAutomatic}
                idMachine={optionsData?.machine?.value}
                sensorId={optionsData?.sensorAutomatic?.value}
                noOptionsMessage={
                  !optionsData?.sensorAutomatic
                    ? "select.first.sensor"
                    : "nooptions.message"
                }
                sensorNew={!!optionsData?.sensorAutomatic?.__isNew__}
              />
            </Col>
          </Row>
        </Col>

        <Col breakPoint={{ md: 12 }}>
          <TextSpan apparence="s1">
            <FormattedMessage id="active.mode" />
          </TextSpan>
          <Row className="mt-2">
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <SelectSensorByMachine
                placeholder={"sensor"}
                idMachine={optionsData?.machine?.value}
                value={optionsData?.sensorActive}
                onChange={(value) => onChange("sensorActive", value)}
              />
            </Col>
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <SelectSignalCreateable
                placeholder={"signal"}
                onChange={(value) => onChange("signalActive", value)}
                value={optionsData?.signalActive}
                idMachine={optionsData?.machine?.value}
                sensorId={optionsData?.sensorActive?.value}
                noOptionsMessage={
                  !optionsData?.sensorActive
                    ? "select.first.sensor"
                    : "nooptions.message"
                }
                sensorNew={!!optionsData?.sensorActive?.__isNew__}
              />
            </Col>
          </Row>
        </Col>

        <Col breakPoint={{ md: 12 }}>
          <TextSpan apparence="s1">
            <FormattedMessage id="busy" />
          </TextSpan>
          <Row className="mt-2">
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <SelectSensorByMachine
                placeholder={"sensor"}
                idMachine={optionsData?.machine?.value}
                value={optionsData?.sensorBusy}
                onChange={(value) => onChange("sensorBusy", value)}
              />
            </Col>
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <SelectSignalCreateable
                placeholder={"signal"}
                onChange={(value) => onChange("signalBusy", value)}
                value={optionsData?.signalBusy}
                idMachine={optionsData?.machine?.value}
                sensorId={optionsData?.sensorBusy?.value}
                noOptionsMessage={
                  !optionsData?.sensorBusy
                    ? "select.first.sensor"
                    : "nooptions.message"
                }
                sensorNew={!!optionsData?.sensorBusy?.__isNew__}
              />
            </Col>
          </Row>
        </Col>

        <Col breakPoint={{ md: 12 }}>
          <TextSpan apparence="s1">
            <FormattedMessage id="avaliable" />
          </TextSpan>
          <Row className="mt-2">
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <SelectSensorByMachine
                placeholder={"sensor"}
                idMachine={optionsData?.machine?.value}
                value={optionsData?.sensorAvaliable}
                onChange={(value) => onChange("sensorAvaliable", value)}
              />
            </Col>
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <SelectSignalCreateable
                placeholder={"signal"}
                onChange={(value) => onChange("signalAvaliable", value)}
                value={optionsData?.signalAvaliable}
                idMachine={optionsData?.machine?.value}
                sensorId={optionsData?.sensorAvaliable?.value}
                noOptionsMessage={
                  !optionsData?.sensorAvaliable
                    ? "select.first.sensor"
                    : "nooptions.message"
                }
                sensorNew={!!optionsData?.sensorAvaliable?.__isNew__}
              />
            </Col>
          </Row>
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

const ModeCombineOptionsRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(ModeCombineOptions);

export default injectIntl(ModeCombineOptionsRedux);
