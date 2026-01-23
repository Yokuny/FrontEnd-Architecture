import React from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { SelectMachine, SelectSensorByMachine } from "../../../../Select";
import { connect } from "react-redux";
import { setDisabledSave, setDataChart } from "../../../../../actions";
import styled from "styled-components";
import { Button, EvaIcon } from "@paljs/ui";
import ItemType from "./ItemType";
import TextSpan from "../../../../Text/TextSpan";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const ListInfoOptions = (props) => {
  const { optionsData } = props;

  const intl = useIntl();

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

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <TextSpan apparence="s2">
            <FormattedMessage id="title" /> *
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <input
              value={optionsData?.title}
              onChange={(e) => onChange("title", e.target.value)}
              type="text"
              placeholder={intl.formatMessage({ id: "title" })}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 12 }} className="m-2">
          {optionsData?.machines?.map((machineItem, i) => {
            return (
              <Row key={i}>
                <Col breakPoint={{ md: 11 }}>
                  <Row>
                    <Col breakPoint={{ md: 12 }} className="mb-4">
                      <TextSpan apparence="s2">
                        <FormattedMessage id="description" /> *
                      </TextSpan>
                      <InputGroup fullWidth className="mt-1">
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
                    <Col breakPoint={{ md: 6 }} className="mb-2">
                      <TextSpan apparence="s2">
                        <FormattedMessage id="machine" /> *
                      </TextSpan>
                      <div className="mt-1"></div>
                      <SelectMachine
                        value={machineItem?.machine}
                        onChange={(value) => onChangeItem(i, "machine", value)}
                        placeholder={"machine"}
                      />
                    </Col>
                    <Col breakPoint={{ md: 6 }} className="mb-2">
                      <TextSpan apparence="s2">
                        <FormattedMessage id="sensor" /> *
                      </TextSpan>
                      <div className="mt-1"></div>
                      <SelectSensorByMachine
                        placeholder={"sensor"}
                        idMachine={machineItem?.machine?.value}
                        value={machineItem?.sensor}
                        onChange={(value) => onChangeItem(i, "sensor", value)}
                      />
                    </Col>
                    <Col breakPoint={{ md: 9 }} className="mb-2">
                      <TextSpan apparence="s2">
                        <FormattedMessage id="type.info.placelholder" /> *
                      </TextSpan>
                      <div className="mt-1"></div>
                      <ItemType
                        item={machineItem}
                        onChange={(prop, value) => onChangeItem(i, prop, value)}
                      />
                    </Col>
                    <Col breakPoint={{ md: 3 }} className="mb-2">
                      <TextSpan apparence="s2">
                        <FormattedMessage id="unit" />
                      </TextSpan>
                      <InputGroup fullWidth className="mt-1">
                        <input
                          value={machineItem?.unit}
                          onChange={(e) =>
                            onChangeItem(i, "unit", e.target.value)
                          }
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "unit",
                          })}
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                </Col>
                <Col breakPoint={{ md: 1 }} className="col-flex-center">
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

export default connect(mapStateToProps, mapDispatchToProps)(ListInfoOptions);
