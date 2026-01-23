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
} from "../../../Select";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const GroupStatusOptions = (props) => {
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
              <Row key={i} className="mb-4">
                <Col breakPoint={{ md: 10 }}>
                  <SelectMachine
                    value={machineItem?.machine}
                    onChange={(value) => onChangeItem(i, "machine", value)}
                    placeholder={"machine"}
                  />
                  <InputGroup fullWidth className="mt-2">
                    <input
                      value={machineItem?.link}
                      onChange={(e) =>
                        onChangeItem(i, "link", e.target.value)
                      }
                      type="text"
                      placeholder={intl.formatMessage({ id: "link.open.chart" })}
                    />
                  </InputGroup>
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

const GroupStatusOptionsRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupStatusOptions);

export default injectIntl(GroupStatusOptionsRedux);
