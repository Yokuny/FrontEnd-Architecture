import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { connect } from "react-redux";
import { setDisabledSave, setDataChart } from "../../../../actions";
import styled from "styled-components";
import { Button, EvaIcon } from "@paljs/ui";
import {
  SelectMachine,
  SelectParams,
  SelectSensorByMachine,
  SelectSignalCreateable,
} from "../../../Select";

const ContainerRow = styled(Row)`
  overflow-x: hidden;
`;

const RouteOptions = (props) => {
  const { intl, optionsData } = props;

  const verifyDisabled = () => {
    const allDataRequired = !!optionsData?.title;
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
    let sensorEdit = props.optionsData.sensors[index];

    sensorEdit[prop] = value;

    props.setOptionsData({
      ...props.optionsData,
      sensors: [
        ...props.optionsData.sensors.slice(0, index),
        sensorEdit,
        ...props.optionsData.sensors.slice(index + 1),
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
        <Col breakPoint={{ md: 12 }} className="mb-2">
          <SelectMachine
            value={optionsData?.machine}
            onChange={(value) => onChange("machine", value)}
            placeholder={"machine"}
          />
        </Col>
        <Col breakPoint={{ md: 12 }}>
          <Button
            size="Tiny"
            status="Info"
            className="mb-4"
            onClick={() => {
              if (optionsData?.sensors?.length) {
                onChange("sensors", [...optionsData?.sensors, {}]);
                return;
              }
              onChange("sensors", [{}]);
            }}
          >
            <FormattedMessage id="add.sensor" />
          </Button>
          {optionsData?.sensors?.map((sensorItem, i) => {
            return (
              <Row key={i} className="mb-2">
                <Col breakPoint={{ md: 10 }}>
                  <Row>
                    <Col breakPoint={{ md: 12 }} className="mb-4">
                      <InputGroup fullWidth>
                        <input
                          value={sensorItem?.description}
                          onChange={(e) =>
                            onChangeItem(i, "description", e.target.value)
                          }
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "description",
                          })}
                        />
                      </InputGroup>
                    </Col>
                    <Col breakPoint={{ md: 6 }} className="mb-4">
                      <SelectSensorByMachine
                        placeholder={"sensor"}
                        idMachine={optionsData?.machine?.value}
                        value={sensorItem?.sensor}
                        onChange={(value) => onChangeItem(i, "sensor", value)}
                      />
                    </Col>
                    <Col breakPoint={{ md: 6 }} className="mb-4">
                      <SelectSignalCreateable
                        placeholder={"signal"}
                        onChange={(value) => onChangeItem(i, "signal", value)}
                        value={sensorItem?.signal}
                        idMachine={optionsData?.machine?.value}
                        sensorId={sensorItem?.sensor?.value}
                        noOptionsMessage={
                          !sensorItem?.sensor
                            ? "select.first.sensor"
                            : "nooptions.message"
                        }
                        sensorNew={!!sensorItem?.sensor?.__isNew__}
                      />
                    </Col>
                    <Col breakPoint={{ md: 12 }} className="mb-2">
                      <SelectParams
                        onChange={(value) => onChangeItem(i, "params", value)}
                        value={sensorItem?.params}
                        isClearable
                        placeholderID="link.params"
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

const RouteOptionsRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(RouteOptions);

export default injectIntl(RouteOptionsRedux);
