import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { connect } from "react-redux";
import { setDisabledSave, setDataChart } from "../../../../actions";
import styled from "styled-components";
import { Button, EvaIcon, Select } from "@paljs/ui";
import {
  SelectMachine,
  SelectSensorByMachine,
  SelectSignalCreateable,
} from "../../../Select";
import TextSpan from "../../../Text/TextSpan";
import DateTime from "../../../DateTime";

const ContainerRow = styled(Row)`
  overflow-x: hidden;
`;

const LossDailyOptions = (props) => {
  const { intl, optionsData } = props;

  const types_charts = [
    {
      value: "line",
      label: intl.formatMessage({ id: "line.chart" }),
    },
    {
      value: "area",
      label: intl.formatMessage({ id: "area.chart" }),
    },
    {
      value: "bar",
      label: intl.formatMessage({ id: "bar.chart" }),
    },
  ];

  const verifyDisabled = () => {
    const allDataRequired = !!optionsData?.title;
    if (allDataRequired && props.disabled) {
      props.setDisabled(false);
    } else if (!allDataRequired && !props.disabled) {
      props.setDisabled(true);
    }
  }

  const onChange = (prop, value) => {
    props.setOptionsData({
      ...props.optionsData,
      [prop]: value,
    });

    verifyDisabled();
  };

  const onChangeItem = (index, prop, value) => {
    let machine = props.optionsData.machines[index];

    machine[prop] = value;

    props.setOptionsData({
      ...props.optionsData,
      machines: [
        ...props.optionsData.machines.slice(0, index),
        machine,
        ...props.optionsData.machines.slice(index + 1),
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
          <Select
            options={types_charts}
            placeholder={intl.formatMessage({ id: "type.chart.placelholder" })}
            value={optionsData?.typeChart}
            onChange={(value) => onChange("typeChart", value)}
            menuPosition="fixed"
          />
        </Col>
        <Col breakPoint={{ md: 12 }}>
          <Button
            size="Tiny"
            status="Info"
            className="mb-4"
            onClick={() => {
              if (optionsData?.machines?.length) {
                onChange("machines", [...optionsData?.machines, {}]);
                return;
              }
              onChange("machines", [{}]);
            }}
          >
            <FormattedMessage id="add.machine" />
          </Button>
          {optionsData?.machines?.map((machineItem, i) => {
            return (
              <Row key={i} className="mb-2">
                <Col breakPoint={{ md: 10 }}>
                  <Row>
                    <Col breakPoint={{ md: 12 }} className="mb-2">
                      <SelectMachine
                        value={machineItem?.machine}
                        onChange={(value) => onChangeItem(i, "machine", value)}
                        placeholder={"machine"}
                      />
                    </Col>
                    <Col breakPoint={{ md: 12 }}>
                      <TextSpan apparence="s2"><FormattedMessage id="production"/></TextSpan>
                      <Row>
                        <Col breakPoint={{ md: 6 }} className="mb-2">
                          <SelectSensorByMachine
                            placeholder={"sensor"}
                            idMachine={machineItem?.machine?.value}
                            value={machineItem?.sensorProduction}
                            onChange={(value) =>
                              onChangeItem(i, "sensorProduction", value)
                            }
                          />
                        </Col>
                        <Col breakPoint={{ md: 6 }} className="mb-2">
                          <SelectSignalCreateable
                            placeholder={"signal"}
                            onChange={(value) =>
                              onChangeItem(i, "signalProduction", value)
                            }
                            value={machineItem?.signalProduction}
                            idMachine={machineItem?.machine?.value}
                            sensorId={machineItem?.sensorProduction?.value}
                            noOptionsMessage={
                              !machineItem?.sensorProduction
                                ? "select.first.sensor"
                                : "nooptions.message"
                            }
                            sensorNew={!!machineItem?.sensorProduction?.__isNew__}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col breakPoint={{ md: 12 }}>
                      <TextSpan apparence="s2"><FormattedMessage id="loss"/></TextSpan>
                      <Row>
                        <Col breakPoint={{ md: 6 }} className="mb-2">
                          <SelectSensorByMachine
                            placeholder={"sensor"}
                            idMachine={machineItem?.machine?.value}
                            value={machineItem?.sensorLoss}
                            onChange={(value) =>
                              onChangeItem(i, "sensorLoss", value)
                            }
                          />
                        </Col>
                        <Col breakPoint={{ md: 6 }} className="mb-2">
                          <SelectSignalCreateable
                            placeholder={"signal"}
                            onChange={(value) =>
                              onChangeItem(i, "signalLoss", value)
                            }
                            value={machineItem?.signalLoss}
                            idMachine={machineItem?.machine?.value}
                            sensorId={machineItem?.sensorLoss?.value}
                            noOptionsMessage={
                              !machineItem?.sensorLoss
                                ? "select.first.sensor"
                                : "nooptions.message"
                            }
                            sensorNew={!!machineItem?.sensorLoss?.__isNew__}
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col breakPoint={{ md: 12 }} className="mb-4">
                      <InputGroup fullWidth>
                        <input
                          value={machineItem?.link}
                          onChange={(e) =>
                            onChangeItem(i, "link", e.target.value)
                          }
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "link.open.chart",
                          })}
                        />
                      </InputGroup>
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
                        "machines",
                        optionsData?.machines.filter((x, j) => j != i)
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
        <Col breakPoint={{ md: 6 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="init.hour" />
          </TextSpan>
          <DateTime
            onChangeTime={(value) => onChange("initTime", value)}
            time={optionsData?.initTime}
            onlyTime
          />
        </Col>
        <Col breakPoint={{ md: 6 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="end.hour" />
          </TextSpan>
          <DateTime
            onChangeTime={(value) => onChange("endTime", value)}
            time={optionsData?.endTime}
            onlyTime
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

const LossDailyOptionsRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(LossDailyOptions);

export default injectIntl(LossDailyOptionsRedux);
