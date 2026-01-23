import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { connect } from "react-redux";
import { setDisabledSave, setDataChart } from "../../../../actions";
import styled from "styled-components";
import { Button, Checkbox, EvaIcon, Select } from "@paljs/ui";
import {
  SelectMachine,
  SelectSensorByMachine,
  SelectSignalCreateable,
} from "../../../Select";
import TextSpan from "../../../Text/TextSpan";
import DateTime from "../../../DateTime";
import { debounce } from "underscore";

const ContainerRow = styled(Row)`
  overflow-x: hidden;
`;

const InputColor = styled.input`
  width: 50px;
  height: 35px;
  padding: 2px !important;
`;

const ContainerColor = styled(InputGroup)`
  display: flex !important;
  align-items: center !important;
`;

const GoalWorkShiftOptions = (props) => {
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

  const verifyDisable = () => {
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

    verifyDisable();
  };

  const onChangeItem = (index, prop, value) => {
    let workShift = props.optionsData.workShifts[index];
    workShift[prop] = value;
    props.setOptionsData({
      ...props.optionsData,
      workShifts: [
        ...props.optionsData.workShifts.slice(0, index),
        workShift,
        ...props.optionsData.workShifts.slice(index + 1),
      ],
    });
    verifyDisable();
  };

  const onChangeSubItem = (index, indexSubItem, prop, value) => {
    let workShift = props.optionsData.workShifts[index];

    let machineToEdit = workShift.machines[indexSubItem] || {};
    machineToEdit[prop] = value;

    workShift.machines = [
      ...workShift.machines.slice(0, indexSubItem),
      machineToEdit,
      ...workShift.machines.slice(indexSubItem + 1),
    ];

    props.setOptionsData({
      ...props.optionsData,
      workShifts: [
        ...props.optionsData.workShifts.slice(0, index),
        workShift,
        ...props.optionsData.workShifts.slice(index + 1),
      ],
    });
    verifyDisable();
  };

  const changeValueDebounced = debounce((prop, value) => {
    onChange(prop, value)
  }, 500);

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
        <Col breakPoint={{ md: 4 }} className="mb-4">
          <ContainerColor>
            <InputColor
              type="color"
              defaultValue="#ffaa00"
              value={optionsData?.colorGoal}
              onChange={(e) => changeValueDebounced("colorGoal", e.target.value)}
            />
            <TextSpan apparence="s1" className="ml-2">
              <FormattedMessage id="color.goal" />
            </TextSpan>
          </ContainerColor>
        </Col>
        <Col breakPoint={{ md: 4 }} className="mb-4">
          <ContainerColor>
            <InputColor
              type="color"
              defaultValue="#00d68f"
              value={optionsData?.colorProduced}
              onChange={(e) => changeValueDebounced("colorProduced", e.target.value)}
            />
            <TextSpan apparence="s1" className="ml-2">
              <FormattedMessage id="color.produced" />
            </TextSpan>
          </ContainerColor>
        </Col>
        <Col breakPoint={{ md: 4 }} className="mb-4 pt-2">
          <Checkbox
            checked={optionsData?.stacked}
            onChange={(e) => onChange("stacked", !optionsData?.stacked)}
          >
            <TextSpan apparence="s2">
              <FormattedMessage id="chart.stacked" />
            </TextSpan>
          </Checkbox>
        </Col>
        <Col breakPoint={{ md: 12 }}>
          <Button
            size="Tiny"
            status="Info"
            className="mb-4"
            onClick={() => {
              if (optionsData?.workShifts?.length) {
                onChange("workShifts", [...optionsData?.workShifts, {}]);
                return;
              }
              onChange("workShifts", [{}]);
            }}
          >
            <FormattedMessage id="add.work.shift" />
          </Button>
          {optionsData?.workShifts?.map((workShift, i) => {
            return (
              <Row key={i} className="mb-4 mt-2">
                <Col breakPoint={{ md: 10 }}>
                  <Row>
                    <Col breakPoint={{ md: 12 }} className="mb-4">
                      <InputGroup fullWidth>
                        <input
                          value={workShift?.description}
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
                    <Col breakPoint={{ md: 4 }} className="mb-4">
                      <TextSpan apparence="s2">
                        <FormattedMessage id="daily.goal" />
                      </TextSpan>
                      <InputGroup fullWidth>
                        <input
                          value={workShift?.dailyGoal}
                          onChange={(e) =>
                            onChangeItem(i, "dailyGoal", e.target.value)
                          }
                          type="number"
                          placeholder={intl.formatMessage({ id: "daily.goal" })}
                        />
                      </InputGroup>
                    </Col>
                    <Col breakPoint={{ md: 4 }} className="mb-4">
                      <TextSpan apparence="s2">
                        <FormattedMessage id="init.hour" />
                      </TextSpan>
                      <DateTime
                        onChangeTime={(value) =>
                          onChangeItem(i, "initTime", value)
                        }
                        time={workShift?.initTime}
                        onlyTime
                      />
                    </Col>
                    <Col breakPoint={{ md: 4 }} className="mb-4">
                      <TextSpan apparence="s2">
                        <FormattedMessage id="end.hour" />
                      </TextSpan>
                      <DateTime
                        onChangeTime={(value) =>
                          onChangeItem(i, "endTime", value)
                        }
                        time={workShift?.endTime}
                        onlyTime
                      />
                    </Col>
                    <Col breakPoint={{ md: 12 }} className="mb-4">
                      <InputGroup fullWidth>
                        <input
                          value={workShift?.link}
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
                    <Col breakPoint={{ md: 12 }} className="ml-2 pr-1">
                      <Button
                        size="Tiny"
                        status="Success"
                        className="mb-4"
                        onClick={() => {
                          if (workShift?.machines?.length) {
                            onChangeItem(i, "machines", [
                              ...workShift?.machines,
                              {},
                            ]);
                            return;
                          }
                          onChangeItem(i, "machines", [{}]);
                        }}
                      >
                        <FormattedMessage id="add.machine" />
                      </Button>

                      {workShift.machines?.map((machineItem, j) => (
                        <Row key={`${i}_${j}`} className="mb-2">
                          <Col breakPoint={{ md: 10 }}>
                            <Row>
                              <Col breakPoint={{ md: 4 }} className="mb-2">
                                <SelectMachine
                                  value={machineItem?.machine}
                                  onChange={(value) =>
                                    onChangeSubItem(i, j, "machine", value)
                                  }
                                  placeholder={"machine"}
                                />
                              </Col>
                              <Col breakPoint={{ md: 4 }} className="mb-2">
                                <SelectSensorByMachine
                                  placeholder={"sensor"}
                                  idMachine={machineItem?.machine?.value}
                                  value={machineItem?.sensor}
                                  onChange={(value) =>
                                    onChangeSubItem(i, j, "sensor", value)
                                  }
                                />
                              </Col>
                              <Col breakPoint={{ md: 4 }} className="mb-2">
                                <SelectSignalCreateable
                                  placeholder={"signal"}
                                  onChange={(value) =>
                                    onChangeSubItem(i, j, "signal", value)
                                  }
                                  value={machineItem?.signal}
                                  idMachine={machineItem?.machine?.value}
                                  sensorId={machineItem?.sensor?.value}
                                  noOptionsMessage={
                                    !machineItem?.sensor
                                      ? "select.first.sensor"
                                      : "nooptions.message"
                                  }
                                  sensorNew={!!machineItem?.sensor?.__isNew__}
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
                                onChangeItem(
                                  i,
                                  "machines",
                                  workShift?.machines.filter((x, z) => z != j)
                                );
                              }}
                            >
                              <EvaIcon name="trash-2-outline" />
                            </Button>
                          </Col>
                        </Row>
                      ))}
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
                        "workShifts",
                        optionsData?.workShifts.filter((x, j) => j != i)
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

const GoalWorkShiftOptionsRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(GoalWorkShiftOptions);

export default injectIntl(GoalWorkShiftOptionsRedux);
