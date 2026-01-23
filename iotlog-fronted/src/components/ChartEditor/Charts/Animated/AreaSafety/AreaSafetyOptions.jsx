import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import {
  SelectMachine,
  SelectSafety,
  SelectSensorByMachine,
  SelectSignalCreateable,
} from "../../../../Select";
import { connect } from "react-redux";
import { setDisabledSave, setDataChart } from "../../../../../actions";
import styled from "styled-components";
import { Button, EvaIcon } from "@paljs/ui";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const AreaSafetyOptions = (props) => {
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

  const onChangeItem = (index, prop, value) => {
    let sensorCondition = props.optionsData.sensorsCondition[index];

    sensorCondition[prop] = value;

    props.setOptionsData({
      ...props.optionsData,
      sensorsCondition: [
        ...props.optionsData.sensorsCondition.slice(0, index),
        sensorCondition,
        ...props.optionsData.sensorsCondition.slice(index + 1),
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
        <Col breakPoint={{ md: 12 }}>
          <Button
            size="Tiny"
            status="Info"
            className="mb-4"
            onClick={() => {
              if (optionsData?.sensorsCondition?.length) {
                onChange("sensorsCondition", [
                  ...optionsData?.sensorsCondition,
                  {},
                ]);
                return;
              }
              onChange("sensorsCondition", [{}]);
            }}
          >
            <FormattedMessage id="add.invaded" />
          </Button>
          {optionsData?.sensorsCondition?.map((sensorConditionItem, i) => {
            return (
              <Row key={i} className="mb-2">
                <Col breakPoint={{ md: 10 }}>
                  <Row>
                    <Col breakPoint={{ md: 4 }} className="mb-2">
                      <SelectSensorByMachine
                        placeholder={"sensor"}
                        idMachine={optionsData?.machine?.value}
                        value={sensorConditionItem?.sensor}
                        onChange={(value) => onChangeItem(i, "sensor", value)}
                      />
                    </Col>
                    <Col breakPoint={{ md: 4 }} className="mb-2">
                      <SelectSignalCreateable
                        placeholder={"signal"}
                        onChange={(value) => onChangeItem(i, "signal", value)}
                        value={sensorConditionItem?.signal}
                        idMachine={optionsData?.machine?.value}
                        sensorId={sensorConditionItem?.sensor?.value}
                        noOptionsMessage={
                          !sensorConditionItem?.sensor
                            ? "select.first.sensor"
                            : "nooptions.message"
                        }
                        sensorNew={!!sensorConditionItem?.sensor?.__isNew__}
                      />
                    </Col>
                    <Col breakPoint={{ md: 4 }} className="mb-2">
                      <SelectSafety
                        value={sensorConditionItem?.conditionColor}
                        onChange={(value) =>
                          onChangeItem(i, "conditionColor", value)
                        }
                      />
                    </Col>
                  </Row>
                </Col>
                <Col
                  breakPoint={{ md: 2 }}
                  style={{ justifyContent: "center" }}
                >
                  <Button
                    status="Danger"
                    size="Tiny"
                    onClick={() => {
                      onChange(
                        "sensorsCondition",
                        optionsData?.sensorsCondition.filter((x, j) => j != i)
                      );
                    }}
                  >
                    <EvaIcon name="trash-2-outline" />
                  </Button>
                </Col>
              </Row>
            );
          })}
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

const AreaSafetyOptionsRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(AreaSafetyOptions);

export default injectIntl(AreaSafetyOptionsRedux);
