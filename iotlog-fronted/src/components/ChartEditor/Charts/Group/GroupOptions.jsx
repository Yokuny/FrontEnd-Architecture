import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
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
} from "../../../Select";
import TextSpan from "../../../Text/TextSpan";
import { debounce } from "underscore";
import { LabelIcon } from "../../../Label";

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

const GroupOptions = (props) => {
  const { optionsData } = props;

  const intl = useIntl();

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

  const changeValueDebouncedItem = debounce((index, prop, value) => {
    onChangeItem(index, prop, value);
  }, 500);

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <LabelIcon
            title={<FormattedMessage id="title" />}
            iconName="text-outline"
          />
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
          <LabelIcon
            title={<FormattedMessage id="type.chart.placelholder" />}
            iconName="bar-chart-outline"
          />
          <Select
            options={types_charts}
            placeholder={intl.formatMessage({ id: "type.chart.placelholder" })}
            value={optionsData?.typeChart}
            onChange={(value) => onChange("typeChart", value)}
            menuPosition="fixed"
          />
        </Col>
        <Col breakPoint={{ md: 12 }}>
          {optionsData?.machines?.map((machineItem, i) => {
            return (
              <Row key={i} className="pr-2 pl-2 mb-4">
                <Col breakPoint={{ md: 11 }}>
                  <Row>
                    <Col breakPoint={{ md: 6 }} className="mb-2">
                      <LabelIcon
                        title={<FormattedMessage id="description" />}
                        iconName="message-circle-outline"
                      />
                      <InputGroup fullWidth>
                        <input
                          value={machineItem?.description}
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
                    <Col
                      breakPoint={{ md: 6 }}
                      className="mb-2"
                      id={`machine_${i}`}
                    >
                      <LabelIcon
                        title={<FormattedMessage id="machine" />}
                        iconName="wifi-outline"
                      />
                      <SelectMachine
                        value={machineItem?.machine}
                        onChange={(value) => onChangeItem(i, "machine", value)}
                        placeholder={"machine"}
                      />
                    </Col>
                    <Col breakPoint={{ md: 6 }} className="mb-2">
                      <LabelIcon
                        title={<FormattedMessage id="sensor" />}
                        iconName="flash-outline"
                      />
                      <SelectSensorByMachine
                        placeholder={"sensor"}
                        idMachine={machineItem?.machine?.value}
                        value={machineItem?.sensor}
                        onChange={(value) => onChangeItem(i, "sensor", value)}
                      />
                    </Col>
                    <Col breakPoint={{ md: 4 }} className="mb-2">
                      <LabelIcon
                        title={<FormattedMessage id="decimals.acron" />}
                        iconName="percent-outline"
                      />
                      <InputGroup fullWidth>
                        <input
                          value={machineItem?.sizeDecimals}
                          onChange={(e) =>
                            onChangeItem(i, "sizeDecimals", e.target.value ? parseInt(e.target.value) : 0)
                          }
                          type="number"
                          min={1}
                          max={25}
                          placeholder={intl.formatMessage({
                            id: "decimals.acron",
                          })}
                        />
                      </InputGroup>
                    </Col>
                    <Col breakPoint={{ md: 2 }} className="mb-2">
                      <LabelIcon
                        title={<FormattedMessage id="color" />}
                        iconName="color-palette-outline"
                      />
                      <ContainerColor>
                        <InputColor
                          type="color"
                          defaultValue={"#3366ff"}
                          value={machineItem?.color}
                          onChange={(e) =>
                            changeValueDebouncedItem(i, "color", e.target.value)
                          }
                        />
                        <TextSpan apparence="s1" className="ml-2">
                          <FormattedMessage id="color" />
                        </TextSpan>
                      </ContainerColor>
                    </Col>
                  </Row>
                </Col>
                <Col breakPoint={{ md: 1 }} className="col-flex-center">
                  <Button
                    status="Danger"
                    appearance="ghost"
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
          <Button
            size="Tiny"
            status="Info"
            className="mb-4"
            onClick={() => {
              if (optionsData?.machines?.length) {
                onChange("machines", [...optionsData?.machines, {}]);
                return;
              }
              onChange("machines", [{ color: '#3366ff' }]);
            }}
          >
            <FormattedMessage id="add.machine" />
          </Button>
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <LabelIcon
            title={`${intl.formatMessage({ id: "size.column" })} (%)`}
            iconName="collapse-outline"
          />
          <InputGroup fullWidth>
            <input
              value={optionsData?.sizeColumn}
              onChange={(e) => onChange("sizeColumn", e.target.value)}
              type="number"
              min={1}
              max={100}
              placeholder={`${intl.formatMessage({ id: "size.column" })} (%)`}
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

const GroupOptionsRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupOptions);

export default GroupOptionsRedux;
