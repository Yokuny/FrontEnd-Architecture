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
import { debounce } from "underscore";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
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

const GroupBooleanOptions = (props) => {
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
    {
      value: "pie",
      label: intl.formatMessage({ id: "pie.chart" }),
    },
  ];

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

  const changeValueDebounced = debounce((prop, value) => {
    onChange(prop, value);
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
              <Row key={i}>
                <Col breakPoint={{ md: 10 }}>
                  <Row>
                    <Col
                      breakPoint={{ md: 4 }}
                      className="mb-4"
                      id={`machine_${i}`}
                    >
                      <SelectMachine
                        value={machineItem?.machine}
                        onChange={(value) => onChangeItem(i, "machine", value)}
                        placeholder={"machine"}
                      />
                    </Col>
                    <Col breakPoint={{ md: 4 }} className="mb-4">
                      <SelectSensorByMachine
                        placeholder={"sensor"}
                        idMachine={machineItem?.machine?.value}
                        value={machineItem?.sensor}
                        onChange={(value) => onChangeItem(i, "sensor", value)}
                      />
                    </Col>
                    <Col breakPoint={{ md: 4 }} className="mb-4">
                      <SelectSignalCreateable
                        placeholder={"signal"}
                        onChange={(value) => onChangeItem(i, "signal", value)}
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
          <Checkbox
            checked={optionsData?.isViewThanMoreZero}
            onChange={(e) =>
              onChange("isViewThanMoreZero", !optionsData?.isViewThanMoreZero)
            }
          >
            <TextSpan apparence="s2">
              <FormattedMessage id="view.more.zero" />
            </TextSpan>
          </Checkbox>
        </Col>
        {optionsData?.typeChart?.value !== "pie" && (
          <Col breakPoint={{ md: 6 }} className="mb-4">
            <ContainerColor>
              <InputColor
                type="color"
                defaultValue={"#3366ff"}
                value={optionsData?.color}
                onChange={(e) => changeValueDebounced("color", e.target.value)}
              />
              <TextSpan apparence="s1" className="ml-2">
                <FormattedMessage id="color.info" />
              </TextSpan>
            </ContainerColor>
          </Col>
        )}
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

const GroupBooleanOptionsRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupBooleanOptions);

export default injectIntl(GroupBooleanOptionsRedux);
