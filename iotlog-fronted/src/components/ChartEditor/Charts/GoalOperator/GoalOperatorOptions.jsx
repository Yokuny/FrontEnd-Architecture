import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import {
  SelectSensor,
  SelectUserCodeIntegration,
} from "../../../Select";
import TextSpan from "../../../Text/TextSpan";
import { connect } from "react-redux";
import { setDisabledSave, setDataChart } from "../../../../actions";
import styled from "styled-components";
import DateTime from "../../../DateTime";
import { Button, Checkbox, EvaIcon, Select } from "@paljs/ui";
import { debounce } from "underscore";

const ContainerRow = styled(Row)``;

const InputColor = styled.input`
  width: 50px;
  height: 35px;
  padding: 2px !important;
`;

const ContainerColor = styled(InputGroup)`
  display: flex !important;
  align-items: center !important;
`;


const GoalOperatorOptions = (props) => {
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
    let machine = props.optionsData.operators[index];

    machine[prop] = value;

    props.setOptionsData({
      ...props.optionsData,
      operators: [
        ...props.optionsData.operators.slice(0, index),
        machine,
        ...props.optionsData.operators.slice(index + 1),
      ],
    });
    verifyDisabled();
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
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <SelectSensor
            value={optionsData?.sensorProduction}
            onChange={(value) => onChange("sensorProduction", value)}
            placeholderID="sensor.production"
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
              if (optionsData?.operators?.length) {
                onChange("operators", [...optionsData?.operators, {}]);
                return;
              }
              onChange("operators", [{}]);
            }}
          >
            <FormattedMessage id="add.operator" />
          </Button>
          {optionsData?.operators?.map((operatorItem, i) => {
            return (
              <Row key={i} className="mb-2">
                <Col breakPoint={{ md: 10 }}>
                  <Row>
                    <Col breakPoint={{ md: 9 }} className="mb-4">
                      <TextSpan apparence="s2">
                        <FormattedMessage id="operator" />
                      </TextSpan>
                      <SelectUserCodeIntegration
                        className="mt-1"
                        value={operatorItem?.operator}
                        onChange={(value) => onChangeItem(i, "operator", value)}
                      />
                    </Col>
                    <Col breakPoint={{ md: 3 }} className="mb-4">
                      <TextSpan apparence="s2">
                        <FormattedMessage id="goal" />
                      </TextSpan>
                      <InputGroup fullWidth className="mt-1">
                        <input
                          value={operatorItem?.dailyGoal}
                          style={{ lineHeight: "0.5rem" }}
                          onChange={(e) =>
                            onChangeItem(i, "dailyGoal", parseInt(e.target.value))
                          }
                          type="number"
                          placeholder={intl.formatMessage({ id: "goal" })}
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                </Col>
                <Col
                  breakPoint={{ md: 2 }}
                  style={{ justifyContent: "center" }}
                  className="pt-2"
                >
                  <Button
                    status="Danger"
                    className="mt-4"
                    size="Tiny"
                    onClick={() => {
                      onChange(
                        "operators",
                        optionsData?.operators.filter((x, j) => j != i)
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

const GoalOperatorOptionsRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(GoalOperatorOptions);

export default injectIntl(GoalOperatorOptionsRedux);
