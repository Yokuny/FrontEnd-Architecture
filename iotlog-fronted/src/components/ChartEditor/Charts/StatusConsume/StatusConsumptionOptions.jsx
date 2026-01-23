import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import {
  SelectMachine,
  SelectSensorByMachine,
} from "../../../Select";
import { connect } from "react-redux";
import { setDisabledSave, setDataChart } from "../../../../actions";
import styled, { useTheme } from "styled-components";
import { LabelIcon } from "../../../Label";
import { Vessel } from "../../../Icons";
import { Button, EvaIcon } from "@paljs/ui";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const StatusConsumptionOptions = (props) => {
  const { optionsData } = props;
  const intl = useIntl();
  const theme = useTheme();

  const onChange = (prop, value) => {
    props.setOptionsData({
      ...props.optionsData,
      [prop]: value,
    });
    props.setDisabled(false);
  };

  const onChangeItem = (index, prop, value) => {
    let limit = props.optionsData.sensors[index];

    limit[prop] = value;

    props.setOptionsData({
      ...props.optionsData,
      sensors: [
        ...props.optionsData.sensors.slice(0, index),
        limit,
        ...props.optionsData.sensors.slice(index + 1),
      ],
    });
  };

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <LabelIcon iconName="text-outline" title={`${intl.formatMessage({ id: 'title' })} *`} />
          <InputGroup fullWidth className="mt-1">
            <input
              value={optionsData?.title}
              onChange={(e) => onChange("title", e.target.value)}
              type="text"
              placeholder={intl.formatMessage({ id: "title" })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <LabelIcon
            renderIcon={() => (
              <Vessel
                style={{
                  height: 13,
                  width: 13,
                  color: theme.textHintColor,
                  marginRight: 5,
                  marginTop: 2,
                  marginBottom: 2,
                }}
              />
            )}
            title={<FormattedMessage id="vessel" />}
          />
          <div className="mt-1"></div>
          <SelectMachine
            value={optionsData?.machine}
            onChange={(value) => onChange("machine", value)}
          />
        </Col>
        {/* <Col breakPoint={{ md: 6 }} className="mb-4">
          <LabelIcon
            iconName="pin-outline"
            title={`${intl.formatMessage({ id: 'sensor' })} GPS`} />
          <div style={{ marginTop: 0.8 }}></div>
          <SelectSensorByMachine
            idMachine={optionsData?.machine?.value}
            value={optionsData?.sensorLocation}
            onChange={(value) => onChange("sensorLocation", value)}
          />
        </Col>
        <Col breakPoint={{ md: 12 }}>
          <Button
            size="Tiny"
            status="Info"
            className="mb-4 flex-between"
            style={{ padding: 2 }}
            onClick={() => {
              if (optionsData?.sensors?.length) {
                onChange("sensors", [...optionsData?.sensors, {}]);
                return;
              }
              onChange("sensors", [{}]);
            }}
          >
            <EvaIcon name="plus-outline" className="mr-1" />
            <FormattedMessage id="add.sensor.consume" />
          </Button>
          {optionsData?.sensors?.map((sensorItem, i) => {
            return (
              <Row key={i} className="mb-2">
                <Col breakPoint={{ md: 10 }}>
                  <Row>
                    <Col breakPoint={{ md: 12 }} className="mb-2 ml-3">
                      <LabelIcon
                        iconName="droplet"
                        title={`${intl.formatMessage({ id: 'sensor' })} #${i + 1}`} />
                      <div className="mt-1"></div>
                      <SelectSensorByMachine
                        placeholder={"sensor"}
                        idMachine={optionsData?.machine?.value}
                        value={sensorItem?.sensor}
                        onChange={(value) => onChangeItem(i, "sensor", value)}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col
                  breakPoint={{ md: 2 }}
                  style={{ justifyContent: "center" }}
                  className="pt-4"
                >
                  <Button
                    className="mt-3"
                    status="Danger"
                    appearance="ghost"
                    size="Tiny"
                    onClick={() => {
                      onChange(
                        "sensors",
                        optionsData?.sensors.filter((x, j) => j != i)
                      );
                    }}
                  >
                    <EvaIcon name="trash-2-outline" />
                  </Button>
                </Col>
              </Row>
            );
          })}
        </Col> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(StatusConsumptionOptions);
